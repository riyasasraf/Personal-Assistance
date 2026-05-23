import { createContext, useContext, useState, useCallback } from "react";
import * as api from "../services/api";

const SkillsContext = createContext(null);

export const SkillsProvider = ({ children }) => {
  const [skills, setSkills] = useState([]);
  const [currentSkill, setCurrentSkill] = useState(null);
  const [topics, setTopics] = useState([]);
  const [subtopicsMap, setSubtopicsMap] = useState({}); // topicId -> subtopics
  const [tasksMap, setTasksMap] = useState({}); // subtopicId -> tasks
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all skills - MEMOIZED
  const fetchSkills = useCallback(
    async (search = "", status = "", level = "") => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getSkills(search, status, level);
        setSkills(data || []);
      } catch (err) {
        setError(err.message || "Failed to fetch skills");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Fetch full skill details (Topics, Subtopics, and Tasks) - MEMOIZED
  const fetchSkillDetail = useCallback(async (skillId) => {
    setLoading(true);
    setError(null);
    try {
      const skillData = await api.getSkill(skillId);
      setCurrentSkill(skillData);

      const topicsData = await api.getTopics(skillId);
      setTopics(topicsData || []);

      const sMap = {};
      const tMap = {};

      // Fetch subtopics for all topics
      for (const topic of topicsData) {
        const subtopicsData = await api.getSubtopics(topic.id);
        sMap[topic.id] = subtopicsData || [];

        // Fetch tasks for all subtopics
        for (const subtopic of subtopicsData) {
          const tasksData = await api.getTasks(subtopic.id);
          tMap[subtopic.id] = tasksData || [];
        }
      }

      setSubtopicsMap(sMap);
      setTasksMap(tMap);
    } catch (err) {
      setError(err.message || "Failed to fetch skill details");
    } finally {
      setLoading(false);
    }
  }, []);

  // Add skill - MEMOIZED
  const addSkill = useCallback(async (skillData) => {
    try {
      const newSkill = await api.createSkill(skillData);
      setSkills((prev) => [newSkill, ...prev]);
      return newSkill;
    } catch (err) {
      throw new Error(err.message || "Failed to add skill");
    }
  }, []);

  // Update skill - MEMOIZED
  const modifySkill = useCallback(
    async (id, skillData) => {
      try {
        const updated = await api.updateSkill(id, skillData);
        setSkills((prev) => prev.map((s) => (s.id === id ? updated : s)));
        if (currentSkill && currentSkill.id === id) {
          setCurrentSkill(updated);
        }
        return updated;
      } catch (err) {
        throw new Error(err.message || "Failed to update skill");
      }
    },
    [currentSkill],
  );

  // Delete skill - MEMOIZED
  const removeSkill = useCallback(
    async (id) => {
      try {
        await api.deleteSkill(id);
        setSkills((prev) => prev.filter((s) => s.id !== id));
        if (currentSkill && currentSkill.id === id) {
          setCurrentSkill(null);
          setTopics([]);
          setSubtopicsMap({});
          setTasksMap({});
        }
      } catch (err) {
        throw new Error(err.message || "Failed to delete skill");
      }
    },
    [currentSkill],
  );

  // Topics API Actions - MEMOIZED
  const addTopic = useCallback(async (topicData) => {
    try {
      const newTopic = await api.createTopic(topicData);
      setTopics((prev) =>
        [...prev, newTopic].sort((a, b) => a.orderIndex - b.orderIndex),
      );
      setSubtopicsMap((prev) => ({ ...prev, [newTopic.id]: [] }));
      return newTopic;
    } catch (err) {
      throw new Error(err.message || "Failed to add topic");
    }
  }, []);

  const removeTopic = useCallback(async (id) => {
    try {
      await api.deleteTopic(id);
      setTopics((prev) => prev.filter((t) => t.id !== id));
      setSubtopicsMap((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    } catch (err) {
      throw new Error(err.message || "Failed to delete topic");
    }
  }, []);

  // Subtopics Actions - MEMOIZED
  const addSubtopic = useCallback(
    async (subtopicData) => {
      try {
        const newSubtopic = await api.createSubtopic(subtopicData);
        const topicId = subtopicData.topicId;
        setSubtopicsMap((prev) => ({
          ...prev,
          [topicId]: [...(prev[topicId] || []), newSubtopic].sort(
            (a, b) => a.orderIndex - b.orderIndex,
          ),
        }));
        setTasksMap((prev) => ({ ...prev, [newSubtopic.id]: [] }));

        // Re-fetch skill overview to sync computed progress percentage
        if (currentSkill) {
          const refreshedSkill = await api.getSkill(currentSkill.id);
          setCurrentSkill(refreshedSkill);
        }
        return newSubtopic;
      } catch (err) {
        throw new Error(err.message || "Failed to add subtopic");
      }
    },
    [currentSkill],
  );

  // Optimistic subtopic completion toggle - MEMOIZED
  const toggleSubtopic = useCallback(
    async (subtopicId, topicId, completed) => {
      // Pre-save previous states for rollback
      const originalSubtopics = subtopicsMap[topicId] || [];
      const originalSkill = currentSkill;

      // Perform Optimistic State Update
      const updatedSubtopics = originalSubtopics.map((sub) =>
        sub.id === subtopicId ? { ...sub, completed } : sub,
      );

      setSubtopicsMap((prev) => ({
        ...prev,
        [topicId]: updatedSubtopics,
      }));

      // Compute local optimistic progress percentage
      if (originalSkill) {
        // Flatten all subtopics including the optimistic update
        let total = 0;
        let completedCount = 0;

        Object.entries({
          ...subtopicsMap,
          [topicId]: updatedSubtopics,
        }).forEach(([_, list]) => {
          list.forEach((s) => {
            total++;
            if (s.completed) completedCount++;
          });
        });

        const optimisticProgress =
          total > 0
            ? Math.round((completedCount / total) * 100 * 100) / 100
            : 0.0;
        setCurrentSkill({
          ...originalSkill,
          progressPercentage: optimisticProgress,
          totalCompletedSubtopics: completedCount,
        });
      }

      try {
        // Trigger actual API request
        const backendSubtopic = await api.toggleSubtopicComplete(
          subtopicId,
          completed,
        );

        // Re-fetch Skill to be completely accurate with backend calculation
        if (originalSkill) {
          const refreshedSkill = await api.getSkill(originalSkill.id);
          setCurrentSkill(refreshedSkill);
        }

        // Set final validated subtopic list
        setSubtopicsMap((prev) => ({
          ...prev,
          [topicId]: prev[topicId].map((sub) =>
            sub.id === subtopicId ? backendSubtopic : sub,
          ),
        }));
      } catch (err) {
        // Rollback on error
        setSubtopicsMap((prev) => ({ ...prev, [topicId]: originalSubtopics }));
        setCurrentSkill(originalSkill);
        throw new Error(err.message || "Failed to toggle subtopic completion");
      }
    },
    [subtopicsMap, currentSkill],
  );

  const removeSubtopic = useCallback(
    async (subtopicId, topicId) => {
      try {
        await api.deleteSubtopic(subtopicId);
        setSubtopicsMap((prev) => ({
          ...prev,
          [topicId]: prev[topicId].filter((s) => s.id !== subtopicId),
        }));
        setTasksMap((prev) => {
          const copy = { ...prev };
          delete copy[subtopicId];
          return copy;
        });
        if (currentSkill) {
          const refreshedSkill = await api.getSkill(currentSkill.id);
          setCurrentSkill(refreshedSkill);
        }
      } catch (err) {
        throw new Error(err.message || "Failed to delete subtopic");
      }
    },
    [currentSkill],
  );

  // Tasks Actions - MEMOIZED
  const addTask = useCallback(async (taskData) => {
    try {
      const newTask = await api.createTask(taskData);
      const subtopicId = taskData.subtopicId;
      setTasksMap((prev) => ({
        ...prev,
        [subtopicId]: [...(prev[subtopicId] || []), newTask],
      }));
      return newTask;
    } catch (err) {
      throw new Error(err.message || "Failed to add task");
    }
  }, []);

  // Optimistic task completion toggle - MEMOIZED
  const toggleTask = useCallback(
    async (taskId, subtopicId, completed) => {
      const originalTasks = tasksMap[subtopicId] || [];

      // Optimistic update
      setTasksMap((prev) => ({
        ...prev,
        [subtopicId]: prev[subtopicId].map((t) =>
          t.id === taskId
            ? {
                ...t,
                status: completed ? "COMPLETED" : "TODO",
                completedAt: completed ? new Date().toISOString() : null,
              }
            : t,
        ),
      }));

      try {
        const updatedTask = await api.toggleTaskComplete(taskId, completed);
        setTasksMap((prev) => ({
          ...prev,
          [subtopicId]: prev[subtopicId].map((t) =>
            t.id === taskId ? updatedTask : t,
          ),
        }));
      } catch (err) {
        // Rollback
        setTasksMap((prev) => ({ ...prev, [subtopicId]: originalTasks }));
        throw new Error(err.message || "Failed to toggle task completion");
      }
    },
    [tasksMap],
  );

  const removeTask = useCallback(async (taskId, subtopicId) => {
    try {
      await api.deleteTask(taskId);
      setTasksMap((prev) => ({
        ...prev,
        [subtopicId]: prev[subtopicId].filter((t) => t.id !== taskId),
      }));
    } catch (err) {
      throw new Error(err.message || "Failed to delete task");
    }
  }, []);

  const value = {
    skills,
    currentSkill,
    topics,
    subtopicsMap,
    tasksMap,
    loading,
    error,
    fetchSkills,
    fetchSkillDetail,
    addSkill,
    modifySkill,
    removeSkill,
    addTopic,
    removeTopic,
    addSubtopic,
    toggleSubtopic,
    removeSubtopic,
    addTask,
    toggleTask,
    removeTask,
  };

  return (
    <SkillsContext.Provider value={value}>{children}</SkillsContext.Provider>
  );
};

export const useSkills = () => {
  const context = useContext(SkillsContext);
  if (!context) {
    throw new Error("useSkills must be used within a SkillsProvider");
  }
  return context;
};

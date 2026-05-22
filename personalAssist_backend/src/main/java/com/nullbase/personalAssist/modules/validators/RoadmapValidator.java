package com.nullbase.personalAssist.modules.validators;

import com.nullbase.personalAssist.modules.roadmap.*;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class RoadmapValidator {

    public RoadmapValidationResult validate(RoadmapSchema schema) {
        RoadmapValidationResult result = new RoadmapValidationResult();

        if (schema == null) {
            result.addError("root", "Roadmap schema cannot be null", "ERROR");
            return result;
        }

        // 1. Skill Validation
        RoadmapSkill skill = schema.getSkill();
        if (skill == null) {
            result.addError("skill", "Skill definition is missing in roadmap", "ERROR");
        } else {
            if (skill.getName() == null || skill.getName().trim().isEmpty()) {
                result.addError("skill.name", "Skill name cannot be empty", "ERROR");
            }
            if (skill.getLevel() != null && !isValidSkillLevel(skill.getLevel())) {
                result.addError("skill.level", "Invalid skill level: " + skill.getLevel() + ". Allowed: BEGINNER, INTERMEDIATE, ADVANCED", "WARNING");
            }
        }

        // 2. Topics Validation
        List<RoadmapTopic> topics = schema.getTopics();
        if (topics == null || topics.isEmpty()) {
            result.addError("topics", "Roadmap must contain at least one topic", "ERROR");
            return result;
        }

        Set<String> topicTitles = new HashSet<>();
        Map<String, List<String>> topicDependencies = new HashMap<>();

        for (int i = 0; i < topics.size(); i++) {
            RoadmapTopic topic = topics.get(i);
            String topicPath = "topics[" + i + "]";

            if (topic == null) {
                result.addError(topicPath, "Topic definition cannot be null", "ERROR");
                continue;
            }

            String title = topic.getTitle();
            if (title == null || title.trim().isEmpty()) {
                result.addError(topicPath + ".title", "Topic title cannot be empty", "ERROR");
                title = "Untitled Topic " + (i + 1);
            }

            if (topicTitles.contains(title)) {
                result.addError(topicPath + ".title", "Duplicate topic title found: '" + title + "'", "ERROR");
            } else {
                topicTitles.add(title);
            }

            // Map prerequisites for cycle checks later
            topicDependencies.put(title, topic.getPrerequisites() != null ? topic.getPrerequisites() : new ArrayList<>());

            // 3. Subtopics Validation
            List<RoadmapSubtopic> subtopics = topic.getSubtopics();
            if (subtopics == null || subtopics.isEmpty()) {
                result.addError(topicPath + ".subtopics", "Topic '" + title + "' must contain at least one subtopic", "ERROR");
            } else {
                for (int j = 0; j < subtopics.size(); j++) {
                    RoadmapSubtopic subtopic = subtopics.get(j);
                    String subtopicPath = topicPath + ".subtopics[" + j + "]";

                    if (subtopic == null) {
                        result.addError(subtopicPath, "Subtopic definition cannot be null", "ERROR");
                        continue;
                    }

                    String subTitle = subtopic.getTitle();
                    if (subTitle == null || subTitle.trim().isEmpty()) {
                        result.addError(subtopicPath + ".title", "Subtopic title cannot be empty", "ERROR");
                        subTitle = "Untitled Subtopic " + (j + 1);
                    }

                    if (subtopic.getEstimatedMinutes() <= 0) {
                        result.addError(subtopicPath + ".estimatedMinutes", "Subtopic '" + subTitle + "' estimated minutes must be greater than 0", "ERROR");
                    }

                    if (subtopic.getDifficulty() != null && !isValidDifficulty(subtopic.getDifficulty())) {
                        result.addError(subtopicPath + ".difficulty", "Invalid difficulty: " + subtopic.getDifficulty() + ". Allowed: EASY, MEDIUM, HARD", "WARNING");
                    }

                    // 4. Tasks Validation
                    List<RoadmapTask> tasks = subtopic.getTasks();
                    if (tasks == null || tasks.isEmpty()) {
                        result.addError(subtopicPath + ".tasks", "Subtopic '" + subTitle + "' must contain at least one task", "ERROR");
                    } else {
                        for (int k = 0; k < tasks.size(); k++) {
                            RoadmapTask task = tasks.get(k);
                            String taskPath = subtopicPath + ".tasks[" + k + "]";

                            if (task == null) {
                                result.addError(taskPath, "Task definition cannot be null", "ERROR");
                                continue;
                            }

                            String taskTitle = task.getTitle();
                            if (taskTitle == null || taskTitle.trim().isEmpty()) {
                                result.addError(taskPath + ".title", "Task title cannot be empty", "ERROR");
                                taskTitle = "Untitled Task " + (k + 1);
                            }

                            if (task.getEstimatedMinutes() <= 0) {
                                result.addError(taskPath + ".estimatedMinutes", "Task '" + taskTitle + "' estimated minutes must be greater than 0", "ERROR");
                            }

                            if (task.getTaskType() != null && !isValidTaskType(task.getTaskType())) {
                                result.addError(taskPath + ".taskType", "Invalid task type: " + task.getTaskType() + ". Allowed: PRACTICE, READING, PROJECT, REVISION, QUIZ, NOTES", "WARNING");
                            }

                            if (task.getPriority() != null && !isValidPriority(task.getPriority())) {
                                result.addError(taskPath + ".priority", "Invalid priority level: " + task.getPriority() + ". Allowed: LOW, MEDIUM, HIGH, CRITICAL", "WARNING");
                            }
                        }
                    }
                }
            }
        }

        // 5. Cyclic Reference Checks on Topics Prerequisites
        checkForCycles(topicDependencies, result);

        return result;
    }

    private void checkForCycles(Map<String, List<String>> adjList, RoadmapValidationResult result) {
        // DFS Cycle Detection using Three Colors (0 = unvisited, 1 = visiting, 2 = visited)
        Map<String, Integer> visited = new HashMap<>();
        for (String node : adjList.keySet()) {
            visited.put(node, 0);
        }

        for (String topic : adjList.keySet()) {
            // Verify that prerequisites listed actually exist in the roadmap
            List<String> prereqs = adjList.get(topic);
            for (String prereq : prereqs) {
                if (!adjList.containsKey(prereq)) {
                    result.addError("topics", "Topic '" + topic + "' has a prerequisite topic '" + prereq + "' which does not exist in the roadmap", "ERROR");
                }
            }

            if (visited.get(topic) == 0) {
                if (hasCycleDfs(topic, adjList, visited)) {
                    result.addError("prerequisites", "Cyclic prerequisite references detected among topics. Please ensure there are no circular dependencies.", "ERROR");
                    break;
                }
            }
        }
    }

    private boolean hasCycleDfs(String node, Map<String, List<String>> adjList, Map<String, Integer> visited) {
        visited.put(node, 1); // Gray: visiting

        List<String> neighbors = adjList.getOrDefault(node, new ArrayList<>());
        for (String neighbor : neighbors) {
            Integer state = visited.get(neighbor);
            if (state == null) {
                continue; // Prerequisite does not exist, handled by another error
            }
            if (state == 1) {
                return true; // Cycle detected
            }
            if (state == 0) {
                if (hasCycleDfs(neighbor, adjList, visited)) {
                    return true;
                }
            }
        }

        visited.put(node, 2); // Black: visited
        return false;
    }

    private boolean isValidSkillLevel(String level) {
        return "BEGINNER".equalsIgnoreCase(level) || "INTERMEDIATE".equalsIgnoreCase(level) || "ADVANCED".equalsIgnoreCase(level);
    }

    private boolean isValidDifficulty(String diff) {
        return "EASY".equalsIgnoreCase(diff) || "MEDIUM".equalsIgnoreCase(diff) || "HARD".equalsIgnoreCase(diff);
    }

    private boolean isValidTaskType(String type) {
        return "PRACTICE".equalsIgnoreCase(type) || "READING".equalsIgnoreCase(type) || "PROJECT".equalsIgnoreCase(type)
                || "REVISION".equalsIgnoreCase(type) || "QUIZ".equalsIgnoreCase(type) || "NOTES".equalsIgnoreCase(type);
    }

    private boolean isValidPriority(String priority) {
        return "LOW".equalsIgnoreCase(priority) || "MEDIUM".equalsIgnoreCase(priority) || "HIGH".equalsIgnoreCase(priority) || "CRITICAL".equalsIgnoreCase(priority);
    }
}

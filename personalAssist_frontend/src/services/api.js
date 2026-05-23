const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    // Return the actual data envelope from ApiResponse if present
    if (data && data.hasOwnProperty("success")) {
      return data.data;
    }

    return data;
  } catch (error) {
    console.error(`API Error in ${endpoint}:`, error);
    throw error;
  }
};

// Authentication services
export const login = (email, password) => {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
};

export const signup = (email, password, firstName, lastName) => {
  return apiRequest("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password, firstName, lastName }),
  });
};

export const forgotPassword = (email) => {
  return apiRequest("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
};

export const resetPassword = (token, newPassword) => {
  return apiRequest("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, newPassword }),
  });
};

export const getMe = () => {
  return apiRequest("/auth/me", {
    method: "GET",
  });
};

// SkillForge Module services

// Skills CRUD
export const getSkills = (search = "", status = "", level = "") => {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (status) params.append("status", status);
  if (level) params.append("level", level);
  const queryString = params.toString() ? `?${params.toString()}` : "";
  return apiRequest(`/skills${queryString}`, { method: "GET" });
};

export const getSkill = (id) => {
  return apiRequest(`/skills/${id}`, { method: "GET" });
};

export const createSkill = (skill) => {
  return apiRequest("/skills", {
    method: "POST",
    body: JSON.stringify(skill),
  });
};

export const updateSkill = (id, skill) => {
  return apiRequest(`/skills/${id}`, {
    method: "PUT",
    body: JSON.stringify(skill),
  });
};

export const deleteSkill = (id) => {
  return apiRequest(`/skills/${id}`, { method: "DELETE" });
};

// Topics CRUD
export const getTopics = (skillId) => {
  return apiRequest(`/topics/skill/${skillId}`, { method: "GET" });
};

export const createTopic = (topic) => {
  return apiRequest("/topics", {
    method: "POST",
    body: JSON.stringify(topic),
  });
};

export const updateTopic = (id, topic) => {
  return apiRequest(`/topics/${id}`, {
    method: "PUT",
    body: JSON.stringify(topic),
  });
};

export const deleteTopic = (id) => {
  return apiRequest(`/topics/${id}`, { method: "DELETE" });
};

// Subtopics CRUD
export const getSubtopics = (topicId) => {
  return apiRequest(`/subtopics/topic/${topicId}`, { method: "GET" });
};

export const createSubtopic = (subtopic) => {
  return apiRequest("/subtopics", {
    method: "POST",
    body: JSON.stringify(subtopic),
  });
};

export const updateSubtopic = (id, subtopic) => {
  return apiRequest(`/subtopics/${id}`, {
    method: "PUT",
    body: JSON.stringify(subtopic),
  });
};

export const toggleSubtopicComplete = (id, completed) => {
  return apiRequest(`/subtopics/${id}/complete?completed=${completed}`, {
    method: "PUT",
  });
};

export const deleteSubtopic = (id) => {
  return apiRequest(`/subtopics/${id}`, { method: "DELETE" });
};

// Tasks CRUD
export const getTasks = (subtopicId) => {
  return apiRequest(`/tasks/subtopic/${subtopicId}`, { method: "GET" });
};

export const createTask = (task) => {
  return apiRequest("/tasks", {
    method: "POST",
    body: JSON.stringify(task),
  });
};

export const updateTask = (id, task) => {
  return apiRequest(`/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(task),
  });
};

export const toggleTaskComplete = (id, completed) => {
  return apiRequest(`/tasks/${id}/complete?completed=${completed}`, {
    method: "PUT",
  });
};

export const updateTaskStatus = (id, status) => {
  return apiRequest(`/tasks/${id}/status?status=${status}`, {
    method: "PATCH",
  });
};

export const getTodayTasks = () => {
  return apiRequest("/tasks/today", { method: "GET" });
};

export const getUpcomingTasks = () => {
  return apiRequest("/tasks/upcoming", { method: "GET" });
};

export const getOverdueTasks = () => {
  return apiRequest("/tasks/overdue", { method: "GET" });
};

export const deleteTask = (id) => {
  return apiRequest(`/tasks/${id}`, { method: "DELETE" });
};

// Revisions API
export const getTodayRevisions = () => {
  return apiRequest("/revisions/today", { method: "GET" });
};

export const completeRevision = (id) => {
  return apiRequest(`/revisions/${id}/complete`, { method: "PATCH" });
};

// Scheduler API
export const runDailyScheduler = () => {
  return apiRequest("/scheduler/run-daily", { method: "POST" });
};

export const getSchedulerPreview = () => {
  return apiRequest("/scheduler/preview", { method: "GET" });
};

export const getSchedulerPreferences = () => {
  return apiRequest("/scheduler/preferences", { method: "GET" });
};

export const saveSchedulerPreference = (pref) => {
  console.log(pref);
  return apiRequest("/scheduler/preferences", {
    method: "POST",
    body: JSON.stringify(pref),
  });
};

// Drafts API
export const getDrafts = () => {
  return apiRequest("/drafts", { method: "GET" });
};

export const getDraft = (id) => {
  return apiRequest(`/drafts/${id}`, { method: "GET" });
};

export const createDraft = (draft) => {
  return apiRequest("/drafts", {
    method: "POST",
    body: JSON.stringify(draft),
  });
};

export const updateDraft = (id, draft) => {
  return apiRequest(`/drafts/${id}`, {
    method: "PUT",
    body: JSON.stringify(draft),
  });
};

export const deleteDraft = (id) => {
  return apiRequest(`/drafts/${id}`, { method: "DELETE" });
};

export const updateDraftStatus = (id, status) => {
  return apiRequest(`/drafts/${id}/status?status=${status}`, {
    method: "PATCH",
  });
};

export const publishDraft = (id) => {
  return apiRequest(`/drafts/${id}/publish`, { method: "POST" });
};

// Templates API
export const getTemplates = () => {
  return apiRequest("/templates", { method: "GET" });
};

export const getTemplate = (id) => {
  return apiRequest(`/templates/${id}`, { method: "GET" });
};

export const importTemplateAsDraft = (id) => {
  return apiRequest(`/templates/${id}/import`, { method: "POST" });
};

// Import/Export API
export const validateRoadmapPreview = (jsonStr) => {
  return apiRequest("/import-export/validate-preview", {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: jsonStr,
  });
};

export const importRoadmapAsDraft = (jsonStr) => {
  return apiRequest("/import-export/import", {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: jsonStr,
  });
};

export const importRoadmapDirectly = (jsonStr) => {
  return apiRequest("/import-export/import-direct", {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: jsonStr,
  });
};

export const exportRoadmap = (skillId) => {
  return apiRequest(`/import-export/export/${skillId}`, { method: "GET" });
};

// Analytics API
export const getAnalyticsDashboard = () => {
  return apiRequest("/analytics/dashboard", { method: "GET" });
};

export const startLearningSession = (taskId) => {
  return apiRequest(`/analytics/sessions/start?taskId=${taskId}`, {
    method: "POST",
  });
};

export const endLearningSession = (sessionId, completed) => {
  return apiRequest(
    `/analytics/sessions/${sessionId}/end?completed=${completed}`,
    { method: "POST" },
  );
};

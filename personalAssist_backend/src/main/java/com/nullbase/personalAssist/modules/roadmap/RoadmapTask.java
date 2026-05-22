package com.nullbase.personalAssist.modules.roadmap;

import java.io.Serializable;

public class RoadmapTask implements Serializable {
    private static final long serialVersionUID = 1L;
    private String title;
    private String description;
    private String taskType; // PRACTICE, READING, PROJECT, REVISION, QUIZ, NOTES
    private String priority; // LOW, MEDIUM, HIGH, CRITICAL
    private int estimatedMinutes = 30;

    public RoadmapTask() {}

    public RoadmapTask(String title, String description, String taskType, String priority, int estimatedMinutes) {
        this.title = title;
        this.description = description;
        this.taskType = taskType;
        this.priority = priority;
        this.estimatedMinutes = estimatedMinutes;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getTaskType() {
        return taskType;
    }

    public void setTaskType(String taskType) {
        this.taskType = taskType;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public int getEstimatedMinutes() {
        return estimatedMinutes;
    }

    public void setEstimatedMinutes(int estimatedMinutes) {
        this.estimatedMinutes = estimatedMinutes;
    }
}

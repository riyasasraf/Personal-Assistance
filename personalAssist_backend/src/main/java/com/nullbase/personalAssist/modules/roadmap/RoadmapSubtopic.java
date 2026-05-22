package com.nullbase.personalAssist.modules.roadmap;

import java.util.ArrayList;
import java.util.List;

import java.io.Serializable;

public class RoadmapSubtopic implements Serializable {
    private static final long serialVersionUID = 1L;
    private String title;
    private String description;
    private String difficulty; // EASY, MEDIUM, HARD
    private int estimatedMinutes;
    private int orderIndex;
    private List<RoadmapTask> tasks = new ArrayList<>();

    public RoadmapSubtopic() {}

    public RoadmapSubtopic(String title, String description, String difficulty, int estimatedMinutes, int orderIndex) {
        this.title = title;
        this.description = description;
        this.difficulty = difficulty;
        this.estimatedMinutes = estimatedMinutes;
        this.orderIndex = orderIndex;
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

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public int getEstimatedMinutes() {
        return estimatedMinutes;
    }

    public void setEstimatedMinutes(int estimatedMinutes) {
        this.estimatedMinutes = estimatedMinutes;
    }

    public int getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(int orderIndex) {
        this.orderIndex = orderIndex;
    }

    public List<RoadmapTask> getTasks() {
        return tasks;
    }

    public void setTasks(List<RoadmapTask> tasks) {
        this.tasks = tasks;
    }
}

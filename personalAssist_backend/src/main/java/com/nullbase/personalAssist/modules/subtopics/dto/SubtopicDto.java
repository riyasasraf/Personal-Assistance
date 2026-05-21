package com.nullbase.personalAssist.modules.subtopics.dto;

import com.nullbase.personalAssist.modules.subtopics.DifficultyLevel;
import com.nullbase.personalAssist.modules.subtopics.Subtopic;
import java.util.UUID;

public class SubtopicDto {
    private UUID id;
    private String title;
    private String description;
    private DifficultyLevel difficulty;
    private int estimatedMinutes;
    private int orderIndex;
    private boolean completed;
    private UUID topicId;

    public SubtopicDto() {}

    public SubtopicDto(Subtopic subtopic) {
        this.id = subtopic.getId();
        this.title = subtopic.getTitle();
        this.description = subtopic.getDescription();
        this.difficulty = subtopic.getDifficulty();
        this.estimatedMinutes = subtopic.getEstimatedMinutes();
        this.orderIndex = subtopic.getOrderIndex();
        this.completed = subtopic.isCompleted();
        this.topicId = subtopic.getTopic().getId();
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
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

    public DifficultyLevel getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(DifficultyLevel difficulty) {
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

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public UUID getTopicId() {
        return topicId;
    }

    public void setTopicId(UUID topicId) {
        this.topicId = topicId;
    }
}

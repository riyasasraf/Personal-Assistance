package com.nullbase.personalAssist.modules.subtopics.dto;

import com.nullbase.personalAssist.modules.subtopics.DifficultyLevel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public class CreateSubtopicRequest {

    @NotBlank(message = "Subtopic title is required")
    private String title;

    private String description;

    @NotNull(message = "Topic ID is required")
    private UUID topicId;

    @NotNull(message = "Difficulty is required")
    private DifficultyLevel difficulty;

    private int estimatedMinutes;

    private int orderIndex;

    public CreateSubtopicRequest() {}

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

    public UUID getTopicId() {
        return topicId;
    }

    public void setTopicId(UUID topicId) {
        this.topicId = topicId;
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
}

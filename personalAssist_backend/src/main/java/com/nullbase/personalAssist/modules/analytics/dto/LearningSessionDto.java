package com.nullbase.personalAssist.modules.analytics.dto;

import com.nullbase.personalAssist.modules.analytics.LearningSession;
import java.time.LocalDateTime;
import java.util.UUID;

public class LearningSessionDto {
    private UUID id;
    private UUID taskId;
    private String taskTitle;
    private LocalDateTime startedAt;
    private LocalDateTime endedAt;
    private int durationMinutes;
    private boolean completed;

    public LearningSessionDto() {}

    public LearningSessionDto(LearningSession session) {
        this.id = session.getId();
        if (session.getTask() != null) {
            this.taskId = session.getTask().getId();
            this.taskTitle = session.getTask().getTitle();
        }
        this.startedAt = session.getStartedAt();
        this.endedAt = session.getEndedAt();
        this.durationMinutes = session.getDurationMinutes();
        this.completed = session.isCompleted();
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getTaskId() {
        return taskId;
    }

    public void setTaskId(UUID taskId) {
        this.taskId = taskId;
    }

    public String getTaskTitle() {
        return taskTitle;
    }

    public void setTaskTitle(String taskTitle) {
        this.taskTitle = taskTitle;
    }

    public LocalDateTime getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(LocalDateTime startedAt) {
        this.startedAt = startedAt;
    }

    public LocalDateTime getEndedAt() {
        return endedAt;
    }

    public void setEndedAt(LocalDateTime endedAt) {
        this.endedAt = endedAt;
    }

    public int getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(int durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }
}

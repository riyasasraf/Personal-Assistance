package com.nullbase.personalAssist.modules.tasks.dto;

import com.nullbase.personalAssist.modules.tasks.Task;
import com.nullbase.personalAssist.modules.tasks.TaskType;
import com.nullbase.personalAssist.modules.tasks.TaskStatus;
import com.nullbase.personalAssist.modules.tasks.PriorityLevel;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public class TaskDto {
    private UUID id;
    private String title;
    private String description;
    private TaskType taskType;
    private TaskStatus status;
    private LocalDate scheduledDate;
    private LocalDateTime completedAt;
    private UUID subtopicId;
    private String subtopicName;
    private String skillName;
    private UUID skillId;
    private PriorityLevel priority;
    private int estimatedMinutes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public TaskDto() {}

    public TaskDto(Task task) {
        this.id = task.getId();
        this.title = task.getTitle();
        this.description = task.getDescription();
        this.taskType = task.getTaskType();
        this.status = task.getStatus();
        this.scheduledDate = task.getScheduledDate();
        this.completedAt = task.getCompletedAt();
        this.priority = task.getPriority();
        this.estimatedMinutes = task.getEstimatedMinutes();
        this.createdAt = task.getCreatedAt();
        this.updatedAt = task.getUpdatedAt();
        
        if (task.getSubtopic() != null) {
            this.subtopicId = task.getSubtopic().getId();
            this.subtopicName = task.getSubtopic().getTitle();
            if (task.getSubtopic().getTopic() != null && task.getSubtopic().getTopic().getSkill() != null) {
                this.skillId = task.getSubtopic().getTopic().getSkill().getId();
                this.skillName = task.getSubtopic().getTopic().getSkill().getName();
            }
        }
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

    public TaskType getTaskType() {
        return taskType;
    }

    public void setTaskType(TaskType taskType) {
        this.taskType = taskType;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }

    public LocalDate getScheduledDate() {
        return scheduledDate;
    }

    public void setScheduledDate(LocalDate scheduledDate) {
        this.scheduledDate = scheduledDate;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public UUID getSubtopicId() {
        return subtopicId;
    }

    public void setSubtopicId(UUID subtopicId) {
        this.subtopicId = subtopicId;
    }

    public String getSubtopicName() {
        return subtopicName;
    }

    public void setSubtopicName(String subtopicName) {
        this.subtopicName = subtopicName;
    }

    public String getSkillName() {
        return skillName;
    }

    public void setSkillName(String skillName) {
        this.skillName = skillName;
    }

    public UUID getSkillId() {
        return skillId;
    }

    public void setSkillId(UUID skillId) {
        this.skillId = skillId;
    }

    public PriorityLevel getPriority() {
        return priority;
    }

    public void setPriority(PriorityLevel priority) {
        this.priority = priority;
    }

    public int getEstimatedMinutes() {
        return estimatedMinutes;
    }

    public void setEstimatedMinutes(int estimatedMinutes) {
        this.estimatedMinutes = estimatedMinutes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}

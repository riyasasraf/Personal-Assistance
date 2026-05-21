package com.nullbase.personalAssist.modules.tasks.dto;

import com.nullbase.personalAssist.modules.tasks.TaskType;
import com.nullbase.personalAssist.modules.tasks.TaskStatus;
import com.nullbase.personalAssist.modules.tasks.PriorityLevel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.UUID;

public class CreateTaskRequest {

    @NotBlank(message = "Task title is required")
    private String title;

    private String description;

    @NotNull(message = "Subtopic ID is required")
    private UUID subtopicId;

    @NotNull(message = "Task type is required")
    private TaskType taskType;

    @NotNull(message = "Task status is required")
    private TaskStatus status = TaskStatus.TODO;

    private LocalDate scheduledDate;

    private PriorityLevel priority = PriorityLevel.MEDIUM;

    private int estimatedMinutes = 30;

    public CreateTaskRequest() {}

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

    public UUID getSubtopicId() {
        return subtopicId;
    }

    public void setSubtopicId(UUID subtopicId) {
        this.subtopicId = subtopicId;
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
}

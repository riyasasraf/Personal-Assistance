package com.nullbase.personalAssist.modules.revisions.dto;

import com.nullbase.personalAssist.modules.revisions.Revision;
import com.nullbase.personalAssist.modules.tasks.dto.TaskDto;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public class RevisionDto {
    private UUID id;
    private LocalDate revisionDate;
    private Integer revisionLevel;
    private boolean completed;
    private LocalDateTime createdAt;
    private TaskDto task;

    public RevisionDto() {}

    public RevisionDto(Revision revision) {
        this.id = revision.getId();
        this.revisionDate = revision.getRevisionDate();
        this.revisionLevel = revision.getRevisionLevel();
        this.completed = revision.isCompleted();
        this.createdAt = revision.getCreatedAt();
        if (revision.getTask() != null) {
            this.task = new TaskDto(revision.getTask());
        }
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public LocalDate getRevisionDate() {
        return revisionDate;
    }

    public void setRevisionDate(LocalDate revisionDate) {
        this.revisionDate = revisionDate;
    }

    public Integer getRevisionLevel() {
        return revisionLevel;
    }

    public void setRevisionLevel(Integer revisionLevel) {
        this.revisionLevel = revisionLevel;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public TaskDto getTask() {
        return task;
    }

    public void setTask(TaskDto task) {
        this.task = task;
    }
}

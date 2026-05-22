package com.nullbase.personalAssist.modules.drafts.dto;

import com.nullbase.personalAssist.modules.drafts.Draft;
import com.nullbase.personalAssist.modules.roadmap.RoadmapSchema;
import java.time.LocalDateTime;
import java.util.UUID;

public class DraftDto {
    private UUID id;
    private UUID skillId;
    private String skillName;
    private String title;
    private RoadmapSchema draftJson;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime publishedAt;

    public DraftDto() {}

    public DraftDto(Draft draft) {
        this.id = draft.getId();
        if (draft.getSkill() != null) {
            this.skillId = draft.getSkill().getId();
            this.skillName = draft.getSkill().getName();
        }
        this.title = draft.getTitle();
        this.draftJson = draft.getDraftJson();
        this.status = draft.getStatus().name();
        this.createdAt = draft.getCreatedAt();
        this.updatedAt = draft.getUpdatedAt();
        this.publishedAt = draft.getPublishedAt();
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getSkillId() {
        return skillId;
    }

    public void setSkillId(UUID skillId) {
        this.skillId = skillId;
    }

    public String getSkillName() {
        return skillName;
    }

    public void setSkillName(String skillName) {
        this.skillName = skillName;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public RoadmapSchema getDraftJson() {
        return draftJson;
    }

    public void setDraftJson(RoadmapSchema draftJson) {
        this.draftJson = draftJson;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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

    public LocalDateTime getPublishedAt() {
        return publishedAt;
    }

    public void setPublishedAt(LocalDateTime publishedAt) {
        this.publishedAt = publishedAt;
    }
}

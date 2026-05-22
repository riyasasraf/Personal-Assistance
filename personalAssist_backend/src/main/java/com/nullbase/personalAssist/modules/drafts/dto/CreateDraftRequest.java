package com.nullbase.personalAssist.modules.drafts.dto;

import com.nullbase.personalAssist.modules.roadmap.RoadmapSchema;
import java.util.UUID;

public class CreateDraftRequest {
    private String title;
    private UUID skillId;
    private RoadmapSchema draftJson;

    public CreateDraftRequest() {}

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public UUID getSkillId() {
        return skillId;
    }

    public void setSkillId(UUID skillId) {
        this.skillId = skillId;
    }

    public RoadmapSchema getDraftJson() {
        return draftJson;
    }

    public void setDraftJson(RoadmapSchema draftJson) {
        this.draftJson = draftJson;
    }
}

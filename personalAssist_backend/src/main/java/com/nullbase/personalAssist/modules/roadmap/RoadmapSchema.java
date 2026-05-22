package com.nullbase.personalAssist.modules.roadmap;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import java.io.Serializable;

public class RoadmapSchema implements Serializable {
    private static final long serialVersionUID = 1L;
    private String schemaVersion = "1.0";
    private RoadmapSkill skill;
    private List<RoadmapTopic> topics = new ArrayList<>();
    private List<String> prerequisites = new ArrayList<>();
    private Map<String, Object> metadata = new HashMap<>();

    public RoadmapSchema() {}

    public String getSchemaVersion() {
        return schemaVersion;
    }

    public void setSchemaVersion(String schemaVersion) {
        this.schemaVersion = schemaVersion;
    }

    public RoadmapSkill getSkill() {
        return skill;
    }

    public void setSkill(RoadmapSkill skill) {
        this.skill = skill;
    }

    public List<RoadmapTopic> getTopics() {
        return topics;
    }

    public void setTopics(List<RoadmapTopic> topics) {
        this.topics = topics;
    }

    public List<String> getPrerequisites() {
        return prerequisites;
    }

    public void setPrerequisites(List<String> prerequisites) {
        this.prerequisites = prerequisites;
    }

    public Map<String, Object> getMetadata() {
        return metadata;
    }

    public void setMetadata(Map<String, Object> metadata) {
        this.metadata = metadata;
    }
}

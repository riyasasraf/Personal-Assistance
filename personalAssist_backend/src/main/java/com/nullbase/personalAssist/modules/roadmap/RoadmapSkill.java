package com.nullbase.personalAssist.modules.roadmap;

import java.util.ArrayList;
import java.util.List;

import java.io.Serializable;

public class RoadmapSkill implements Serializable {
    private static final long serialVersionUID = 1L;
    private String name;
    private String description;
    private String level; // BEGINNER, INTERMEDIATE, ADVANCED
    private String goal;
    private List<String> tags = new ArrayList<>();

    public RoadmapSkill() {}

    public RoadmapSkill(String name, String description, String level, String goal) {
        this.name = name;
        this.description = description;
        this.level = level;
        this.goal = goal;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public String getGoal() {
        return goal;
    }

    public void setGoal(String goal) {
        this.goal = goal;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }
}

package com.nullbase.personalAssist.modules.roadmap;

import java.util.ArrayList;
import java.util.List;

import java.io.Serializable;

public class RoadmapTopic implements Serializable {
    private static final long serialVersionUID = 1L;
    private String title;
    private String description;
    private int orderIndex;
    private List<RoadmapSubtopic> subtopics = new ArrayList<>();
    private List<String> prerequisites = new ArrayList<>();

    public RoadmapTopic() {}

    public RoadmapTopic(String title, String description, int orderIndex) {
        this.title = title;
        this.description = description;
        this.orderIndex = orderIndex;
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

    public int getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(int orderIndex) {
        this.orderIndex = orderIndex;
    }

    public List<RoadmapSubtopic> getSubtopics() {
        return subtopics;
    }

    public void setSubtopics(List<RoadmapSubtopic> subtopics) {
        this.subtopics = subtopics;
    }

    public List<String> getPrerequisites() {
        return prerequisites;
    }

    public void setPrerequisites(List<String> prerequisites) {
        this.prerequisites = prerequisites;
    }
}

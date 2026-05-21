package com.nullbase.personalAssist.modules.topics.dto;

import com.nullbase.personalAssist.modules.topics.Topic;
import java.util.UUID;

public class TopicDto {
    private UUID id;
    private String title;
    private String description;
    private int orderIndex;
    private UUID skillId;

    public TopicDto() {}

    public TopicDto(Topic topic) {
        this.id = topic.getId();
        this.title = topic.getTitle();
        this.description = topic.getDescription();
        this.orderIndex = topic.getOrderIndex();
        this.skillId = topic.getSkill().getId();
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

    public int getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(int orderIndex) {
        this.orderIndex = orderIndex;
    }

    public UUID getSkillId() {
        return skillId;
    }

    public void setSkillId(UUID skillId) {
        this.skillId = skillId;
    }
}

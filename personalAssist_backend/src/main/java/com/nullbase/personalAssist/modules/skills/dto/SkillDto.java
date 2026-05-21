package com.nullbase.personalAssist.modules.skills.dto;

import com.nullbase.personalAssist.modules.skills.Skill;
import com.nullbase.personalAssist.modules.skills.SkillLevel;
import com.nullbase.personalAssist.modules.skills.SkillStatus;
import java.time.LocalDateTime;
import java.util.UUID;

public class SkillDto {
    private UUID id;
    private String name;
    private String description;
    private SkillLevel level;
    private String goal;
    private SkillStatus status;
    private double progressPercentage;
    private int totalTopics;
    private int totalCompletedSubtopics;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public SkillDto() {}

    public SkillDto(Skill skill, int totalTopics, int totalCompletedSubtopics) {
        this.id = skill.getId();
        this.name = skill.getName();
        this.description = skill.getDescription();
        this.level = skill.getLevel();
        this.goal = skill.getGoal();
        this.status = skill.getStatus();
        this.progressPercentage = skill.getProgressPercentage();
        this.totalTopics = totalTopics;
        this.totalCompletedSubtopics = totalCompletedSubtopics;
        this.createdAt = skill.getCreatedAt();
        this.updatedAt = skill.getUpdatedAt();
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
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

    public SkillLevel getLevel() {
        return level;
    }

    public void setLevel(SkillLevel level) {
        this.level = level;
    }

    public String getGoal() {
        return goal;
    }

    public void setGoal(String goal) {
        this.goal = goal;
    }

    public SkillStatus getStatus() {
        return status;
    }

    public void setStatus(SkillStatus status) {
        this.status = status;
    }

    public double getProgressPercentage() {
        return progressPercentage;
    }

    public void setProgressPercentage(double progressPercentage) {
        this.progressPercentage = progressPercentage;
    }

    public int getTotalTopics() {
        return totalTopics;
    }

    public void setTotalTopics(int totalTopics) {
        this.totalTopics = totalTopics;
    }

    public int getTotalCompletedSubtopics() {
        return totalCompletedSubtopics;
    }

    public void setTotalCompletedSubtopics(int totalCompletedSubtopics) {
        this.totalCompletedSubtopics = totalCompletedSubtopics;
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

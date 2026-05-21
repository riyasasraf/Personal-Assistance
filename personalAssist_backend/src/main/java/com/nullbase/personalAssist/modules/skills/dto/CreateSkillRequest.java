package com.nullbase.personalAssist.modules.skills.dto;

import com.nullbase.personalAssist.modules.skills.SkillLevel;
import com.nullbase.personalAssist.modules.skills.SkillStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CreateSkillRequest {

    @NotBlank(message = "Skill name is required")
    @Size(max = 100, message = "Skill name must not exceed 100 characters")
    private String name;

    private String description;

    @NotNull(message = "Skill level is required")
    private SkillLevel level;

    private String goal;

    @NotNull(message = "Skill status is required")
    private SkillStatus status;

    public CreateSkillRequest() {}

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
}

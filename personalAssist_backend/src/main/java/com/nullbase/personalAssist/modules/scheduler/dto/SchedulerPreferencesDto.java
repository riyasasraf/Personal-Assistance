package com.nullbase.personalAssist.modules.scheduler.dto;

import com.nullbase.personalAssist.modules.scheduler.SchedulerPreferences;
import java.util.UUID;
import java.util.List;
import java.util.ArrayList;

public class SchedulerPreferencesDto {
    private UUID id;
    private UUID skillId;
    private String skillName;
    private int tasksPerDay;
    private List<String> preferredDays = new ArrayList<>();
    private int studyMinutesPerDay;

    public SchedulerPreferencesDto() {
    }

    public SchedulerPreferencesDto(SchedulerPreferences preferences) {
        this.id = preferences.getId();
        if (preferences.getSkill() != null) {
            this.skillId = preferences.getSkill().getId();
            this.skillName = preferences.getSkill().getName();
        }
        this.tasksPerDay = preferences.getTasksPerDay();
        this.preferredDays = preferences.getPreferredDays();
        this.studyMinutesPerDay = preferences.getStudyMinutesPerDay();
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

    public int getTasksPerDay() {
        return tasksPerDay;
    }

    public void setTasksPerDay(int tasksPerDay) {
        this.tasksPerDay = tasksPerDay;
    }

    public List<String> getPreferredDays() {
        return preferredDays;
    }

    public void setPreferredDays(List<String> preferredDays) {
        this.preferredDays = preferredDays;
    }

    public int getStudyMinutesPerDay() {
        return studyMinutesPerDay;
    }

    public void setStudyMinutesPerDay(int studyMinutesPerDay) {
        this.studyMinutesPerDay = studyMinutesPerDay;
    }
}

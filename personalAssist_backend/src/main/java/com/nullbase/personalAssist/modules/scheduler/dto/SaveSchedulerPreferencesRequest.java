package com.nullbase.personalAssist.modules.scheduler.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import java.util.UUID;
import java.util.List;
import java.util.ArrayList;

public class SaveSchedulerPreferencesRequest {

    private UUID skillId; // Null indicates global preferences

    @Min(value = 1, message = "Tasks per day must be at least 1")
    private int tasksPerDay = 5;

    @NotEmpty(message = "Preferred days is required")
    private List<String> preferredDays = new ArrayList<>(List.of("ALL")); // ALL, WEEKDAYS, WEEKENDS or individual days

    @Min(value = 1, message = "Study minutes per day must be at least 1")
    private int studyMinutesPerDay = 120;

    public SaveSchedulerPreferencesRequest() {
    }

    public UUID getSkillId() {
        return skillId;
    }

    public void setSkillId(UUID skillId) {
        this.skillId = skillId;
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

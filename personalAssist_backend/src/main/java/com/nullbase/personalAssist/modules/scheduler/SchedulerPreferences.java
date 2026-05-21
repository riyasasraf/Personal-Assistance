package com.nullbase.personalAssist.modules.scheduler;

import com.nullbase.personalAssist.entity.User;
import com.nullbase.personalAssist.modules.skills.Skill;
import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "scheduler_preferences")
public class SchedulerPreferences {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "skill_id", nullable = true)
    private Skill skill;

    @Column(name = "tasks_per_day", nullable = false)
    private int tasksPerDay = 5;

    @Column(name = "preferred_days", nullable = false)
    private String preferredDays = "ALL"; // ALL, WEEKDAYS, WEEKENDS

    @Column(name = "study_minutes_per_day", nullable = false)
    private int studyMinutesPerDay = 120;

    public SchedulerPreferences() {}

    public SchedulerPreferences(User user, Skill skill, int tasksPerDay, String preferredDays, int studyMinutesPerDay) {
        this.user = user;
        this.skill = skill;
        this.tasksPerDay = tasksPerDay;
        this.preferredDays = preferredDays;
        this.studyMinutesPerDay = studyMinutesPerDay;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Skill getSkill() {
        return skill;
    }

    public void setSkill(Skill skill) {
        this.skill = skill;
    }

    public int getTasksPerDay() {
        return tasksPerDay;
    }

    public void setTasksPerDay(int tasksPerDay) {
        this.tasksPerDay = tasksPerDay;
    }

    public String getPreferredDays() {
        return preferredDays;
    }

    public void setPreferredDays(String preferredDays) {
        this.preferredDays = preferredDays;
    }

    public int getStudyMinutesPerDay() {
        return studyMinutesPerDay;
    }

    public void setStudyMinutesPerDay(int studyMinutesPerDay) {
        this.studyMinutesPerDay = studyMinutesPerDay;
    }
}

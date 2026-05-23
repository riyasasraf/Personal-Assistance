package com.nullbase.personalAssist.modules.scheduler;

import com.nullbase.personalAssist.entity.User;
import com.nullbase.personalAssist.modules.skills.Skill;
import jakarta.persistence.*;
import java.util.UUID;
import java.util.List;
import java.util.ArrayList;

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

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "scheduler_preferred_days", joinColumns = @JoinColumn(name = "preference_id"))
    @Column(name = "day")
    private List<String> preferredDays = new ArrayList<>(List.of("ALL")); // e.g. ALL, WEEKDAYS, WEEKENDS, MONDAY...

    @Column(name = "study_minutes_per_day", nullable = false)
    private int studyMinutesPerDay = 120;

    public SchedulerPreferences() {
    }

    public SchedulerPreferences(User user, Skill skill, int tasksPerDay, List<String> preferredDays,
            int studyMinutesPerDay) {
        this.user = user;
        this.skill = skill;
        this.tasksPerDay = tasksPerDay;
        this.preferredDays = preferredDays == null ? new ArrayList<>(List.of("ALL")) : preferredDays;
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

    public List<String> getPreferredDays() {
        return preferredDays;
    }

    public void setPreferredDays(List<String> preferredDays) {
        this.preferredDays = preferredDays == null ? new ArrayList<>(List.of("ALL")) : preferredDays;
    }

    public int getStudyMinutesPerDay() {
        return studyMinutesPerDay;
    }

    public void setStudyMinutesPerDay(int studyMinutesPerDay) {
        this.studyMinutesPerDay = studyMinutesPerDay;
    }
}

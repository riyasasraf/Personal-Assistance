package com.nullbase.personalAssist.modules.analytics.dto;

import java.util.ArrayList;
import java.util.List;

public class AnalyticsDashboardDto {
    private long completedTasksCount;
    private long totalStudyTimeMinutes;
    private double completionRate;
    private double revisionConsistency;
    private int studyStreak;
    private List<Integer> weeklyActivity = new ArrayList<>(); // Minutes for each of the last 7 days (6 days ago -> today)

    public AnalyticsDashboardDto() {}

    public AnalyticsDashboardDto(long completedTasksCount, long totalStudyTimeMinutes, double completionRate, double revisionConsistency, int studyStreak, List<Integer> weeklyActivity) {
        this.completedTasksCount = completedTasksCount;
        this.totalStudyTimeMinutes = totalStudyTimeMinutes;
        this.completionRate = completionRate;
        this.revisionConsistency = revisionConsistency;
        this.studyStreak = studyStreak;
        this.weeklyActivity = weeklyActivity;
    }

    // Getters and Setters
    public long getCompletedTasksCount() {
        return completedTasksCount;
    }

    public void setCompletedTasksCount(long completedTasksCount) {
        this.completedTasksCount = completedTasksCount;
    }

    public long getTotalStudyTimeMinutes() {
        return totalStudyTimeMinutes;
    }

    public void setTotalStudyTimeMinutes(long totalStudyTimeMinutes) {
        this.totalStudyTimeMinutes = totalStudyTimeMinutes;
    }

    public double getCompletionRate() {
        return completionRate;
    }

    public void setCompletionRate(double completionRate) {
        this.completionRate = completionRate;
    }

    public double getRevisionConsistency() {
        return revisionConsistency;
    }

    public void setRevisionConsistency(double revisionConsistency) {
        this.revisionConsistency = revisionConsistency;
    }

    public int getStudyStreak() {
        return studyStreak;
    }

    public void setStudyStreak(int studyStreak) {
        this.studyStreak = studyStreak;
    }

    public List<Integer> getWeeklyActivity() {
        return weeklyActivity;
    }

    public void setWeeklyActivity(List<Integer> weeklyActivity) {
        this.weeklyActivity = weeklyActivity;
    }
}

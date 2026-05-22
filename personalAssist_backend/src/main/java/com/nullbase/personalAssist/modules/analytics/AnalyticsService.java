package com.nullbase.personalAssist.modules.analytics;

import com.nullbase.personalAssist.entity.User;
import com.nullbase.personalAssist.modules.tasks.*;
import com.nullbase.personalAssist.modules.analytics.dto.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    @Autowired
    private LearningSessionRepository learningSessionRepository;

    @Autowired
    private TaskService taskService;

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public LearningSessionDto startSession(UUID taskId, User user) {
        Task task = taskService.getTaskEntity(taskId, user);
        
        // Terminate any unfinished sessions for this user first
        List<LearningSession> activeSessions = entityManager.createQuery(
                "SELECT l FROM LearningSession l WHERE l.user = :user AND l.endedAt IS NULL", LearningSession.class)
                .setParameter("user", user)
                .getResultList();
        
        for (LearningSession active : activeSessions) {
            active.setEndedAt(LocalDateTime.now());
            active.setDurationMinutes((int) Math.max(1, ChronoUnit.MINUTES.between(active.getStartedAt(), active.getEndedAt())));
            learningSessionRepository.save(active);
        }

        LearningSession session = new LearningSession(user, task, LocalDateTime.now());
        LearningSession saved = learningSessionRepository.save(session);
        return new LearningSessionDto(saved);
    }

    @Transactional
    public LearningSessionDto endSession(UUID sessionId, boolean completed, User user) {
        LearningSession session = learningSessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found with ID: " + sessionId));
        
        if (!session.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Unauthorized access to this session");
        }

        if (session.getEndedAt() != null) {
            return new LearningSessionDto(session); // Session already ended
        }

        session.setEndedAt(LocalDateTime.now());
        long mins = ChronoUnit.MINUTES.between(session.getStartedAt(), session.getEndedAt());
        session.setDurationMinutes((int) Math.max(1, mins));
        session.setCompleted(completed);

        LearningSession saved = learningSessionRepository.save(session);

        if (completed && session.getTask() != null) {
            taskService.updateTaskStatus(session.getTask().getId(), TaskStatus.COMPLETED, user);
        }

        return new LearningSessionDto(saved);
    }

    @Transactional(readOnly = true)
    public AnalyticsDashboardDto getDashboardStats(User user) {
        // 1. Completed Tasks count
        Long completedTasksCount = entityManager.createQuery(
                "SELECT COUNT(t) FROM Task t WHERE t.subtopic.topic.skill.user = :user AND t.status = :status", Long.class)
                .setParameter("user", user)
                .setParameter("status", TaskStatus.COMPLETED)
                .getSingleResult();

        // 2. Total study time minutes
        Long totalStudyTimeMinutes = entityManager.createQuery(
                "SELECT COALESCE(SUM(l.durationMinutes), 0) FROM LearningSession l WHERE l.user = :user", Long.class)
                .setParameter("user", user)
                .getSingleResult();

        // 3. Completion rate (completed / total tasks)
        Long totalTasks = entityManager.createQuery(
                "SELECT COUNT(t) FROM Task t WHERE t.subtopic.topic.skill.user = :user", Long.class)
                .setParameter("user", user)
                .getSingleResult();

        double completionRate = 0.0;
        if (totalTasks > 0) {
            completionRate = (double) completedTasksCount / totalTasks * 100.0;
            completionRate = Math.round(completionRate * 100.0) / 100.0;
        }

        // 4. Revision consistency
        Long completedRevisions = entityManager.createQuery(
                "SELECT COUNT(r) FROM Revision r WHERE r.task.subtopic.topic.skill.user = :user AND r.completed = true", Long.class)
                .setParameter("user", user)
                .getSingleResult();

        Long totalRevisions = entityManager.createQuery(
                "SELECT COUNT(r) FROM Revision r WHERE r.task.subtopic.topic.skill.user = :user", Long.class)
                .setParameter("user", user)
                .getSingleResult();

        double revisionConsistency = 100.0; // default if no revisions exist
        if (totalRevisions > 0) {
            revisionConsistency = (double) completedRevisions / totalRevisions * 100.0;
            revisionConsistency = Math.round(revisionConsistency * 100.0) / 100.0;
        }

        // 5. Streaks (consecutive study days)
        int studyStreak = calculateStreak(user);

        // 6. Weekly Activity
        List<Integer> weeklyActivity = calculateWeeklyActivity(user);

        return new AnalyticsDashboardDto(
                completedTasksCount,
                totalStudyTimeMinutes,
                completionRate,
                revisionConsistency,
                studyStreak,
                weeklyActivity
        );
    }

    private int calculateStreak(User user) {
        List<LocalDateTime> startedTimes = entityManager.createQuery(
                "SELECT l.startedAt FROM LearningSession l WHERE l.user = :user ORDER BY l.startedAt DESC", LocalDateTime.class)
                .setParameter("user", user)
                .getResultList();

        if (startedTimes.isEmpty()) {
            return 0;
        }

        Set<LocalDate> dates = startedTimes.stream()
                .map(LocalDateTime::toLocalDate)
                .collect(Collectors.toSet());

        LocalDate checkDate = LocalDate.now();
        int streak = 0;

        // If no study today, check if studied yesterday. If not, streak is 0.
        if (!dates.contains(checkDate)) {
            checkDate = checkDate.minusDays(1);
            if (!dates.contains(checkDate)) {
                return 0;
            }
        }

        while (dates.contains(checkDate)) {
            streak++;
            checkDate = checkDate.minusDays(1);
        }

        return streak;
    }

    private List<Integer> calculateWeeklyActivity(User user) {
        List<Integer> activity = new ArrayList<>();
        LocalDate today = LocalDate.now();

        for (int i = 6; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            LocalDateTime start = date.atStartOfDay();
            LocalDateTime end = date.atTime(23, 59, 59, 999999999);

            Long duration = entityManager.createQuery(
                    "SELECT COALESCE(SUM(l.durationMinutes), 0) FROM LearningSession l WHERE l.user = :user AND l.startedAt >= :start AND l.startedAt <= :end", Long.class)
                    .setParameter("user", user)
                    .setParameter("start", start)
                    .setParameter("end", end)
                    .getSingleResult();

            activity.add(duration.intValue());
        }

        return activity;
    }
}

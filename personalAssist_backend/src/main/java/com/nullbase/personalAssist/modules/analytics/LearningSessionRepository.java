package com.nullbase.personalAssist.modules.analytics;

import com.nullbase.personalAssist.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface LearningSessionRepository extends JpaRepository<LearningSession, UUID> {
    List<LearningSession> findByUserOrderByStartedAtDesc(User user);
    
    List<LearningSession> findByUserAndEndedAtNotNullOrderByStartedAtDesc(User user);

    @Query("SELECT COALESCE(SUM(l.durationMinutes), 0) FROM LearningSession l WHERE l.user = :user")
    int sumDurationMinutesByUser(@Param("user") User user);

    @Query("SELECT l FROM LearningSession l WHERE l.user = :user AND l.startedAt >= :startDateTime")
    List<LearningSession> findSessionsFromDate(@Param("user") User user, @Param("startDateTime") LocalDateTime startDateTime);
}

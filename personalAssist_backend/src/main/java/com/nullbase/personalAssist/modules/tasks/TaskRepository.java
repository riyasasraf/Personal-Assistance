package com.nullbase.personalAssist.modules.tasks;

import com.nullbase.personalAssist.entity.User;
import com.nullbase.personalAssist.modules.subtopics.Subtopic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface TaskRepository extends JpaRepository<Task, UUID> {
    List<Task> findBySubtopic(Subtopic subtopic);

    @Query("SELECT t FROM Task t WHERE t.subtopic.topic.skill.user = :user AND t.status NOT IN (com.nullbase.personalAssist.modules.tasks.TaskStatus.COMPLETED, com.nullbase.personalAssist.modules.tasks.TaskStatus.SKIPPED)")
    List<Task> findIncompleteByUser(@Param("user") User user);

    @Query("SELECT t FROM Task t WHERE t.subtopic.topic.skill.user = :user AND t.scheduledDate = :today AND t.status NOT IN (com.nullbase.personalAssist.modules.tasks.TaskStatus.COMPLETED, com.nullbase.personalAssist.modules.tasks.TaskStatus.SKIPPED)")
    List<Task> findTodayTasksByUser(@Param("user") User user, @Param("today") LocalDate today);

    @Query("SELECT t FROM Task t WHERE t.subtopic.topic.skill.user = :user AND t.scheduledDate > :today AND t.status NOT IN (com.nullbase.personalAssist.modules.tasks.TaskStatus.COMPLETED, com.nullbase.personalAssist.modules.tasks.TaskStatus.SKIPPED)")
    List<Task> findUpcomingTasksByUser(@Param("user") User user, @Param("today") LocalDate today);

    @Query("SELECT t FROM Task t WHERE t.subtopic.topic.skill.user = :user AND t.scheduledDate < :today AND t.status NOT IN (com.nullbase.personalAssist.modules.tasks.TaskStatus.COMPLETED, com.nullbase.personalAssist.modules.tasks.TaskStatus.SKIPPED)")
    List<Task> findOverdueTasksByUser(@Param("user") User user, @Param("today") LocalDate today);
}

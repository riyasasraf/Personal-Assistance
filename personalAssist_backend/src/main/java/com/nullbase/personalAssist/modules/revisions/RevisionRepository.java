package com.nullbase.personalAssist.modules.revisions;

import com.nullbase.personalAssist.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface RevisionRepository extends JpaRepository<Revision, UUID> {

    @Query("SELECT r FROM Revision r WHERE r.task.subtopic.topic.skill.user = :user AND r.revisionDate <= :today AND r.completed = false")
    List<Revision> findPendingByUserAndDate(@Param("user") User user, @Param("today") LocalDate today);
}

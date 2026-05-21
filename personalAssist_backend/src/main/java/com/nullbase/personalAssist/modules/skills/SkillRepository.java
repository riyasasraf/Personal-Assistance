package com.nullbase.personalAssist.modules.skills;

import com.nullbase.personalAssist.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SkillRepository extends JpaRepository<Skill, UUID> {

    List<Skill> findByUser(User user);

    @Query("SELECT s FROM Skill s WHERE s.user = :user AND " +
           "(:search IS NULL OR LOWER(s.name) LIKE :search OR LOWER(s.description) LIKE :search) AND " +
           "(:status IS NULL OR s.status = :status) AND " +
           "(:level IS NULL OR s.level = :level) " +
           "ORDER BY s.createdAt DESC")
    List<Skill> findFiltered(
            @Param("user") User user,
            @Param("search") String search,
            @Param("status") SkillStatus status,
            @Param("level") SkillLevel level
    );
}

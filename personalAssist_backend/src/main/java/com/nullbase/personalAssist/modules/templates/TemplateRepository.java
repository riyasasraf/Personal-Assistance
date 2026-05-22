package com.nullbase.personalAssist.modules.templates;

import com.nullbase.personalAssist.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TemplateRepository extends JpaRepository<Template, UUID> {
    List<Template> findByIsPublicTrueOrderByCreatedAtDesc();
    
    @Query("SELECT t FROM Template t WHERE t.isPublic = true OR t.createdBy = :user ORDER BY t.createdAt DESC")
    List<Template> findAllAvailable(@Param("user") User user);
    
    List<Template> findByCreatedByOrderByCreatedAtDesc(User user);
}

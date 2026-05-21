package com.nullbase.personalAssist.modules.subtopics;

import com.nullbase.personalAssist.modules.skills.Skill;
import com.nullbase.personalAssist.modules.topics.Topic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SubtopicRepository extends JpaRepository<Subtopic, UUID> {
    List<Subtopic> findByTopicOrderByOrderIndexAsc(Topic topic);

    @Query("SELECT COUNT(s) FROM Subtopic s WHERE s.topic.skill = :skill")
    int countBySkill(@Param("skill") Skill skill);

    @Query("SELECT COUNT(s) FROM Subtopic s WHERE s.topic.skill = :skill AND s.completed = true")
    int countCompletedBySkill(@Param("skill") Skill skill);
}

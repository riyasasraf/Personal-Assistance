package com.nullbase.personalAssist.modules.ai_ready;

import com.nullbase.personalAssist.entity.User;
import com.nullbase.personalAssist.modules.roadmap.RoadmapTopic;
import java.util.List;
import java.util.UUID;

/**
 * Interface contract for future AI-driven adaptive recommendations.
 */
public interface RecommendationEngine {

    /**
     * Recommend next study topics based on historical activity and current skill level.
     * 
     * @param skillId Target skill identifier
     * @param user Authenticated user
     * @return Ordered list of recommended RoadmapTopic suggestions
     */
    List<RoadmapTopic> recommendNextTopics(UUID skillId, User user);
}

package com.nullbase.personalAssist.modules.ai_ready;

import com.nullbase.personalAssist.entity.User;
import com.nullbase.personalAssist.modules.roadmap.RoadmapSchema;

/**
 * Interface contract for future AI Roadmap generation capabilities.
 * Designed to plug in LLM content writers directly returning the universal schema.
 */
public interface RoadmapGeneratorService {
    
    /**
     * Generate a complete Roadmap Schema from a text prompt.
     * 
     * @param prompt User's topic of interest e.g. "Rust Backend Development for WebSockets"
     * @param user Authenticated user
     * @return Generated universal RoadmapSchema structure
     */
    RoadmapSchema generateRoadmap(String prompt, User user);
}

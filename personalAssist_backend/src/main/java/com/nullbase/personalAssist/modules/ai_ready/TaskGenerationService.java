package com.nullbase.personalAssist.modules.ai_ready;

import com.nullbase.personalAssist.entity.User;
import com.nullbase.personalAssist.modules.roadmap.RoadmapTask;
import java.util.List;

/**
 * Interface contract for future AI task generation/breakdown inside subtopics.
 */
public interface TaskGenerationService {

    /**
     * Generate structured subtopic tasks using context.
     * 
     * @param subtopicTitle Title of the subtopic node
     * @param subtopicDescription Description of the subtopic node
     * @param user Authenticated user
     * @return List of generated RoadmapTask nodes
     */
    List<RoadmapTask> generateTasksForSubtopic(String subtopicTitle, String subtopicDescription, User user);
}

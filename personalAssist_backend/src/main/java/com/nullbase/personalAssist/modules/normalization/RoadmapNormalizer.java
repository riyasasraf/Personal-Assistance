package com.nullbase.personalAssist.modules.normalization;

import com.nullbase.personalAssist.modules.roadmap.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class RoadmapNormalizer {

    public RoadmapSchema normalize(RoadmapSchema schema) {
        if (schema == null) {
            return null;
        }

        // 1. Normalize Skill
        RoadmapSkill skill = schema.getSkill();
        if (skill != null) {
            skill.setName(cleanString(skill.getName(), "Untitled Skill"));
            skill.setDescription(cleanString(skill.getDescription(), ""));
            skill.setLevel(standardizeEnum(skill.getLevel(), "BEGINNER"));
            skill.setGoal(cleanString(skill.getGoal(), ""));
            
            if (skill.getTags() != null) {
                for (int i = 0; i < skill.getTags().size(); i++) {
                    skill.getTags().set(i, skill.getTags().get(i).trim().toLowerCase());
                }
            } else {
                skill.setTags(new ArrayList<>());
            }
        }

        // 2. Normalize Topics
        if (schema.getTopics() != null) {
            for (int i = 0; i < schema.getTopics().size(); i++) {
                RoadmapTopic topic = schema.getTopics().get(i);
                if (topic == null) continue;

                topic.setTitle(capitalizeFirstLetter(cleanString(topic.getTitle(), "Topic " + (i + 1))));
                topic.setDescription(cleanString(topic.getDescription(), ""));
                topic.setOrderIndex(i); // Enforce continuous order indices starting at 0

                if (topic.getPrerequisites() != null) {
                    for (int p = 0; p < topic.getPrerequisites().size(); p++) {
                        topic.getPrerequisites().set(p, topic.getPrerequisites().get(p).trim());
                    }
                } else {
                    topic.setPrerequisites(new ArrayList<>());
                }

                // 3. Normalize Subtopics
                if (topic.getSubtopics() != null) {
                    for (int j = 0; j < topic.getSubtopics().size(); j++) {
                        RoadmapSubtopic subtopic = topic.getSubtopics().get(j);
                        if (subtopic == null) continue;

                        subtopic.setTitle(capitalizeFirstLetter(cleanString(subtopic.getTitle(), "Subtopic " + (j + 1))));
                        subtopic.setDescription(cleanString(subtopic.getDescription(), ""));
                        subtopic.setDifficulty(standardizeEnum(subtopic.getDifficulty(), "MEDIUM"));
                        subtopic.setOrderIndex(j); // Enforce continuous order indices starting at 0
                        if (subtopic.getEstimatedMinutes() <= 0) {
                            subtopic.setEstimatedMinutes(30);
                        }

                        // 4. Normalize Tasks
                        if (subtopic.getTasks() != null) {
                            for (int k = 0; k < subtopic.getTasks().size(); k++) {
                                RoadmapTask task = subtopic.getTasks().get(k);
                                if (task == null) continue;

                                task.setTitle(capitalizeFirstLetter(cleanString(task.getTitle(), "Task " + (k + 1))));
                                task.setDescription(cleanString(task.getDescription(), ""));
                                task.setTaskType(standardizeEnum(task.getTaskType(), "PRACTICE"));
                                task.setPriority(standardizeEnum(task.getPriority(), "MEDIUM"));
                                if (task.getEstimatedMinutes() <= 0) {
                                    task.setEstimatedMinutes(30);
                                }
                            }
                        } else {
                            subtopic.setTasks(new ArrayList<>());
                        }
                    }
                } else {
                    topic.setSubtopics(new ArrayList<>());
                }
            }
        }

        return schema;
    }

    private String cleanString(String input, String defaultValue) {
        if (input == null || input.trim().isEmpty()) {
            return defaultValue;
        }
        // Remove duplicate spaces
        return input.trim().replaceAll("\\s+", " ");
    }

    private String standardizeEnum(String value, String defaultValue) {
        if (value == null || value.trim().isEmpty()) {
            return defaultValue;
        }
        return value.trim().toUpperCase();
    }

    private String capitalizeFirstLetter(String input) {
        if (input == null || input.isEmpty()) {
            return input;
        }
        return input.substring(0, 1).toUpperCase() + input.substring(1);
    }
}

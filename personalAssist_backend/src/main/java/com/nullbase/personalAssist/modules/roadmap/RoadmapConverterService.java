package com.nullbase.personalAssist.modules.roadmap;

import com.nullbase.personalAssist.entity.User;
import com.nullbase.personalAssist.modules.skills.*;
import com.nullbase.personalAssist.modules.topics.*;
import com.nullbase.personalAssist.modules.subtopics.*;
import com.nullbase.personalAssist.modules.tasks.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class RoadmapConverterService {

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private SubtopicRepository subtopicRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private SkillService skillService;

    @Transactional(readOnly = true)
    public RoadmapSchema entityToSchema(Skill skill) {
        RoadmapSchema schema = new RoadmapSchema();
        schema.setSchemaVersion("1.0");

        // Convert Skill
        RoadmapSkill rSkill = new RoadmapSkill();
        rSkill.setName(skill.getName());
        rSkill.setDescription(skill.getDescription());
        rSkill.setLevel(skill.getLevel().name());
        rSkill.setGoal(skill.getGoal());
        rSkill.setTags(new ArrayList<>()); // Tags can be stored or added if present
        schema.setSkill(rSkill);

        // Convert Topics
        List<Topic> topics = topicRepository.findBySkillOrderByOrderIndexAsc(skill);
        List<RoadmapTopic> rTopics = new ArrayList<>();

        for (Topic topic : topics) {
            RoadmapTopic rTopic = new RoadmapTopic(topic.getTitle(), topic.getDescription(), topic.getOrderIndex());
            
            // Convert Subtopics
            List<Subtopic> subtopics = subtopicRepository.findByTopicOrderByOrderIndexAsc(topic);
            List<RoadmapSubtopic> rSubtopics = new ArrayList<>();

            for (Subtopic subtopic : subtopics) {
                RoadmapSubtopic rSubtopic = new RoadmapSubtopic(
                        subtopic.getTitle(),
                        subtopic.getDescription(),
                        subtopic.getDifficulty().name(),
                        subtopic.getEstimatedMinutes(),
                        subtopic.getOrderIndex()
                );

                // Convert Tasks
                List<Task> tasks = taskRepository.findBySubtopic(subtopic);
                List<RoadmapTask> rTasks = new ArrayList<>();

                for (Task task : tasks) {
                    RoadmapTask rTask = new RoadmapTask(
                            task.getTitle(),
                            task.getDescription(),
                            task.getTaskType().name(),
                            task.getPriority().name(),
                            task.getEstimatedMinutes()
                    );
                    rTasks.add(rTask);
                }
                rSubtopic.setTasks(rTasks);
                rSubtopics.add(rSubtopic);
            }
            rTopic.setSubtopics(rSubtopics);
            rTopics.add(rTopic);
        }
        schema.setTopics(rTopics);

        return schema;
    }

    @Transactional
    public Skill schemaToEntity(RoadmapSchema schema, User user, UUID existingSkillId) {
        Skill skill;
        if (existingSkillId != null) {
            skill = skillRepository.findById(existingSkillId)
                    .orElseThrow(() -> new IllegalArgumentException("Existing Skill not found for ID: " + existingSkillId));
            
            // Verify ownership
            if (!skill.getUser().getId().equals(user.getId())) {
                throw new IllegalArgumentException("Unauthorized access to this skill");
            }
            
            // Clean up old children to avoid orphans
            List<Topic> oldTopics = topicRepository.findBySkillOrderByOrderIndexAsc(skill);
            for (Topic t : oldTopics) {
                List<Subtopic> oldSubtopics = subtopicRepository.findByTopicOrderByOrderIndexAsc(t);
                for (Subtopic s : oldSubtopics) {
                    List<Task> oldTasks = taskRepository.findBySubtopic(s);
                    taskRepository.deleteAll(oldTasks);
                }
                subtopicRepository.deleteAll(oldSubtopics);
            }
            topicRepository.deleteAll(oldTopics);

            // Update skill metadata
            skill.setName(schema.getSkill().getName());
            skill.setDescription(schema.getSkill().getDescription());
            skill.setLevel(safeSkillLevel(schema.getSkill().getLevel()));
            skill.setGoal(schema.getSkill().getGoal());
        } else {
            skill = new Skill(
                    user,
                    schema.getSkill().getName(),
                    schema.getSkill().getDescription(),
                    safeSkillLevel(schema.getSkill().getLevel()),
                    schema.getSkill().getGoal(),
                    SkillStatus.PUBLISHED
            );
        }

        Skill savedSkill = skillRepository.save(skill);

        // Save new hierarchy
        if (schema.getTopics() != null) {
            for (RoadmapTopic rTopic : schema.getTopics()) {
                Topic topic = new Topic(
                        savedSkill,
                        rTopic.getTitle(),
                        rTopic.getDescription(),
                        rTopic.getOrderIndex()
                );
                Topic savedTopic = topicRepository.save(topic);

                if (rTopic.getSubtopics() != null) {
                    for (RoadmapSubtopic rSubtopic : rTopic.getSubtopics()) {
                        Subtopic subtopic = new Subtopic(
                                savedTopic,
                                rSubtopic.getTitle(),
                                rSubtopic.getDescription(),
                                safeDifficultyLevel(rSubtopic.getDifficulty()),
                                rSubtopic.getEstimatedMinutes() <= 0 ? 30 : rSubtopic.getEstimatedMinutes(),
                                rSubtopic.getOrderIndex()
                        );
                        Subtopic savedSubtopic = subtopicRepository.save(subtopic);

                        if (rSubtopic.getTasks() != null) {
                            for (RoadmapTask rTask : rSubtopic.getTasks()) {
                                Task task = new Task(
                                        savedSubtopic,
                                        rTask.getTitle(),
                                        rTask.getDescription(),
                                        safeTaskType(rTask.getTaskType()),
                                        TaskStatus.TODO,
                                        null, // Not scheduled initially
                                        safePriorityLevel(rTask.getPriority()),
                                        rTask.getEstimatedMinutes() <= 0 ? 30 : rTask.getEstimatedMinutes()
                                );
                                taskRepository.save(task);
                            }
                        }
                    }
                }
            }
        }

        // Recalculate and update progress
        skillService.recalculateSkillProgress(savedSkill);

        return savedSkill;
    }

    private SkillLevel safeSkillLevel(String level) {
        if (level == null) return SkillLevel.BEGINNER;
        try {
            return SkillLevel.valueOf(level.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            return SkillLevel.BEGINNER;
        }
    }

    private DifficultyLevel safeDifficultyLevel(String difficulty) {
        if (difficulty == null) return DifficultyLevel.MEDIUM;
        try {
            return DifficultyLevel.valueOf(difficulty.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            return DifficultyLevel.MEDIUM;
        }
    }

    private TaskType safeTaskType(String taskType) {
        if (taskType == null) return TaskType.PRACTICE;
        try {
            return TaskType.valueOf(taskType.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            return TaskType.PRACTICE;
        }
    }

    private PriorityLevel safePriorityLevel(String priority) {
        if (priority == null) return PriorityLevel.MEDIUM;
        try {
            return PriorityLevel.valueOf(priority.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            return PriorityLevel.MEDIUM;
        }
    }
}

package com.nullbase.personalAssist.modules.subtopics;

import com.nullbase.personalAssist.entity.User;
import com.nullbase.personalAssist.modules.skills.Skill;
import com.nullbase.personalAssist.modules.skills.SkillService;
import com.nullbase.personalAssist.modules.topics.Topic;
import com.nullbase.personalAssist.modules.topics.TopicService;
import com.nullbase.personalAssist.modules.subtopics.dto.CreateSubtopicRequest;
import com.nullbase.personalAssist.modules.subtopics.dto.SubtopicDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SubtopicService {

    @Autowired
    private SubtopicRepository subtopicRepository;

    @Autowired
    private TopicService topicService;

    @Autowired
    private SkillService skillService;

    @Transactional(readOnly = true)
    public List<SubtopicDto> getSubtopicsByTopic(UUID topicId, User user) {
        Topic topic = topicService.getTopicEntity(topicId, user);
        List<Subtopic> subtopics = subtopicRepository.findByTopicOrderByOrderIndexAsc(topic);
        return subtopics.stream()
                .map(SubtopicDto::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public SubtopicDto createSubtopic(CreateSubtopicRequest request, User user) {
        Topic topic = topicService.getTopicEntity(request.getTopicId(), user);
        
        Subtopic subtopic = new Subtopic(
                topic,
                request.getTitle(),
                request.getDescription(),
                request.getDifficulty(),
                request.getEstimatedMinutes(),
                request.getOrderIndex()
        );

        Subtopic saved = subtopicRepository.save(subtopic);
        
        // Recalculate parent skill progress
        skillService.recalculateSkillProgress(topic.getSkill());
        
        return new SubtopicDto(saved);
    }

    @Transactional
    public SubtopicDto updateSubtopic(UUID id, CreateSubtopicRequest request, User user) {
        Subtopic subtopic = getSubtopicEntity(id, user);
        Topic oldTopic = subtopic.getTopic();

        // If topic has changed, verify and update
        if (!subtopic.getTopic().getId().equals(request.getTopicId())) {
            Topic newTopic = topicService.getTopicEntity(request.getTopicId(), user);
            subtopic.setTopic(newTopic);
        }

        subtopic.setTitle(request.getTitle());
        subtopic.setDescription(request.getDescription());
        subtopic.setDifficulty(request.getDifficulty());
        subtopic.setEstimatedMinutes(request.getEstimatedMinutes());
        subtopic.setOrderIndex(request.getOrderIndex());

        Subtopic updated = subtopicRepository.save(subtopic);
        
        // Recalculate skill progress for both old and new topics (just in case they belong to different skills)
        skillService.recalculateSkillProgress(oldTopic.getSkill());
        if (!oldTopic.getSkill().getId().equals(updated.getTopic().getSkill().getId())) {
            skillService.recalculateSkillProgress(updated.getTopic().getSkill());
        }

        return new SubtopicDto(updated);
    }

    @Transactional
    public SubtopicDto toggleCompleted(UUID id, boolean completed, User user) {
        Subtopic subtopic = getSubtopicEntity(id, user);
        subtopic.setCompleted(completed);
        
        Subtopic saved = subtopicRepository.save(subtopic);
        
        // Dynamic progress calculation trigger
        skillService.recalculateSkillProgress(saved.getTopic().getSkill());
        
        return new SubtopicDto(saved);
    }

    @Transactional
    public void deleteSubtopic(UUID id, User user) {
        Subtopic subtopic = getSubtopicEntity(id, user);
        Skill skill = subtopic.getTopic().getSkill();
        subtopicRepository.delete(subtopic);
        skillService.recalculateSkillProgress(skill);
    }

    public Subtopic getSubtopicEntity(UUID id, User user) {
        Subtopic subtopic = subtopicRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Subtopic not found with ID: " + id));
        // Verify ownership
        topicService.getTopicEntity(subtopic.getTopic().getId(), user);
        return subtopic;
    }
}

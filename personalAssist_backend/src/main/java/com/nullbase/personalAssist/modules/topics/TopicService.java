package com.nullbase.personalAssist.modules.topics;

import com.nullbase.personalAssist.entity.User;
import com.nullbase.personalAssist.modules.skills.Skill;
import com.nullbase.personalAssist.modules.skills.SkillService;
import com.nullbase.personalAssist.modules.topics.dto.CreateTopicRequest;
import com.nullbase.personalAssist.modules.topics.dto.TopicDto;
import com.nullbase.personalAssist.modules.subtopics.Subtopic;
import com.nullbase.personalAssist.modules.subtopics.SubtopicRepository;
import com.nullbase.personalAssist.modules.tasks.Task;
import com.nullbase.personalAssist.modules.tasks.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TopicService {

    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private SubtopicRepository subtopicRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private SkillService skillService;

    @Transactional(readOnly = true)
    public List<TopicDto> getTopicsBySkill(UUID skillId, User user) {
        Skill skill = skillService.getSkillEntity(skillId, user);
        List<Topic> topics = topicRepository.findBySkillOrderByOrderIndexAsc(skill);
        return topics.stream()
                .map(TopicDto::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public TopicDto createTopic(CreateTopicRequest request, User user) {
        Skill skill = skillService.getSkillEntity(request.getSkillId(), user);
        
        Topic topic = new Topic(
                skill,
                request.getTitle(),
                request.getDescription(),
                request.getOrderIndex()
        );

        Topic saved = topicRepository.save(topic);
        
        // Changing the topics list should recalculate skill progress (though initially no subtopics exist)
        skillService.recalculateSkillProgress(skill);
        
        return new TopicDto(saved);
    }

    @Transactional
    public TopicDto updateTopic(UUID id, CreateTopicRequest request, User user) {
        Topic topic = getTopicEntity(id, user);
        
        // If skill has changed, verify the new skill
        if (!topic.getSkill().getId().equals(request.getSkillId())) {
            Skill newSkill = skillService.getSkillEntity(request.getSkillId(), user);
            topic.setSkill(newSkill);
        }

        topic.setTitle(request.getTitle());
        topic.setDescription(request.getDescription());
        topic.setOrderIndex(request.getOrderIndex());

        Topic updated = topicRepository.save(topic);
        skillService.recalculateSkillProgress(updated.getSkill());
        
        return new TopicDto(updated);
    }

    @Transactional
    public void deleteTopic(UUID id, User user) {
        Topic topic = getTopicEntity(id, user);
        Skill skill = topic.getSkill();
        
        List<Subtopic> subtopics = subtopicRepository.findByTopicOrderByOrderIndexAsc(topic);
        for (Subtopic sub : subtopics) {
            List<Task> tasks = taskRepository.findBySubtopic(sub);
            taskRepository.deleteAll(tasks);
        }
        subtopicRepository.deleteAll(subtopics);
        
        topicRepository.delete(topic);
        skillService.recalculateSkillProgress(skill);
    }

    public Topic getTopicEntity(UUID id, User user) {
        Topic topic = topicRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Topic not found with ID: " + id));
        // Verify ownership via skill
        skillService.getSkillEntity(topic.getSkill().getId(), user);
        return topic;
    }
}

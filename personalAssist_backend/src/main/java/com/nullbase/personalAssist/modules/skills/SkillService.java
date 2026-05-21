package com.nullbase.personalAssist.modules.skills;

import com.nullbase.personalAssist.entity.User;
import com.nullbase.personalAssist.modules.skills.dto.CreateSkillRequest;
import com.nullbase.personalAssist.modules.skills.dto.SkillDto;
import com.nullbase.personalAssist.modules.topics.TopicRepository;
import com.nullbase.personalAssist.modules.subtopics.SubtopicRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SkillService {

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private SubtopicRepository subtopicRepository;

    @Transactional(readOnly = true)
    public List<SkillDto> getAllSkills(User user, String search, SkillStatus status, SkillLevel level) {
        String searchParam = null;
        if (search != null && !search.trim().isEmpty()) {
            searchParam = "%" + search.trim().toLowerCase() + "%";
        }
        List<Skill> skills = skillRepository.findFiltered(user, searchParam, status, level);
        return skills.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SkillDto getSkillById(UUID id, User user) {
        Skill skill = getSkillEntity(id, user);
        return convertToDto(skill);
    }

    @Transactional
    public SkillDto createSkill(CreateSkillRequest request, User user) {
        Skill skill = new Skill(
                user,
                request.getName(),
                request.getDescription(),
                request.getLevel(),
                request.getGoal(),
                request.getStatus()
        );
        Skill saved = skillRepository.save(skill);
        return convertToDto(saved);
    }

    @Transactional
    public SkillDto updateSkill(UUID id, CreateSkillRequest request, User user) {
        Skill skill = getSkillEntity(id, user);
        skill.setName(request.getName());
        skill.setDescription(request.getDescription());
        skill.setLevel(request.getLevel());
        skill.setGoal(request.getGoal());
        skill.setStatus(request.getStatus());

        Skill updated = skillRepository.save(skill);
        // Force a recalculation of progress just in case
        recalculateSkillProgress(updated);
        return convertToDto(updated);
    }

    @Transactional
    public void deleteSkill(UUID id, User user) {
        Skill skill = getSkillEntity(id, user);
        skillRepository.delete(skill);
    }

    public Skill getSkillEntity(UUID id, User user) {
        Skill skill = skillRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Skill not found with ID: " + id));
        if (!skill.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Unauthorized access to this skill");
        }
        return skill;
    }

    @Transactional
    public void recalculateSkillProgress(Skill skill) {
        int total = subtopicRepository.countBySkill(skill);
        if (total == 0) {
            skill.setProgressPercentage(0.0);
        } else {
            int completed = subtopicRepository.countCompletedBySkill(skill);
            double progress = ((double) completed / total) * 100.0;
            progress = Math.round(progress * 100.0) / 100.0;
            skill.setProgressPercentage(progress);
        }
        skillRepository.save(skill);
    }

    public SkillDto convertToDto(Skill skill) {
        int totalTopics = topicRepository.countBySkill(skill);
        int totalCompletedSubtopics = subtopicRepository.countCompletedBySkill(skill);
        return new SkillDto(skill, totalTopics, totalCompletedSubtopics);
    }
}

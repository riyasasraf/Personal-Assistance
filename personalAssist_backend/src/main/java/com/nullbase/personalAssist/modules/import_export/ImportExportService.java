package com.nullbase.personalAssist.modules.import_export;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nullbase.personalAssist.entity.User;
import com.nullbase.personalAssist.modules.drafts.Draft;
import com.nullbase.personalAssist.modules.drafts.DraftRepository;
import com.nullbase.personalAssist.modules.drafts.DraftStatus;
import com.nullbase.personalAssist.modules.drafts.dto.DraftDto;
import com.nullbase.personalAssist.modules.skills.Skill;
import com.nullbase.personalAssist.modules.skills.SkillRepository;
import com.nullbase.personalAssist.modules.skills.dto.SkillDto;
import com.nullbase.personalAssist.modules.roadmap.RoadmapConverterService;
import com.nullbase.personalAssist.modules.roadmap.RoadmapSchema;
import com.nullbase.personalAssist.modules.validators.RoadmapValidator;
import com.nullbase.personalAssist.modules.validators.RoadmapValidationResult;
import com.nullbase.personalAssist.modules.normalization.RoadmapNormalizer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class ImportExportService {

    @Autowired
    private RoadmapValidator roadmapValidator;

    @Autowired
    private RoadmapNormalizer roadmapNormalizer;

    @Autowired
    private DraftRepository draftRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private RoadmapConverterService roadmapConverterService;

    private static final ObjectMapper objectMapper = new ObjectMapper();

    public RoadmapValidationResult previewValidation(String jsonStr) {
        try {
            RoadmapSchema schema = objectMapper.readValue(jsonStr, RoadmapSchema.class);
            return roadmapValidator.validate(schema);
        } catch (JsonProcessingException e) {
            RoadmapValidationResult failedResult = new RoadmapValidationResult();
            failedResult.addError("root", "Invalid JSON syntax: " + e.getMessage(), "ERROR");
            return failedResult;
        }
    }

    @Transactional
    public DraftDto importAsDraft(String jsonStr, User user) {
        try {
            RoadmapSchema schema = objectMapper.readValue(jsonStr, RoadmapSchema.class);
            
            // 1. Validate
            RoadmapValidationResult validationResult = roadmapValidator.validate(schema);
            if (!validationResult.isValid()) {
                StringBuilder errorMsg = new StringBuilder("JSON Schema validation failed: ");
                validationResult.getErrors().forEach(err -> 
                    errorMsg.append("[").append(err.getPath()).append("]: ").append(err.getMessage()).append("; ")
                );
                throw new IllegalArgumentException(errorMsg.toString());
            }

            // 2. Normalize
            RoadmapSchema normalized = roadmapNormalizer.normalize(schema);

            // 3. Create Draft
            String title = (normalized.getSkill() != null) ? normalized.getSkill().getName() : "Imported Roadmap";
            Draft draft = new Draft(
                    user,
                    null, // Null initially because it is a draft
                    title,
                    normalized,
                    DraftStatus.DRAFT
            );

            Draft saved = draftRepository.save(draft);
            return new DraftDto(saved);

        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("Failed to parse JSON content: " + e.getMessage(), e);
        }
    }

    @Transactional
    public SkillDto importDirectlyAsSkill(String jsonStr, User user) {
        try {
            RoadmapSchema schema = objectMapper.readValue(jsonStr, RoadmapSchema.class);
            
            // 1. Validate
            RoadmapValidationResult validationResult = roadmapValidator.validate(schema);
            if (!validationResult.isValid()) {
                StringBuilder errorMsg = new StringBuilder("JSON Schema validation failed: ");
                validationResult.getErrors().forEach(err -> 
                    errorMsg.append("[").append(err.getPath()).append("]: ").append(err.getMessage()).append("; ")
                );
                throw new IllegalArgumentException(errorMsg.toString());
            }

            // 2. Normalize
            RoadmapSchema normalized = roadmapNormalizer.normalize(schema);

            // 3. Convert immediately to Skill entity hierarchy
            Skill savedSkill = roadmapConverterService.schemaToEntity(normalized, user, null);
            
            // The RoadmapConverterService already recalculates progress. We can just return it.
            // But we need to use the skillService to get the proper DTO with counts.
            // Since we don't have SkillService injected here, we can construct the DTO manually
            // or just return a simple one. The skill is new so it has 0 completed subtopics,
            // but we can compute the total topics.
            int totalTopics = (normalized.getTopics() != null) ? normalized.getTopics().size() : 0;
            return new SkillDto(savedSkill, totalTopics, 0);

        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("Failed to parse JSON content: " + e.getMessage(), e);
        }
    }

    @Transactional(readOnly = true)
    public RoadmapSchema exportSkill(UUID skillId, User user) {
        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new IllegalArgumentException("Skill not found for ID: " + skillId));
        
        if (!skill.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Unauthorized export of this skill");
        }

        return roadmapConverterService.entityToSchema(skill);
    }
}

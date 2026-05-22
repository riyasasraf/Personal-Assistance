package com.nullbase.personalAssist.modules.drafts;

import com.nullbase.personalAssist.entity.User;
import com.nullbase.personalAssist.modules.skills.Skill;
import com.nullbase.personalAssist.modules.skills.SkillRepository;
import com.nullbase.personalAssist.modules.roadmap.RoadmapConverterService;
import com.nullbase.personalAssist.modules.roadmap.RoadmapSchema;
import com.nullbase.personalAssist.modules.validators.RoadmapValidator;
import com.nullbase.personalAssist.modules.validators.RoadmapValidationResult;
import com.nullbase.personalAssist.modules.normalization.RoadmapNormalizer;
import com.nullbase.personalAssist.modules.drafts.dto.CreateDraftRequest;
import com.nullbase.personalAssist.modules.drafts.dto.DraftDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DraftService {

    @Autowired
    private DraftRepository draftRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private RoadmapValidator roadmapValidator;

    @Autowired
    private RoadmapNormalizer roadmapNormalizer;

    @Autowired
    private RoadmapConverterService roadmapConverterService;

    @Transactional(readOnly = true)
    public List<DraftDto> getDrafts(User user) {
        return draftRepository.findByUserOrderByUpdatedAtDesc(user)
                .stream()
                .map(DraftDto::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public DraftDto getDraftById(UUID id, User user) {
        Draft draft = getDraftEntity(id, user);
        return new DraftDto(draft);
    }

    @Transactional
    public DraftDto createDraft(CreateDraftRequest request, User user) {
        Skill skill = null;
        if (request.getSkillId() != null) {
            skill = skillRepository.findById(request.getSkillId())
                    .orElseThrow(() -> new IllegalArgumentException("Skill not found for ID: " + request.getSkillId()));
            if (!skill.getUser().getId().equals(user.getId())) {
                throw new IllegalArgumentException("Unauthorized skill mapping");
            }
        }

        Draft draft = new Draft(
                user,
                skill,
                request.getTitle(),
                request.getDraftJson(),
                DraftStatus.DRAFT
        );

        Draft saved = draftRepository.save(draft);
        return new DraftDto(saved);
    }

    @Transactional
    public DraftDto updateDraft(UUID id, CreateDraftRequest request, User user) {
        Draft draft = getDraftEntity(id, user);
        draft.setTitle(request.getTitle());
        draft.setDraftJson(request.getDraftJson());

        if (request.getSkillId() != null) {
            Skill skill = skillRepository.findById(request.getSkillId())
                    .orElseThrow(() -> new IllegalArgumentException("Skill not found for ID: " + request.getSkillId()));
            if (!skill.getUser().getId().equals(user.getId())) {
                throw new IllegalArgumentException("Unauthorized skill mapping");
            }
            draft.setSkill(skill);
        } else {
            draft.setSkill(null);
        }

        Draft updated = draftRepository.save(draft);
        return new DraftDto(updated);
    }

    @Transactional
    public void deleteDraft(UUID id, User user) {
        Draft draft = getDraftEntity(id, user);
        draftRepository.delete(draft);
    }

    @Transactional
    public DraftDto updateStatus(UUID id, DraftStatus status, User user) {
        Draft draft = getDraftEntity(id, user);
        draft.setStatus(status);
        Draft saved = draftRepository.save(draft);
        return new DraftDto(saved);
    }

    @Transactional
    public DraftDto publishDraft(UUID id, User user) {
        Draft draft = getDraftEntity(id, user);
        RoadmapSchema schema = draft.getDraftJson();

        if (schema == null) {
            throw new IllegalArgumentException("Draft JSON content is empty. Cannot publish an empty draft.");
        }

        // 1. Validation Pipeline
        RoadmapValidationResult validationResult = roadmapValidator.validate(schema);
        if (!validationResult.isValid()) {
            StringBuilder errorMsg = new StringBuilder("Roadmap Schema Validation failed: ");
            validationResult.getErrors().forEach(err -> 
                errorMsg.append("[").append(err.getPath()).append("]: ").append(err.getMessage()).append("; ")
            );
            throw new IllegalArgumentException(errorMsg.toString());
        }

        // 2. Normalization Pipeline
        RoadmapSchema normalizedSchema = roadmapNormalizer.normalize(schema);

        // 3. Entity creation/recreation
        UUID existingSkillId = draft.getSkill() != null ? draft.getSkill().getId() : null;
        Skill publishedSkill = roadmapConverterService.schemaToEntity(normalizedSchema, user, existingSkillId);

        // 4. Update Draft Status to PUBLISHED
        draft.setSkill(publishedSkill);
        draft.setStatus(DraftStatus.PUBLISHED);
        draft.setPublishedAt(LocalDateTime.now());
        draft.setDraftJson(normalizedSchema); // save normalized representation

        Draft saved = draftRepository.save(draft);
        return new DraftDto(saved);
    }

    public Draft getDraftEntity(UUID id, User user) {
        Draft draft = draftRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Draft not found with ID: " + id));
        if (!draft.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Unauthorized access to this draft");
        }
        return draft;
    }
}

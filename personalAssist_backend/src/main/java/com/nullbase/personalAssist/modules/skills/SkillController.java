package com.nullbase.personalAssist.modules.skills;

import com.nullbase.personalAssist.entity.User;
import com.nullbase.personalAssist.modules.common.ApiResponse;
import com.nullbase.personalAssist.modules.skills.dto.CreateSkillRequest;
import com.nullbase.personalAssist.modules.skills.dto.SkillDto;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/skills")
public class SkillController {

    @Autowired
    private SkillService skillService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<SkillDto>>> getAllSkills(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) SkillStatus status,
            @RequestParam(required = false) SkillLevel level) {
        
        List<SkillDto> skills = skillService.getAllSkills(user, search, status, level);
        ApiResponse<List<SkillDto>> response = new ApiResponse<>(true, "Skills retrieved successfully", skills);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SkillDto>> getSkillById(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user) {
        
        SkillDto skill = skillService.getSkillById(id, user);
        ApiResponse<SkillDto> response = new ApiResponse<>(true, "Skill retrieved successfully", skill);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SkillDto>> createSkill(
            @Valid @RequestBody CreateSkillRequest request,
            @AuthenticationPrincipal User user) {
        
        SkillDto created = skillService.createSkill(request, user);
        ApiResponse<SkillDto> response = new ApiResponse<>(true, "Skill created successfully", created);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SkillDto>> updateSkill(
            @PathVariable UUID id,
            @Valid @RequestBody CreateSkillRequest request,
            @AuthenticationPrincipal User user) {
        
        SkillDto updated = skillService.updateSkill(id, request, user);
        ApiResponse<SkillDto> response = new ApiResponse<>(true, "Skill updated successfully", updated);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteSkill(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user) {
        
        skillService.deleteSkill(id, user);
        ApiResponse<String> response = new ApiResponse<>(true, "Skill deleted successfully", null);
        return ResponseEntity.ok(response);
    }
}

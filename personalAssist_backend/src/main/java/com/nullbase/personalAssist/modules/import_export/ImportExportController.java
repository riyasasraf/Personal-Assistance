package com.nullbase.personalAssist.modules.import_export;

import com.nullbase.personalAssist.entity.User;
import com.nullbase.personalAssist.modules.common.ApiResponse;
import com.nullbase.personalAssist.modules.drafts.dto.DraftDto;
import com.nullbase.personalAssist.modules.skills.dto.SkillDto;
import com.nullbase.personalAssist.modules.roadmap.RoadmapSchema;
import com.nullbase.personalAssist.modules.validators.RoadmapValidationResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/import-export")
public class ImportExportController {

    @Autowired
    private ImportExportService importExportService;

    @PostMapping("/validate-preview")
    public ResponseEntity<ApiResponse<RoadmapValidationResult>> validatePreview(@RequestBody String jsonStr) {
        RoadmapValidationResult result = importExportService.previewValidation(jsonStr);
        ApiResponse<RoadmapValidationResult> response = new ApiResponse<>(true, "Roadmap validation preview completed", result);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/import")
    public ResponseEntity<ApiResponse<DraftDto>> importAsDraft(@RequestBody String jsonStr, @AuthenticationPrincipal User user) {
        DraftDto imported = importExportService.importAsDraft(jsonStr, user);
        ApiResponse<DraftDto> response = new ApiResponse<>(true, "Roadmap imported as draft successfully", imported);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/import-direct")
    public ResponseEntity<ApiResponse<SkillDto>> importDirectlyAsSkill(@RequestBody String jsonStr, @AuthenticationPrincipal User user) {
        SkillDto imported = importExportService.importDirectlyAsSkill(jsonStr, user);
        ApiResponse<SkillDto> response = new ApiResponse<>(true, "Roadmap imported as skill successfully", imported);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/export/{skillId}")
    public ResponseEntity<ApiResponse<RoadmapSchema>> exportSkill(@PathVariable UUID skillId, @AuthenticationPrincipal User user) {
        RoadmapSchema exported = importExportService.exportSkill(skillId, user);
        ApiResponse<RoadmapSchema> response = new ApiResponse<>(true, "Roadmap exported successfully", exported);
        return ResponseEntity.ok(response);
    }
}

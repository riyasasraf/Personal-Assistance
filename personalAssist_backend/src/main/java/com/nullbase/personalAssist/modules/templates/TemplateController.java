package com.nullbase.personalAssist.modules.templates;

import com.nullbase.personalAssist.entity.User;
import com.nullbase.personalAssist.modules.common.ApiResponse;
import com.nullbase.personalAssist.modules.drafts.dto.DraftDto;
import com.nullbase.personalAssist.modules.templates.dto.TemplateDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/templates")
public class TemplateController {

    @Autowired
    private TemplateService templateService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<TemplateDto>>> getTemplates(@AuthenticationPrincipal User user) {
        List<TemplateDto> templates = templateService.getAllAvailableTemplates(user);
        ApiResponse<List<TemplateDto>> response = new ApiResponse<>(true, "Templates retrieved successfully", templates);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TemplateDto>> getTemplateById(@PathVariable UUID id) {
        TemplateDto template = templateService.getTemplateById(id);
        ApiResponse<TemplateDto> response = new ApiResponse<>(true, "Template retrieved successfully", template);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/import")
    public ResponseEntity<ApiResponse<DraftDto>> importAsDraft(@PathVariable UUID id, @AuthenticationPrincipal User user) {
        DraftDto imported = templateService.importAsDraft(id, user);
        ApiResponse<DraftDto> response = new ApiResponse<>(true, "Template imported to drafts successfully", imported);
        return ResponseEntity.ok(response);
    }
}

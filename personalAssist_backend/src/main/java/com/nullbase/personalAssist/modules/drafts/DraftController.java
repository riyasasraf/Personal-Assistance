package com.nullbase.personalAssist.modules.drafts;

import com.nullbase.personalAssist.entity.User;
import com.nullbase.personalAssist.modules.common.ApiResponse;
import com.nullbase.personalAssist.modules.drafts.dto.CreateDraftRequest;
import com.nullbase.personalAssist.modules.drafts.dto.DraftDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/drafts")
public class DraftController {

    @Autowired
    private DraftService draftService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<DraftDto>>> getDrafts(@AuthenticationPrincipal User user) {
        List<DraftDto> drafts = draftService.getDrafts(user);
        ApiResponse<List<DraftDto>> response = new ApiResponse<>(true, "Drafts retrieved successfully", drafts);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DraftDto>> getDraftById(@PathVariable UUID id, @AuthenticationPrincipal User user) {
        DraftDto draft = draftService.getDraftById(id, user);
        ApiResponse<DraftDto> response = new ApiResponse<>(true, "Draft retrieved successfully", draft);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<DraftDto>> createDraft(@RequestBody CreateDraftRequest request, @AuthenticationPrincipal User user) {
        DraftDto created = draftService.createDraft(request, user);
        ApiResponse<DraftDto> response = new ApiResponse<>(true, "Draft created successfully", created);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<DraftDto>> updateDraft(@PathVariable UUID id, @RequestBody CreateDraftRequest request, @AuthenticationPrincipal User user) {
        DraftDto updated = draftService.updateDraft(id, request, user);
        ApiResponse<DraftDto> response = new ApiResponse<>(true, "Draft updated successfully", updated);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteDraft(@PathVariable UUID id, @AuthenticationPrincipal User user) {
        draftService.deleteDraft(id, user);
        ApiResponse<String> response = new ApiResponse<>(true, "Draft deleted successfully", null);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<DraftDto>> updateStatus(@PathVariable UUID id, @RequestParam DraftStatus status, @AuthenticationPrincipal User user) {
        DraftDto updated = draftService.updateStatus(id, status, user);
        ApiResponse<DraftDto> response = new ApiResponse<>(true, "Draft status updated successfully", updated);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/publish")
    public ResponseEntity<ApiResponse<DraftDto>> publishDraft(@PathVariable UUID id, @AuthenticationPrincipal User user) {
        DraftDto published = draftService.publishDraft(id, user);
        ApiResponse<DraftDto> response = new ApiResponse<>(true, "Draft published successfully as active skill roadmap", published);
        return ResponseEntity.ok(response);
    }
}

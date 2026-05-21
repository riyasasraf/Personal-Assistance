package com.nullbase.personalAssist.modules.revisions;

import com.nullbase.personalAssist.entity.User;
import com.nullbase.personalAssist.modules.common.ApiResponse;
import com.nullbase.personalAssist.modules.revisions.dto.RevisionDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/revisions")
public class RevisionController {

    @Autowired
    private RevisionService revisionService;

    @GetMapping("/today")
    public ResponseEntity<ApiResponse<List<RevisionDto>>> getTodayRevisions(
            @AuthenticationPrincipal User user) {
        
        List<RevisionDto> revisions = revisionService.getTodayRevisions(user);
        ApiResponse<List<RevisionDto>> response = new ApiResponse<>(true, "Today's revisions retrieved successfully", revisions);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<ApiResponse<RevisionDto>> completeRevision(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user) {
        
        RevisionDto completed = revisionService.completeRevision(id, user);
        ApiResponse<RevisionDto> response = new ApiResponse<>(true, "Revision marked as completed successfully", completed);
        return ResponseEntity.ok(response);
    }
}

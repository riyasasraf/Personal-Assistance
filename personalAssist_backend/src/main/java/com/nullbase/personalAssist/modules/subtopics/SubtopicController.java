package com.nullbase.personalAssist.modules.subtopics;

import com.nullbase.personalAssist.entity.User;
import com.nullbase.personalAssist.modules.common.ApiResponse;
import com.nullbase.personalAssist.modules.subtopics.dto.CreateSubtopicRequest;
import com.nullbase.personalAssist.modules.subtopics.dto.SubtopicDto;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/subtopics")
public class SubtopicController {

    @Autowired
    private SubtopicService subtopicService;

    @GetMapping("/topic/{topicId}")
    public ResponseEntity<ApiResponse<List<SubtopicDto>>> getSubtopicsByTopic(
            @PathVariable UUID topicId,
            @AuthenticationPrincipal User user) {
        
        List<SubtopicDto> subtopics = subtopicService.getSubtopicsByTopic(topicId, user);
        ApiResponse<List<SubtopicDto>> response = new ApiResponse<>(true, "Subtopics retrieved successfully", subtopics);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SubtopicDto>> createSubtopic(
            @Valid @RequestBody CreateSubtopicRequest request,
            @AuthenticationPrincipal User user) {
        
        SubtopicDto created = subtopicService.createSubtopic(request, user);
        ApiResponse<SubtopicDto> response = new ApiResponse<>(true, "Subtopic created successfully", created);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SubtopicDto>> updateSubtopic(
            @PathVariable UUID id,
            @Valid @RequestBody CreateSubtopicRequest request,
            @AuthenticationPrincipal User user) {
        
        SubtopicDto updated = subtopicService.updateSubtopic(id, request, user);
        ApiResponse<SubtopicDto> response = new ApiResponse<>(true, "Subtopic updated successfully", updated);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<ApiResponse<SubtopicDto>> toggleComplete(
            @PathVariable UUID id,
            @RequestParam boolean completed,
            @AuthenticationPrincipal User user) {
        
        SubtopicDto toggled = subtopicService.toggleCompleted(id, completed, user);
        ApiResponse<SubtopicDto> response = new ApiResponse<>(true, "Subtopic completion updated successfully", toggled);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteSubtopic(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user) {
        
        subtopicService.deleteSubtopic(id, user);
        ApiResponse<String> response = new ApiResponse<>(true, "Subtopic deleted successfully", null);
        return ResponseEntity.ok(response);
    }
}

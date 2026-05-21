package com.nullbase.personalAssist.modules.topics;

import com.nullbase.personalAssist.entity.User;
import com.nullbase.personalAssist.modules.common.ApiResponse;
import com.nullbase.personalAssist.modules.topics.dto.CreateTopicRequest;
import com.nullbase.personalAssist.modules.topics.dto.TopicDto;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/topics")
public class TopicController {

    @Autowired
    private TopicService topicService;

    @GetMapping("/skill/{skillId}")
    public ResponseEntity<ApiResponse<List<TopicDto>>> getTopicsBySkill(
            @PathVariable UUID skillId,
            @AuthenticationPrincipal User user) {
        
        List<TopicDto> topics = topicService.getTopicsBySkill(skillId, user);
        ApiResponse<List<TopicDto>> response = new ApiResponse<>(true, "Topics retrieved successfully", topics);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TopicDto>> createTopic(
            @Valid @RequestBody CreateTopicRequest request,
            @AuthenticationPrincipal User user) {
        
        TopicDto created = topicService.createTopic(request, user);
        ApiResponse<TopicDto> response = new ApiResponse<>(true, "Topic created successfully", created);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TopicDto>> updateTopic(
            @PathVariable UUID id,
            @Valid @RequestBody CreateTopicRequest request,
            @AuthenticationPrincipal User user) {
        
        TopicDto updated = topicService.updateTopic(id, request, user);
        ApiResponse<TopicDto> response = new ApiResponse<>(true, "Topic updated successfully", updated);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteTopic(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user) {
        
        topicService.deleteTopic(id, user);
        ApiResponse<String> response = new ApiResponse<>(true, "Topic deleted successfully", null);
        return ResponseEntity.ok(response);
    }
}

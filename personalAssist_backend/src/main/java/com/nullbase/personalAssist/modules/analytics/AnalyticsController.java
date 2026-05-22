package com.nullbase.personalAssist.modules.analytics;

import com.nullbase.personalAssist.entity.User;
import com.nullbase.personalAssist.modules.common.ApiResponse;
import com.nullbase.personalAssist.modules.analytics.dto.AnalyticsDashboardDto;
import com.nullbase.personalAssist.modules.analytics.dto.LearningSessionDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<AnalyticsDashboardDto>> getDashboardStats(@AuthenticationPrincipal User user) {
        AnalyticsDashboardDto stats = analyticsService.getDashboardStats(user);
        ApiResponse<AnalyticsDashboardDto> response = new ApiResponse<>(true, "Analytics dashboard stats retrieved successfully", stats);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/sessions/start")
    public ResponseEntity<ApiResponse<LearningSessionDto>> startSession(@RequestParam UUID taskId, @AuthenticationPrincipal User user) {
        LearningSessionDto session = analyticsService.startSession(taskId, user);
        ApiResponse<LearningSessionDto> response = new ApiResponse<>(true, "Learning session started successfully", session);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/sessions/{id}/end")
    public ResponseEntity<ApiResponse<LearningSessionDto>> endSession(
            @PathVariable UUID id,
            @RequestParam boolean completed,
            @AuthenticationPrincipal User user) {
        LearningSessionDto session = analyticsService.endSession(id, completed, user);
        ApiResponse<LearningSessionDto> response = new ApiResponse<>(true, "Learning session ended successfully", session);
        return ResponseEntity.ok(response);
    }
}

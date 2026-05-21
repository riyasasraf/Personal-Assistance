package com.nullbase.personalAssist.modules.scheduler;

import com.nullbase.personalAssist.entity.User;
import com.nullbase.personalAssist.modules.common.ApiResponse;
import com.nullbase.personalAssist.modules.scheduler.dto.SchedulerPreferencesDto;
import com.nullbase.personalAssist.modules.scheduler.dto.SaveSchedulerPreferencesRequest;
import com.nullbase.personalAssist.modules.tasks.dto.TaskDto;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/scheduler")
public class SchedulerController {

    @Autowired
    private SchedulerService schedulerService;

    @PostMapping("/run-daily")
    public ResponseEntity<ApiResponse<List<TaskDto>>> runDailyScheduler(
            @AuthenticationPrincipal User user) {
        
        List<TaskDto> scheduled = schedulerService.runDailyScheduler(user);
        ApiResponse<List<TaskDto>> response = new ApiResponse<>(true, "Daily scheduler completed successfully", scheduled);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/preview")
    public ResponseEntity<ApiResponse<List<TaskDto>>> previewScheduler(
            @AuthenticationPrincipal User user) {
        
        List<TaskDto> preview = schedulerService.previewScheduler(user);
        ApiResponse<List<TaskDto>> response = new ApiResponse<>(true, "Daily scheduler preview generated successfully", preview);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/preferences")
    public ResponseEntity<ApiResponse<List<SchedulerPreferencesDto>>> getPreferences(
            @AuthenticationPrincipal User user) {
        
        List<SchedulerPreferencesDto> preferences = schedulerService.getPreferences(user);
        ApiResponse<List<SchedulerPreferencesDto>> response = new ApiResponse<>(true, "Scheduler preferences retrieved successfully", preferences);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/preferences")
    public ResponseEntity<ApiResponse<SchedulerPreferencesDto>> savePreference(
            @Valid @RequestBody SaveSchedulerPreferencesRequest request,
            @AuthenticationPrincipal User user) {
        
        SchedulerPreferencesDto saved = schedulerService.savePreference(request, user);
        ApiResponse<SchedulerPreferencesDto> response = new ApiResponse<>(true, "Scheduler preference saved successfully", saved);
        return ResponseEntity.ok(response);
    }
}

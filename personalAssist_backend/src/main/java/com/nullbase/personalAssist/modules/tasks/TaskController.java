package com.nullbase.personalAssist.modules.tasks;

import com.nullbase.personalAssist.entity.User;
import com.nullbase.personalAssist.modules.common.ApiResponse;
import com.nullbase.personalAssist.modules.tasks.dto.CreateTaskRequest;
import com.nullbase.personalAssist.modules.tasks.dto.TaskDto;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @GetMapping("/subtopic/{subtopicId}")
    public ResponseEntity<ApiResponse<List<TaskDto>>> getTasksBySubtopic(
            @PathVariable UUID subtopicId,
            @AuthenticationPrincipal User user) {
        
        List<TaskDto> tasks = taskService.getTasksBySubtopic(subtopicId, user);
        ApiResponse<List<TaskDto>> response = new ApiResponse<>(true, "Tasks retrieved successfully", tasks);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TaskDto>> createTask(
            @Valid @RequestBody CreateTaskRequest request,
            @AuthenticationPrincipal User user) {
        
        TaskDto created = taskService.createTask(request, user);
        ApiResponse<TaskDto> response = new ApiResponse<>(true, "Task created successfully", created);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskDto>> updateTask(
            @PathVariable UUID id,
            @Valid @RequestBody CreateTaskRequest request,
            @AuthenticationPrincipal User user) {
        
        TaskDto updated = taskService.updateTask(id, request, user);
        ApiResponse<TaskDto> response = new ApiResponse<>(true, "Task updated successfully", updated);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<ApiResponse<TaskDto>> markComplete(
            @PathVariable UUID id,
            @RequestParam boolean completed,
            @AuthenticationPrincipal User user) {
        
        TaskDto task = taskService.markComplete(id, completed, user);
        ApiResponse<TaskDto> response = new ApiResponse<>(true, "Task completion updated", task);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<TaskDto>> updateStatus(
            @PathVariable UUID id,
            @RequestParam TaskStatus status,
            @AuthenticationPrincipal User user) {
        
        TaskDto task = taskService.updateTaskStatus(id, status, user);
        ApiResponse<TaskDto> response = new ApiResponse<>(true, "Task status updated successfully", task);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/today")
    public ResponseEntity<ApiResponse<List<TaskDto>>> getTodayTasks(
            @AuthenticationPrincipal User user) {
        
        List<TaskDto> tasks = taskService.getTodayTasks(user);
        ApiResponse<List<TaskDto>> response = new ApiResponse<>(true, "Today's tasks retrieved successfully", tasks);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/upcoming")
    public ResponseEntity<ApiResponse<List<TaskDto>>> getUpcomingTasks(
            @AuthenticationPrincipal User user) {
        
        List<TaskDto> tasks = taskService.getUpcomingTasks(user);
        ApiResponse<List<TaskDto>> response = new ApiResponse<>(true, "Upcoming tasks retrieved successfully", tasks);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/overdue")
    public ResponseEntity<ApiResponse<List<TaskDto>>> getOverdueTasks(
            @AuthenticationPrincipal User user) {
        
        List<TaskDto> tasks = taskService.getOverdueTasks(user);
        ApiResponse<List<TaskDto>> response = new ApiResponse<>(true, "Overdue tasks retrieved successfully", tasks);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteTask(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user) {
        
        taskService.deleteTask(id, user);
        ApiResponse<String> response = new ApiResponse<>(true, "Task deleted successfully", null);
        return ResponseEntity.ok(response);
    }
}

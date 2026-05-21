package com.nullbase.personalAssist.modules.tasks;

import com.nullbase.personalAssist.entity.User;
import com.nullbase.personalAssist.modules.subtopics.Subtopic;
import com.nullbase.personalAssist.modules.subtopics.SubtopicService;
import com.nullbase.personalAssist.modules.revisions.RevisionService;
import com.nullbase.personalAssist.modules.tasks.dto.CreateTaskRequest;
import com.nullbase.personalAssist.modules.tasks.dto.TaskDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private SubtopicService subtopicService;

    @Autowired
    private RevisionService revisionService;

    @Transactional(readOnly = true)
    public List<TaskDto> getTasksBySubtopic(UUID subtopicId, User user) {
        Subtopic subtopic = subtopicService.getSubtopicEntity(subtopicId, user);
        List<Task> tasks = taskRepository.findBySubtopic(subtopic);
        return tasks.stream()
                .map(TaskDto::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public TaskDto createTask(CreateTaskRequest request, User user) {
        Subtopic subtopic = subtopicService.getSubtopicEntity(request.getSubtopicId(), user);
        
        Task task = new Task(
                subtopic,
                request.getTitle(),
                request.getDescription(),
                request.getTaskType(),
                request.getStatus(),
                request.getScheduledDate(),
                request.getPriority(),
                request.getEstimatedMinutes()
        );

        if (request.getStatus() == TaskStatus.COMPLETED) {
            task.setCompletedAt(LocalDateTime.now());
        }

        Task saved = taskRepository.save(task);

        if (saved.getStatus() == TaskStatus.COMPLETED) {
            revisionService.createRevisionsForTask(saved);
            updateSubtopicCompletionStatus(subtopic, user);
        }

        return new TaskDto(saved);
    }

    @Transactional
    public TaskDto updateTask(UUID id, CreateTaskRequest request, User user) {
        Task task = getTaskEntity(id, user);
        Subtopic oldSubtopic = task.getSubtopic();

        if (!task.getSubtopic().getId().equals(request.getSubtopicId())) {
            Subtopic newSubtopic = subtopicService.getSubtopicEntity(request.getSubtopicId(), user);
            task.setSubtopic(newSubtopic);
        }

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setTaskType(request.getTaskType());
        task.setPriority(request.getPriority());
        task.setEstimatedMinutes(request.getEstimatedMinutes());
        
        TaskStatus oldStatus = task.getStatus();
        task.setStatus(request.getStatus());
        task.setScheduledDate(request.getScheduledDate());

        if (request.getStatus() == TaskStatus.COMPLETED && oldStatus != TaskStatus.COMPLETED) {
            task.setCompletedAt(LocalDateTime.now());
            revisionService.createRevisionsForTask(task);
        } else if (request.getStatus() != TaskStatus.COMPLETED) {
            task.setCompletedAt(null);
        }

        Task saved = taskRepository.save(task);

        updateSubtopicCompletionStatus(saved.getSubtopic(), user);
        if (!oldSubtopic.getId().equals(saved.getSubtopic().getId())) {
            updateSubtopicCompletionStatus(oldSubtopic, user);
        }

        return new TaskDto(saved);
    }

    @Transactional
    public TaskDto updateTaskStatus(UUID id, TaskStatus status, User user) {
        Task task = getTaskEntity(id, user);
        TaskStatus oldStatus = task.getStatus();

        if (status == oldStatus) {
            return new TaskDto(task);
        }

        task.setStatus(status);

        if (status == TaskStatus.COMPLETED) {
            task.setCompletedAt(LocalDateTime.now());
            revisionService.createRevisionsForTask(task);
        } else {
            task.setCompletedAt(null);
        }

        Task saved = taskRepository.save(task);

        updateSubtopicCompletionStatus(saved.getSubtopic(), user);

        return new TaskDto(saved);
    }

    @Transactional
    public TaskDto markComplete(UUID id, boolean completed, User user) {
        return updateTaskStatus(id, completed ? TaskStatus.COMPLETED : TaskStatus.TODO, user);
    }

    @Transactional
    public void deleteTask(UUID id, User user) {
        Task task = getTaskEntity(id, user);
        Subtopic subtopic = task.getSubtopic();
        taskRepository.delete(task);
        updateSubtopicCompletionStatus(subtopic, user);
    }

    @Transactional(readOnly = true)
    public List<TaskDto> getTodayTasks(User user) {
        List<Task> tasks = taskRepository.findTodayTasksByUser(user, LocalDate.now());
        return tasks.stream()
                .map(TaskDto::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TaskDto> getUpcomingTasks(User user) {
        List<Task> tasks = taskRepository.findUpcomingTasksByUser(user, LocalDate.now());
        return tasks.stream()
                .map(TaskDto::new)
                .collect(Collectors.toList());
  }

    @Transactional(readOnly = true)
    public List<TaskDto> getOverdueTasks(User user) {
        List<Task> tasks = taskRepository.findOverdueTasksByUser(user, LocalDate.now());
        return tasks.stream()
                .map(TaskDto::new)
                .collect(Collectors.toList());
    }

    public Task getTaskEntity(UUID id, User user) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Task not found with ID: " + id));
        subtopicService.getSubtopicEntity(task.getSubtopic().getId(), user);
        return task;
    }

    private void updateSubtopicCompletionStatus(Subtopic subtopic, User user) {
        List<Task> tasks = taskRepository.findBySubtopic(subtopic);
        if (tasks.isEmpty()) {
            return;
        }
        boolean allCompleted = true;
        for (Task t : tasks) {
            if (t.getStatus() != TaskStatus.COMPLETED && t.getStatus() != TaskStatus.SKIPPED) {
                allCompleted = false;
                break;
            }
        }
        if (allCompleted != subtopic.isCompleted()) {
            subtopicService.toggleCompleted(subtopic.getId(), allCompleted, user);
        }
    }
}

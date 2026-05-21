package com.nullbase.personalAssist.modules.scheduler;

import com.nullbase.personalAssist.entity.User;
import com.nullbase.personalAssist.modules.skills.Skill;
import com.nullbase.personalAssist.modules.skills.SkillService;
import com.nullbase.personalAssist.modules.tasks.Task;
import com.nullbase.personalAssist.modules.tasks.TaskRepository;
import com.nullbase.personalAssist.modules.tasks.TaskStatus;
import com.nullbase.personalAssist.modules.tasks.dto.TaskDto;
import com.nullbase.personalAssist.modules.scheduler.dto.SchedulerPreferencesDto;
import com.nullbase.personalAssist.modules.scheduler.dto.SaveSchedulerPreferencesRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SchedulerService {

    @Autowired
    private SchedulerPreferencesRepository preferencesRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private SkillService skillService;

    @Transactional(readOnly = true)
    public List<SchedulerPreferencesDto> getPreferences(User user) {
        return preferencesRepository.findByUser(user).stream()
                .map(SchedulerPreferencesDto::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public SchedulerPreferencesDto savePreference(SaveSchedulerPreferencesRequest request, User user) {
        Skill skill = null;
        if (request.getSkillId() != null) {
            skill = skillService.getSkillEntity(request.getSkillId(), user);
        }

        Optional<SchedulerPreferences> existingOpt;
        if (skill == null) {
            existingOpt = preferencesRepository.findByUserAndSkillIsNull(user);
        } else {
            existingOpt = preferencesRepository.findByUserAndSkill(user, skill);
        }

        SchedulerPreferences preferences;
        if (existingOpt.isPresent()) {
            preferences = existingOpt.get();
            preferences.setTasksPerDay(request.getTasksPerDay());
            preferences.setPreferredDays(request.getPreferredDays());
            preferences.setStudyMinutesPerDay(request.getStudyMinutesPerDay());
        } else {
            preferences = new SchedulerPreferences(
                    user,
                    skill,
                    request.getTasksPerDay(),
                    request.getPreferredDays(),
                    request.getStudyMinutesPerDay()
            );
        }

        SchedulerPreferences saved = preferencesRepository.save(preferences);
        return new SchedulerPreferencesDto(saved);
    }

    @Transactional
    public List<TaskDto> runDailyScheduler(User user) {
        List<Task> scheduledTasks = allocateTasksForToday(user, true);
        return scheduledTasks.stream()
                .map(TaskDto::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TaskDto> previewScheduler(User user) {
        List<Task> scheduledTasks = allocateTasksForToday(user, false);
        return scheduledTasks.stream()
                .map(TaskDto::new)
                .collect(Collectors.toList());
    }

    private List<Task> allocateTasksForToday(User user, boolean persist) {
        LocalDate today = LocalDate.now();
        boolean isWeekend = (today.getDayOfWeek().getValue() == 6 || today.getDayOfWeek().getValue() == 7);

        // Fetch user preferences
        List<SchedulerPreferences> prefs = preferencesRepository.findByUser(user);
        SchedulerPreferences globalPref = prefs.stream()
                .filter(p -> p.getSkill() == null)
                .findFirst()
                .orElse(new SchedulerPreferences(user, null, 5, "ALL", 120));

        Map<UUID, SchedulerPreferences> skillPrefs = new HashMap<>();
        for (SchedulerPreferences p : prefs) {
            if (p.getSkill() != null) {
                skillPrefs.put(p.getSkill().getId(), p);
            }
        }

        // Fetch incomplete tasks for user
        List<Task> incompleteTasks = taskRepository.findIncompleteByUser(user);

        // Sort incomplete tasks
        // Priority descending (CRITICAL -> HIGH -> MEDIUM -> LOW),
        // then Scheduled Date (overdue first, null/unscheduled last),
        // then Created Date ascending (oldest first).
        incompleteTasks.sort((t1, t2) -> {
            // Priority sort (Critical ordinal is highest, so reverse compare)
            int priorityCompare = t2.getPriority().compareTo(t1.getPriority());
            if (priorityCompare != 0) {
                return priorityCompare;
            }

            // Scheduled date comparison (overdue tasks first)
            LocalDate d1 = t1.getScheduledDate();
            LocalDate d2 = t2.getScheduledDate();
            boolean t1Overdue = d1 != null && d1.isBefore(today);
            boolean t2Overdue = d2 != null && d2.isBefore(today);

            if (t1Overdue && !t2Overdue) {
                return -1;
            } else if (!t1Overdue && t2Overdue) {
                return 1;
            } else if (t1Overdue && t2Overdue) {
                int dateCompare = d1.compareTo(d2);
                if (dateCompare != 0) return dateCompare;
            } else {
                // If neither is overdue, we want scheduled today to sort before null
                boolean t1Today = d1 != null && d1.isEqual(today);
                boolean t2Today = d2 != null && d2.isEqual(today);
                if (t1Today && !t2Today) return -1;
                if (!t1Today && t2Today) return 1;
            }

            // Created date comparison (oldest first)
            if (t1.getCreatedAt() != null && t2.getCreatedAt() != null) {
                return t1.getCreatedAt().compareTo(t2.getCreatedAt());
            }
            return 0;
        });

        List<Task> tasksToScheduleToday = new ArrayList<>();
        Map<UUID, Integer> skillScheduleCounts = new HashMap<>();
        int totalMinutesScheduled = 0;

        // First pass: scan and count tasks already scheduled for today
        for (Task task : incompleteTasks) {
            if (task.getScheduledDate() != null && task.getScheduledDate().isEqual(today)) {
                UUID skillId = task.getSubtopic().getTopic().getSkill().getId();
                skillScheduleCounts.put(skillId, skillScheduleCounts.getOrDefault(skillId, 0) + 1);
                totalMinutesScheduled += task.getEstimatedMinutes();
                tasksToScheduleToday.add(task);
            }
        }

        // Second pass: allocate remaining slots
        for (Task task : incompleteTasks) {
            // Skip if already scheduled for today (counted in pass 1)
            if (task.getScheduledDate() != null && task.getScheduledDate().isEqual(today)) {
                continue;
            }

            // Skip if scheduled in the future
            if (task.getScheduledDate() != null && task.getScheduledDate().isAfter(today)) {
                continue;
            }

            UUID skillId = task.getSubtopic().getTopic().getSkill().getId();
            SchedulerPreferences skillPref = skillPrefs.getOrDefault(skillId, globalPref);

            // Check preferred days constraint
            String preferredDays = skillPref.getPreferredDays();
            if ("WEEKDAYS".equalsIgnoreCase(preferredDays) && isWeekend) {
                continue;
            }
            if ("WEEKENDS".equalsIgnoreCase(preferredDays) && !isWeekend) {
                continue;
            }

            // Check skill-specific tasks per day limit
            int currentSkillCount = skillScheduleCounts.getOrDefault(skillId, 0);
            if (currentSkillCount >= skillPref.getTasksPerDay()) {
                continue;
            }

            // Check global/skill study minutes limit
            if (totalMinutesScheduled + task.getEstimatedMinutes() > globalPref.getStudyMinutesPerDay()) {
                continue;
            }

            // Task matches constraints. Allocate to today!
            task.setScheduledDate(today);
            if (persist) {
                taskRepository.save(task);
            }

            skillScheduleCounts.put(skillId, currentSkillCount + 1);
            totalMinutesScheduled += task.getEstimatedMinutes();
            tasksToScheduleToday.add(task);
        }

        return tasksToScheduleToday;
    }
}

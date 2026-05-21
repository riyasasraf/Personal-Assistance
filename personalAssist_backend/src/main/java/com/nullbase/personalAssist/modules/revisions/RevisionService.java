package com.nullbase.personalAssist.modules.revisions;

import com.nullbase.personalAssist.entity.User;
import com.nullbase.personalAssist.modules.revisions.dto.RevisionDto;
import com.nullbase.personalAssist.modules.tasks.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class RevisionService {

    @Autowired
    private RevisionRepository revisionRepository;

    @Transactional
    public void createRevisionsForTask(Task task) {
        LocalDate today = LocalDate.now();
        int[] intervals = {1, 3, 7, 14};
        for (int i = 0; i < intervals.length; i++) {
            Revision revision = new Revision(task, today.plusDays(intervals[i]), i + 1);
            revisionRepository.save(revision);
        }
    }

    @Transactional(readOnly = true)
    public List<RevisionDto> getTodayRevisions(User user) {
        List<Revision> revisions = revisionRepository.findPendingByUserAndDate(user, LocalDate.now());
        return revisions.stream()
                .map(RevisionDto::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public RevisionDto completeRevision(UUID id, User user) {
        Revision revision = revisionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Revision not found with ID: " + id));
        
        // Verify ownership
        if (revision.getTask() == null || 
            revision.getTask().getSubtopic() == null || 
            revision.getTask().getSubtopic().getTopic() == null || 
            revision.getTask().getSubtopic().getTopic().getSkill() == null || 
            !revision.getTask().getSubtopic().getTopic().getSkill().getUser().getId().equals(user.getId())) {
            throw new SecurityException("Unauthorized access to revision");
        }

        revision.setCompleted(true);
        Revision saved = revisionRepository.save(revision);
        return new RevisionDto(saved);
    }
}

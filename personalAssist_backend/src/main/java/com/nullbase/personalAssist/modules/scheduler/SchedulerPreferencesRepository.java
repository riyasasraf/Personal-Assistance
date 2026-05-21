package com.nullbase.personalAssist.modules.scheduler;

import com.nullbase.personalAssist.entity.User;
import com.nullbase.personalAssist.modules.skills.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SchedulerPreferencesRepository extends JpaRepository<SchedulerPreferences, UUID> {

    List<SchedulerPreferences> findByUser(User user);

    Optional<SchedulerPreferences> findByUserAndSkill(User user, Skill skill);

    Optional<SchedulerPreferences> findByUserAndSkillIsNull(User user);
}

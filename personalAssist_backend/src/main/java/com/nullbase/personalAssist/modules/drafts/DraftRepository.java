package com.nullbase.personalAssist.modules.drafts;

import com.nullbase.personalAssist.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DraftRepository extends JpaRepository<Draft, UUID> {
    List<Draft> findByUserOrderByUpdatedAtDesc(User user);
    List<Draft> findByUserAndStatusOrderByUpdatedAtDesc(User user, DraftStatus status);
}

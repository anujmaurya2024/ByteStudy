package com.bytepath.repository;

import com.bytepath.model.FocusSession;
import com.bytepath.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FocusSessionRepository extends JpaRepository<FocusSession, Long> {
    List<FocusSession> findByUserOrderByDateDescStartTimeDesc(User user);
    void deleteByUser(User user);
}

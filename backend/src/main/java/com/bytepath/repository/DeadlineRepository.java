package com.bytepath.repository;

import com.bytepath.model.Deadline;
import com.bytepath.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeadlineRepository extends JpaRepository<Deadline, Long> {
    List<Deadline> findByUserOrderByDueDateAsc(User user);
    void deleteByUser(User user);
}

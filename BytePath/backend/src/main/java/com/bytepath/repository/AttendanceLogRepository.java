package com.bytepath.repository;

import com.bytepath.model.AttendanceLog;
import com.bytepath.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttendanceLogRepository extends JpaRepository<AttendanceLog, Long> {
    List<AttendanceLog> findByUserOrderByDateDesc(User user);
    void deleteByUser(User user);
}

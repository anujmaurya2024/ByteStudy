package com.bytepath.repository;

import com.bytepath.model.SemesterRecord;
import com.bytepath.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SemesterRecordRepository extends JpaRepository<SemesterRecord, Long> {
    List<SemesterRecord> findByUserOrderBySemesterNumberAsc(User user);
    Optional<SemesterRecord> findByUserAndSemesterNumber(User user, int semesterNumber);
    void deleteByUser(User user);
}

package com.bytepath.repository;

import com.bytepath.model.SimulatedGrade;
import com.bytepath.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SimulatedGradeRepository extends JpaRepository<SimulatedGrade, Long> {
    List<SimulatedGrade> findByUser(User user);
    Optional<SimulatedGrade> findByUserAndCourseCode(User user, String courseCode);
    void deleteByUser(User user);
}

package com.bytepath.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Records a student's SGPA for a given semester number (1–8).
 * Each student can have at most one record per semester.
 */
@Entity
@Table(name = "semester_records",
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "semester_number"}))
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SemesterRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /** Semester number: 1 through 8. */
    @Column(name = "semester_number", nullable = false)
    private int semesterNumber;

    /**
     * SGPA earned in this semester (0.0 – 10.0).
     * Null means the semester has not been completed / entered yet.
     */
    @Column(name = "sgpa")
    private Double sgpa;
}

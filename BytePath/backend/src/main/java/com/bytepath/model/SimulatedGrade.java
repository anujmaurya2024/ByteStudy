package com.bytepath.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * A simulated grade entry for a course in the current semester.
 * Maps a course code → grade letter (O, A+, A, B+, B, C, P, F).
 */
@Entity
@Table(name = "simulated_grades",
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "course_code"}))
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SimulatedGrade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "course_code", nullable = false)
    private String courseCode;

    /**
     * Grade letter: O (10), A+ (9), A (8), B+ (7),
     * B (6), C (5), P (4), F (0)
     */
    @Column(nullable = false)
    @Builder.Default
    private String grade = "O";
}

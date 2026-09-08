package com.bytepath.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * A single attendance entry for a class session.
 */
@Entity
@Table(name = "attendance_logs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /** Short course code, e.g. "SET/CS/BT/C304". */
    @Column(name = "course_code", nullable = false)
    private String courseCode;

    /** Human-readable course name, e.g. "Data Structures Using C". */
    @Column(name = "course_name")
    private String courseName;

    /** Date of the class session. */
    @Column(nullable = false)
    private LocalDate date;

    /**
     * Attendance status.
     * Using a string enum for clarity.
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private AttendanceStatus status = AttendanceStatus.Present;

    public enum AttendanceStatus { Present, Absent }
}

package com.bytepath.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * A completed Pomodoro / focus study session.
 */
@Entity
@Table(name = "focus_sessions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FocusSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /** Subject or task studied during this session. */
    @Column
    private String subject;

    /** Duration of the session in minutes (typically 25 for Pomodoro). */
    @Column(name = "duration_minutes", nullable = false)
    @Builder.Default
    private int durationMinutes = 25;

    @Column(nullable = false)
    @Builder.Default
    private LocalDate date = LocalDate.now();

    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "end_time")
    private LocalTime endTime;

    /** Optional notes for the session. */
    @Column
    private String notes;
}

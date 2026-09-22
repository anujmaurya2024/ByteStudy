package com.bytepath.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * A single expense entry in the student's budget tracker.
 */
@Entity
@Table(name = "expenses")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /** Amount in INR (or any currency the student uses). */
    @Column(nullable = false)
    private Double amount;

    /** food | transport | books | entertainment | other */
    @Column(nullable = false)
    @Builder.Default
    private String category = "other";

    @Column
    private String description;

    @Column(nullable = false)
    @Builder.Default
    private LocalDate date = LocalDate.now();
}

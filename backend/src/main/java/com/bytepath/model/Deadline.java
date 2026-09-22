package com.bytepath.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * A student deadline / task item (assignment, lab, project, exam).
 */
@Entity
@Table(name = "deadlines")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Deadline {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String title;

    @Column(name = "due_date")
    private LocalDate dueDate;

    /** assignment | lab | project | exam */
    @Column(nullable = false)
    @Builder.Default
    private String category = "assignment";

    /** low | medium | high | critical */
    @Column(nullable = false)
    @Builder.Default
    private String priority = "medium";

    /** pending | in-progress | done */
    @Column(nullable = false)
    @Builder.Default
    private String status = "pending";
}

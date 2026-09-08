package com.bytepath.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/**
 * A PYQ (Previous Year Question paper) or study resource
 * uploaded by an admin.
 */
@Entity
@Table(name = "pyq_resources")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PyqResource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    /** Direct URL to the resource (Google Drive, PDF link, etc.) */
    @Column(nullable = false, length = 1000)
    private String url;

    /** Semester number this resource belongs to (1-8), or 0 for general. */
    @Column(name = "semester_number")
    @Builder.Default
    private int semesterNumber = 0;

    /** Course code this resource is for, e.g. "SET/CS/BT/C304". */
    @Column(name = "course_code")
    private String courseCode;

    /** pdf | link | video | notes */
    @Builder.Default
    private String type = "pdf";

    @Column(name = "uploaded_at")
    @Builder.Default
    private Instant uploadedAt = Instant.now();
}

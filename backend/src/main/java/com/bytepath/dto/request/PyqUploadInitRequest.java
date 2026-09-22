package com.bytepath.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public record PyqUploadInitRequest(
    @NotBlank String title,
    @Min(0) @Max(8) int semesterNumber,
    @NotBlank String courseCode,
    @NotBlank String originalFilename,
    @NotBlank String mimeType,
    @Positive @Max(52428800L) long sizeBytes,
    @jakarta.validation.constraints.Pattern(regexp = "MID_SEM|END_SEM|SYLLABUS|GENERAL", message = "Invalid exam type") String examType,
    @Min(2000) @Max(2100) Integer examYear
) {}

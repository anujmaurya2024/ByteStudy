package com.bytepath.controller;

import com.bytepath.data.SyllabusData;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Public endpoint — no JWT required.
 * Serves the hardcoded B.Tech CS & IT syllabus and career insights.
 */
@RestController
@RequestMapping("/api/syllabus")
@Tag(name = "Syllabus", description = "Public B.Tech CS & IT curriculum data (no auth required)")
public class SyllabusController {

    @Operation(summary = "Get all 8 semesters with full course listings")
    @GetMapping
    public ResponseEntity<List<SyllabusData.Semester>> getAllSemesters() {
        return ResponseEntity.ok(SyllabusData.SYLLABUS);
    }

    @Operation(summary = "Get a single semester by number (1–8)")
    @GetMapping("/{sem}")
    public ResponseEntity<SyllabusData.Semester> getSemester(@PathVariable int sem) {
        return SyllabusData.SYLLABUS.stream()
            .filter(s -> s.semester() == sem)
            .findFirst()
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Get career insights for a phase (1-2, 3-4, 5-6, 7-8)")
    @GetMapping("/career/{phase}")
    public ResponseEntity<SyllabusData.CareerPhaseInfo> getCareerInsights(
            @PathVariable String phase) {
        SyllabusData.CareerPhaseInfo info = SyllabusData.CAREER_INSIGHTS.get(phase);
        return info != null ? ResponseEntity.ok(info) : ResponseEntity.notFound().build();
    }

    @Operation(summary = "Get all career phases")
    @GetMapping("/career")
    public ResponseEntity<Map<String, SyllabusData.CareerPhaseInfo>> getAllCareerPhases() {
        return ResponseEntity.ok(SyllabusData.CAREER_INSIGHTS);
    }

    @Operation(summary = "Get program metadata (total credits, semesters)")
    @GetMapping("/meta")
    public ResponseEntity<Map<String, Object>> getMeta() {
        return ResponseEntity.ok(Map.of(
            "totalCredits", SyllabusData.TOTAL_PROGRAM_CREDITS,
            "totalSemesters", 8,
            "program", "B.Tech CS & IT"
        ));
    }
}

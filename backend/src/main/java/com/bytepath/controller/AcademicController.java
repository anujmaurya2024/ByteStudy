package com.bytepath.controller;

import com.bytepath.model.SemesterRecord;
import com.bytepath.model.User;
import com.bytepath.service.AcademicService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Academic profile REST controller.
 * All endpoints require JWT authentication.
 */
@RestController
@RequestMapping("/api/academic")
@Tag(name = "Academic", description = "Student profile, CGPA, and semester management")
@SecurityRequirement(name = "Bearer Authentication")
public class AcademicController {

    private final AcademicService academicService;

    public AcademicController(AcademicService academicService) {
        this.academicService = academicService;
    }

    /** GET /api/academic/profile — return the current student's profile */
    @Operation(summary = "Get student profile")
    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getProfile(
            @AuthenticationPrincipal User user) {
        Map<String, Object> profile = Map.of(
            "loginId",               user.getLoginId(),
            "name",                  user.getName(),
            "email",                 user.getEmail(),
            "role",                  user.getRole().name(),
            "targetCgpa",            user.getTargetCgpa(),
            "monthlyBudget",         user.getMonthlyBudget(),
            "isOnboarded",           user.isOnboarded(),
            "hasEndSemSubscription", user.isHasEndSemSubscription()
        );
        return ResponseEntity.ok(profile);
    }

    /**
     * PUT /api/academic/profile
     * Body: { "name": "...", "targetCgpa": 8.5, "onboarded": true }
     */
    @Operation(summary = "Update student profile (name, targetCgpa, onboarding status)")
    @PutMapping("/profile")
    public ResponseEntity<Map<String, Object>> updateProfile(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, Object> body) {
        String  name       = (String)  body.get("name");
        Double  targetCgpa = body.get("targetCgpa") != null
                             ? ((Number) body.get("targetCgpa")).doubleValue() : null;
        boolean onboarded  = Boolean.TRUE.equals(body.get("onboarded"));
        User updated = academicService.updateProfile(user, name, targetCgpa, onboarded);

        return ResponseEntity.ok(Map.of(
            "loginId",    updated.getLoginId(),
            "name",       updated.getName(),
            "targetCgpa", updated.getTargetCgpa(),
            "isOnboarded",updated.isOnboarded()
        ));
    }

    /**
     * PUT /api/academic/profile/budget
     * Body: { "monthlyBudget": 3000.0 }
     */
    @Operation(summary = "Update monthly budget")
    @PutMapping("/profile/budget")
    public ResponseEntity<Map<String, Object>> updateBudget(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, Object> body) {
        double budget = ((Number) body.get("monthlyBudget")).doubleValue();
        User updated = academicService.setMonthlyBudget(user, budget);
        return ResponseEntity.ok(Map.of("monthlyBudget", updated.getMonthlyBudget()));
    }

    /** POST /api/academic/profile/endsem — activate end-sem subscription */
    @Operation(summary = "Activate end-semester subscription")
    @PostMapping("/profile/endsem")
    public ResponseEntity<Map<String, Object>> activateEndSem(
            @AuthenticationPrincipal User user) {
        User updated = academicService.activateEndSemSubscription(user);
        return ResponseEntity.ok(Map.of(
            "hasEndSemSubscription", updated.isHasEndSemSubscription()));
    }

    // ── CGPA ──────────────────────────────────────────────────────────────────

    /**
     * GET /api/academic/cgpa
     * Returns current CGPA, predictor result, chart data, simulated SGPA.
     */
    @Operation(summary = "Get full CGPA summary (current, predictor, chart data)")
    @GetMapping("/cgpa")
    public ResponseEntity<Map<String, Object>> getCgpaSummary(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(academicService.getCgpaSummary(user));
    }

    // ── Semesters ─────────────────────────────────────────────────────────────

    /** GET /api/academic/semesters — all 8 semester records */
    @Operation(summary = "Get all 8 semester SGPA records")
    @GetMapping("/semesters")
    public ResponseEntity<List<SemesterRecord>> getSemesters(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(academicService.getAllSemesters(user));
    }

    /**
     * PUT /api/academic/semesters/{sem}
     * Body: { "sgpa": 8.75 }   (or null to clear)
     */
    @Operation(summary = "Set or clear SGPA for a semester (1–8)")
    @PutMapping("/semesters/{sem}")
    public ResponseEntity<SemesterRecord> setSemesterSgpa(
            @AuthenticationPrincipal User user,
            @PathVariable int sem,
            @RequestBody Map<String, Object> body) {
        Double sgpa = body.get("sgpa") != null
                      ? ((Number) body.get("sgpa")).doubleValue() : null;
        return ResponseEntity.ok(academicService.setSemesterSgpa(user, sem, sgpa));
    }
}

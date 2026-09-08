package com.bytepath.controller;

import com.bytepath.model.SemesterRecord;
import com.bytepath.model.SimulatedGrade;
import com.bytepath.model.User;
import com.bytepath.service.AcademicService;
import com.bytepath.service.CgpaCalculatorService;
import com.bytepath.service.StudentDataService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/gradesim")
@Tag(name = "Grade Simulator", description = "Simulate semester grades and predict SGPA")
@SecurityRequirement(name = "Bearer Authentication")
public class GradeSimulatorController {

    private final StudentDataService    dataService;
    private final CgpaCalculatorService cgpaCalc;
    private final AcademicService       academicService;

    public GradeSimulatorController(StudentDataService dataService,
                                    CgpaCalculatorService cgpaCalc,
                                    AcademicService academicService) {
        this.dataService     = dataService;
        this.cgpaCalc        = cgpaCalc;
        this.academicService = academicService;
    }

    @Operation(summary = "Get all simulated grades + computed simulated SGPA")
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAll(@AuthenticationPrincipal User user) {
        List<SimulatedGrade> grades    = dataService.getSimulatedGrades(user);
        List<SemesterRecord> records   = academicService.getAllSemesters(user);
        int currentSem                 = cgpaCalc.currentSemester(records);
        String simulatedSgpa           = cgpaCalc.simulateSgpa(currentSem, grades);
        return ResponseEntity.ok(Map.of(
            "grades",        grades,
            "simulatedSgpa", simulatedSgpa,
            "semester",      currentSem
        ));
    }

    /**
     * PUT /api/gradesim/{courseCode}
     * Body: { "grade": "A+" }
     */
    @Operation(summary = "Set simulated grade for a course code")
    @PutMapping("/{courseCode}")
    public ResponseEntity<SimulatedGrade> setGrade(
            @AuthenticationPrincipal User user,
            @PathVariable String courseCode,
            @RequestBody Map<String, String> body) {
        String grade = body.getOrDefault("grade", "O");
        return ResponseEntity.ok(dataService.setSimulatedGrade(user, courseCode, grade));
    }

    @Operation(summary = "Clear all simulated grades")
    @DeleteMapping
    public ResponseEntity<Void> clearAll(@AuthenticationPrincipal User user) {
        dataService.clearSimulatedGrades(user);
        return ResponseEntity.noContent().build();
    }
}

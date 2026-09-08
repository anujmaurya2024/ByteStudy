package com.bytepath.service;

import com.bytepath.data.SyllabusData;
import com.bytepath.data.SyllabusData.Semester;
import com.bytepath.model.SemesterRecord;
import com.bytepath.model.SimulatedGrade;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Core CGPA / SGPA calculation engine.
 * <p>
 * Directly ports the JavaScript math in {@code useAcademicStore.js}:
 * - currentCgpa   = Σ(sgpa × credits) / earnedCredits
 * - cgpaPredictor = required future SGPA to hit target
 * - simulatedSgpa = weighted SGPA from simulated grades
 * - chartData      = per-semester running CGPA timeline
 */
@Service
public class CgpaCalculatorService {

    // Grade letter → grade point map (matches JS GRADE_POINTS)
    private static final Map<String, Integer> GRADE_POINTS = Map.of(
        "O", 10, "A+", 9, "A", 8, "B+", 7,
        "B", 6, "C", 5, "P", 4, "F", 0
    );

    // ── Public API ────────────────────────────────────────────────────────────

    /**
     * Compute current CGPA from a list of semester records.
     * @return "0.00" if no semesters completed, otherwise formatted to 2 decimal places.
     */
    public String computeCurrentCgpa(List<SemesterRecord> records) {
        List<SemesterRecord> completed = completedRecords(records);
        if (completed.isEmpty()) return "0.00";

        double totalPoints = 0;
        int totalCredits   = 0;
        for (SemesterRecord r : completed) {
            Semester sem = semesterFor(r.getSemesterNumber());
            if (sem == null) continue;
            totalPoints  += r.getSgpa() * sem.totalCredits();
            totalCredits += sem.totalCredits();
        }
        return totalCredits > 0
               ? String.format("%.2f", totalPoints / totalCredits)
               : "0.00";
    }

    /** Total credits earned from completed semesters. */
    public int earnedCredits(List<SemesterRecord> records) {
        return completedRecords(records).stream()
            .mapToInt(r -> {
                Semester s = semesterFor(r.getSemesterNumber());
                return s != null ? s.totalCredits() : 0;
            }).sum();
    }

    /** Remaining credits to complete the program (196 total). */
    public int remainingCredits(List<SemesterRecord> records) {
        return SyllabusData.TOTAL_PROGRAM_CREDITS - earnedCredits(records);
    }

    /**
     * CGPA Predictor — matches the cgpaPredictor IIFE in useAcademicStore.js.
     * <p>
     * Formula: requiredSGPA = (target × 196 − Σ(pastSGPA × pastCredits)) / remainingCredits
     */
    public PredictorResult predict(List<SemesterRecord> records, double targetCgpa) {
        if (targetCgpa < 0 || targetCgpa > 10) {
            return PredictorResult.invalid("Invalid target CGPA — must be between 0 and 10.");
        }

        int remaining = remainingCredits(records);
        String current = computeCurrentCgpa(records);
        double currentVal = Double.parseDouble(current);

        if (remaining <= 0) {
            boolean achieved = currentVal >= targetCgpa;
            return PredictorResult.completed(
                achieved,
                achieved ? "🎉 Target already achieved!" : "Curriculum completed below target."
            );
        }

        double totalQualityPoints = qualityPoints(records);
        double pointsNeeded       = targetCgpa * SyllabusData.TOTAL_PROGRAM_CREDITS - totalQualityPoints;
        double requiredSgpa       = pointsNeeded / remaining;
        boolean achievable        = requiredSgpa <= 10.0;

        String message = achievable
            ? String.format("You need an average SGPA of %.2f in remaining semesters.", requiredSgpa)
            : String.format(
                "Unreachable! You need a %.2f SGPA, which exceeds the 10.0 limit. " +
                "Consider adjusting your goal or taking extra certifications.", requiredSgpa);

        return PredictorResult.achievable(
            String.format("%.2f", Math.max(0, requiredSgpa)),
            achievable,
            message
        );
    }

    /**
     * Simulated SGPA for the current (upcoming) semester using grade letter inputs.
     * Matches simulatedSgpa IIFE in useAcademicStore.js.
     */
    public String simulateSgpa(int currentSemNumber, List<SimulatedGrade> simulatedGrades) {
        Semester semInfo = semesterFor(currentSemNumber);
        if (semInfo == null) return "0.00";

        Map<String, String> gradeMap = new HashMap<>();
        for (SimulatedGrade sg : simulatedGrades) {
            gradeMap.put(sg.getCourseCode(), sg.getGrade());
        }

        double totalPoints  = 0;
        int    totalCredits = 0;

        for (SyllabusData.Course course : semInfo.courses()) {
            String grade = gradeMap.getOrDefault(course.code(), "O");
            int pts = GRADE_POINTS.getOrDefault(grade, 10);
            totalPoints  += (double) pts * course.credits();
            totalCredits += course.credits();
        }

        return totalCredits > 0
               ? String.format("%.2f", totalPoints / totalCredits)
               : "0.00";
    }

    /**
     * Build the chart-data list — one entry per semester, containing
     * sem label, sgpa, running CGPA, target CGPA, and semester credits.
     * Matches chartData computed in useAcademicStore.js.
     */
    public List<Map<String, Object>> buildChartData(
            List<SemesterRecord> records, double targetCgpa) {

        Map<Integer, Double> sgpaMap = new HashMap<>();
        for (SemesterRecord r : records) {
            if (r.getSgpa() != null) sgpaMap.put(r.getSemesterNumber(), r.getSgpa());
        }

        List<Map<String, Object>> chart = new ArrayList<>();

        for (int i = 0; i < SyllabusData.SYLLABUS.size(); i++) {
            Semester sem    = SyllabusData.SYLLABUS.get(i);
            Double sgpaVal  = sgpaMap.get(sem.semester());

            // Compute running CGPA up to and including this semester
            Double runningCgpa = null;
            double pts = 0; int creds = 0;
            for (int j = 0; j <= i; j++) {
                Semester s = SyllabusData.SYLLABUS.get(j);
                Double sg = sgpaMap.get(s.semester());
                if (sg != null) {
                    pts   += sg * s.totalCredits();
                    creds += s.totalCredits();
                }
            }
            if (creds > 0) runningCgpa = Math.round((pts / creds) * 100.0) / 100.0;

            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("name",    "Sem " + sem.semester());
            entry.put("sgpa",    sgpaVal);
            entry.put("cgpa",    runningCgpa);
            entry.put("target",  targetCgpa > 0 ? targetCgpa : null);
            entry.put("credits", sem.totalCredits());
            chart.add(entry);
        }
        return chart;
    }

    /**
     * Current semester = the first semester without an SGPA.
     * Returns 8 if all semesters are complete.
     */
    public int currentSemester(List<SemesterRecord> records) {
        Map<Integer, Double> sgpaMap = new HashMap<>();
        for (SemesterRecord r : records) {
            if (r.getSgpa() != null) sgpaMap.put(r.getSemesterNumber(), r.getSgpa());
        }
        for (int sem = 1; sem <= 8; sem++) {
            if (!sgpaMap.containsKey(sem)) return sem;
        }
        return 8;
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private List<SemesterRecord> completedRecords(List<SemesterRecord> records) {
        return records.stream()
            .filter(r -> r.getSgpa() != null)
            .toList();
    }

    private double qualityPoints(List<SemesterRecord> records) {
        double total = 0;
        for (SemesterRecord r : completedRecords(records)) {
            Semester s = semesterFor(r.getSemesterNumber());
            if (s != null) total += r.getSgpa() * s.totalCredits();
        }
        return total;
    }

    private Semester semesterFor(int number) {
        return SyllabusData.SYLLABUS.stream()
            .filter(s -> s.semester() == number)
            .findFirst()
            .orElse(null);
    }

    // ── Result type ───────────────────────────────────────────────────────────

    public record PredictorResult(
        boolean valid,
        String requiredSgpa,   // null if course already complete
        Boolean achievable,
        String message,
        String reason          // set only when invalid
    ) {
        static PredictorResult invalid(String reason) {
            return new PredictorResult(false, null, null, null, reason);
        }
        static PredictorResult completed(boolean achieved, String message) {
            return new PredictorResult(true, null, achieved, message, null);
        }
        static PredictorResult achievable(String sgpa, boolean achievable, String message) {
            return new PredictorResult(true, sgpa, achievable, message, null);
        }
    }
}

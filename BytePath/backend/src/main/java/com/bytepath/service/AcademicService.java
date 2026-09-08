package com.bytepath.service;

import com.bytepath.model.SemesterRecord;
import com.bytepath.model.SimulatedGrade;
import com.bytepath.model.User;
import com.bytepath.repository.SemesterRecordRepository;
import com.bytepath.repository.SimulatedGradeRepository;
import com.bytepath.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

/**
 * Academic profile service — manages semester SGPAs, user settings,
 * and orchestrates the CGPA computation layer.
 */
@Service
public class AcademicService {

    private final SemesterRecordRepository semesterRepo;
    private final SimulatedGradeRepository simGradeRepo;
    private final UserRepository           userRepo;
    private final CgpaCalculatorService    cgpaCalc;

    public AcademicService(SemesterRecordRepository semesterRepo,
                           SimulatedGradeRepository simGradeRepo,
                           UserRepository userRepo,
                           CgpaCalculatorService cgpaCalc) {
        this.semesterRepo = semesterRepo;
        this.simGradeRepo = simGradeRepo;
        this.userRepo     = userRepo;
        this.cgpaCalc     = cgpaCalc;
    }

    // ── Semester SGPA Management ───────────────────────────────────────────────

    /** Returns all 8 semester records for the user (creates empty ones as needed). */
    public List<SemesterRecord> getAllSemesters(User user) {
        List<SemesterRecord> existing = semesterRepo.findByUserOrderBySemesterNumberAsc(user);
        Map<Integer, SemesterRecord> byNum = new LinkedHashMap<>();
        for (SemesterRecord r : existing) byNum.put(r.getSemesterNumber(), r);

        List<SemesterRecord> full = new ArrayList<>();
        for (int i = 1; i <= 8; i++) {
            full.add(byNum.getOrDefault(i,
                SemesterRecord.builder().user(user).semesterNumber(i).sgpa(null).build()));
        }
        return full;
    }

    /** Set (or clear) the SGPA for a specific semester. */
    @Transactional
    public SemesterRecord setSemesterSgpa(User user, int semNumber, Double sgpa) {
        if (semNumber < 1 || semNumber > 8) {
            throw new IllegalArgumentException("Semester number must be between 1 and 8.");
        }
        if (sgpa != null && (sgpa < 0 || sgpa > 10)) {
            throw new IllegalArgumentException("SGPA must be between 0.0 and 10.0.");
        }

        SemesterRecord record = semesterRepo
            .findByUserAndSemesterNumber(user, semNumber)
            .orElseGet(() -> SemesterRecord.builder()
                .user(user).semesterNumber(semNumber).build());
        record.setSgpa(sgpa);
        return semesterRepo.save(record);
    }

    // ── Full CGPA Summary (for the /cgpa endpoint) ─────────────────────────────

    public Map<String, Object> getCgpaSummary(User user) {
        List<SemesterRecord> records = getAllSemesters(user);
        List<SimulatedGrade> simGrades = simGradeRepo.findByUser(user);

        double targetCgpa = user.getTargetCgpa() != null ? user.getTargetCgpa() : 8.50;

        String currentCgpa  = cgpaCalc.computeCurrentCgpa(records);
        int    earned       = cgpaCalc.earnedCredits(records);
        int    remaining    = cgpaCalc.remainingCredits(records);
        int    currentSem   = cgpaCalc.currentSemester(records);
        String careerPhase  = careerPhaseFor(currentSem);
        String simulatedSgpa = cgpaCalc.simulateSgpa(currentSem, simGrades);
        CgpaCalculatorService.PredictorResult predictor = cgpaCalc.predict(records, targetCgpa);
        List<Map<String, Object>> chartData = cgpaCalc.buildChartData(records, targetCgpa);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("currentCgpa",    currentCgpa);
        result.put("targetCgpa",     targetCgpa);
        result.put("earnedCredits",  earned);
        result.put("remainingCredits", remaining);
        result.put("currentSemester",  currentSem);
        result.put("careerPhase",      careerPhase);
        result.put("simulatedSgpa",    simulatedSgpa);
        result.put("predictor",        predictorToMap(predictor));
        result.put("chartData",        chartData);
        return result;
    }

    // ── Profile / Onboarding ───────────────────────────────────────────────────

    @Transactional
    public User updateProfile(User user, String name, Double targetCgpa, boolean onboarded) {
        if (name != null && !name.isBlank()) {
            user.setName(name.trim().replaceAll("\\s+", " "));
        }
        if (targetCgpa != null) {
            if (targetCgpa < 0 || targetCgpa > 10) {
                throw new IllegalArgumentException("Target CGPA must be between 0 and 10.");
            }
            user.setTargetCgpa(targetCgpa);
        }
        if (onboarded) user.setOnboarded(true);
        return userRepo.save(user);
    }

    @Transactional
    public User setMonthlyBudget(User user, double budget) {
        user.setMonthlyBudget(budget);
        return userRepo.save(user);
    }

    @Transactional
    public User activateEndSemSubscription(User user) {
        user.setHasEndSemSubscription(true);
        return userRepo.save(user);
    }

    // ── Helpers ────────────────────────────────────────────────────────────────

    private String careerPhaseFor(int sem) {
        if (sem <= 2) return "1-2";
        if (sem <= 4) return "3-4";
        if (sem <= 6) return "5-6";
        return "7-8";
    }

    private Map<String, Object> predictorToMap(CgpaCalculatorService.PredictorResult p) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("valid",        p.valid());
        m.put("requiredSgpa", p.requiredSgpa());
        m.put("achievable",   p.achievable());
        m.put("message",      p.message());
        m.put("reason",       p.reason());
        return m;
    }
}

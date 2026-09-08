package com.bytepath.service;

import com.bytepath.data.SyllabusData;
import com.bytepath.model.SemesterRecord;
import com.bytepath.model.SimulatedGrade;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class CgpaCalculatorServiceTest {

    private CgpaCalculatorService cgpaService;

    @BeforeEach
    void setUp() {
        cgpaService = new CgpaCalculatorService();
    }

    @Test
    void testComputeCurrentCgpaEmpty() {
        String cgpa = cgpaService.computeCurrentCgpa(List.of());
        assertEquals("0.00", cgpa);
    }

    @Test
    void testComputeCurrentCgpaWithSemesters() {
        SemesterRecord sem1 = SemesterRecord.builder().semesterNumber(1).sgpa(8.0).build();
        SemesterRecord sem2 = SemesterRecord.builder().semesterNumber(2).sgpa(9.0).build();

        String cgpa = cgpaService.computeCurrentCgpa(List.of(sem1, sem2));
        // Sem 1 is 26 credits (8.0), Sem 2 is 26 credits (9.0) -> Avg = 8.50
        assertEquals("8.50", cgpa);
        assertEquals(52, cgpaService.earnedCredits(List.of(sem1, sem2)));
        assertEquals(144, cgpaService.remainingCredits(List.of(sem1, sem2)));
    }

    @Test
    void testPredictorTargetAchievable() {
        SemesterRecord sem1 = SemesterRecord.builder().semesterNumber(1).sgpa(8.0).build();
        CgpaCalculatorService.PredictorResult result = cgpaService.predict(List.of(sem1), 8.5);

        assertTrue(result.valid());
        assertTrue(result.achievable());
        assertNotNull(result.requiredSgpa());
    }

    @Test
    void testSimulatedSgpa() {
        List<SimulatedGrade> grades = List.of(
                SimulatedGrade.builder().courseCode("SET/SH/BT/C101").grade("O").build(), // 10 * 4 = 40
                SimulatedGrade.builder().courseCode("SET/SH/BT/C103").grade("A+").build() // 9 * 4 = 36
        );

        String simSgpa = cgpaService.simulateSgpa(1, grades);
        assertNotNull(simSgpa);
        assertNotEquals("0.00", simSgpa);
    }

    @Test
    void testBuildChartData() {
        SemesterRecord sem1 = SemesterRecord.builder().semesterNumber(1).sgpa(8.5).build();
        List<Map<String, Object>> chart = cgpaService.buildChartData(List.of(sem1), 9.0);

        assertEquals(8, chart.size());
        assertEquals("Sem 1", chart.get(0).get("name"));
        assertEquals(8.5, chart.get(0).get("sgpa"));
    }
}

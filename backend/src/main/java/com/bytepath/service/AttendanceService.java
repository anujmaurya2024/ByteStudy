package com.bytepath.service;

import com.bytepath.model.AttendanceLog;
import com.bytepath.model.User;
import com.bytepath.repository.AttendanceLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Attendance tracking service — add/remove logs and compute summaries.
 */
@Service
public class AttendanceService {

    private final AttendanceLogRepository repo;

    public AttendanceService(AttendanceLogRepository repo) {
        this.repo = repo;
    }

    public List<AttendanceLog> getLogs(User user) {
        return repo.findByUserOrderByDateDesc(user);
    }

    @Transactional
    public AttendanceLog addLog(User user, AttendanceLog log) {
        log.setUser(user);
        return repo.save(log);
    }

    @Transactional
    public void deleteLog(User user, Long logId) {
        AttendanceLog log = repo.findById(logId)
            .orElseThrow(() -> new NoSuchElementException("Attendance log not found: " + logId));
        if (!log.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Access denied.");
        }
        repo.delete(log);
    }

    /** Overall attendance percentage across all logs. */
    public String overallPercent(User user) {
        List<AttendanceLog> logs = getLogs(user);
        if (logs.isEmpty()) return "N/A";
        long present = logs.stream()
            .filter(l -> l.getStatus() == AttendanceLog.AttendanceStatus.Present)
            .count();
        return String.format("%.1f", (present * 100.0) / logs.size());
    }

    /** Per-subject attendance breakdown. */
    public List<Map<String, Object>> subjectBreakdown(User user) {
        List<AttendanceLog> logs = getLogs(user);
        Map<String, List<AttendanceLog>> byCourse = logs.stream()
            .collect(Collectors.groupingBy(AttendanceLog::getCourseCode));

        List<Map<String, Object>> result = new ArrayList<>();
        for (Map.Entry<String, List<AttendanceLog>> entry : byCourse.entrySet()) {
            List<AttendanceLog> courseLogs = entry.getValue();
            long present = courseLogs.stream()
                .filter(l -> l.getStatus() == AttendanceLog.AttendanceStatus.Present)
                .count();
            double pct = (present * 100.0) / courseLogs.size();

            Map<String, Object> row = new LinkedHashMap<>();
            row.put("code",       entry.getKey());
            row.put("courseName", courseLogs.get(0).getCourseName());
            row.put("present",    (int) present);
            row.put("total",      courseLogs.size());
            row.put("percentage", Math.round(pct * 10) / 10.0);
            result.add(row);
        }
        return result;
    }
}

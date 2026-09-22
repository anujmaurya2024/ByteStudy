package com.bytepath.controller;

import com.bytepath.model.*;
import com.bytepath.repository.AttendanceLogRepository;
import com.bytepath.repository.SemesterRecordRepository;
import com.bytepath.service.AdvisorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/advisor")
@Tag(name = "ByteAI Advisor", description = "AI-powered study advisor chat")
@SecurityRequirement(name = "Bearer Authentication")
public class AdvisorController {

    private final AdvisorService            advisorService;
    private final SemesterRecordRepository  semesterRepo;
    private final AttendanceLogRepository   attendanceRepo;

    public AdvisorController(AdvisorService advisorService,
                             SemesterRecordRepository semesterRepo,
                             AttendanceLogRepository attendanceRepo) {
        this.advisorService  = advisorService;
        this.semesterRepo    = semesterRepo;
        this.attendanceRepo  = attendanceRepo;
    }

    @Operation(summary = "Get full chat history (oldest first)")
    @GetMapping("/chat")
    public ResponseEntity<List<ChatMessage>> getHistory(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(advisorService.getHistory(user));
    }

    /**
     * POST /api/advisor/chat
     * Body: { "text": "What is my attendance status?" }
     * Returns the AI response message.
     */
    @Operation(summary = "Send a message to ByteAI — returns the AI reply")
    @PostMapping("/chat")
    public ResponseEntity<ChatMessage> sendMessage(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, String> body) {
        String text = body.getOrDefault("text", "").trim();
        if (text.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        List<SemesterRecord> semesters  = semesterRepo.findByUserOrderBySemesterNumberAsc(user);
        List<AttendanceLog>  attendance = attendanceRepo.findByUserOrderByDateDesc(user);

        ChatMessage aiReply = advisorService.processMessage(user, text, semesters, attendance);
        return ResponseEntity.ok(aiReply);
    }

    @Operation(summary = "Clear all chat messages and reset with welcome message")
    @DeleteMapping("/chat")
    public ResponseEntity<Void> clearChat(@AuthenticationPrincipal User user) {
        advisorService.clearHistory(user);
        return ResponseEntity.noContent().build();
    }
}

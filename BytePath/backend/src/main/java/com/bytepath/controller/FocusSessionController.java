package com.bytepath.controller;

import com.bytepath.model.FocusSession;
import com.bytepath.model.User;
import com.bytepath.service.StudentDataService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/focus")
@Tag(name = "Focus Sessions", description = "Pomodoro / focus study session tracker")
@SecurityRequirement(name = "Bearer Authentication")
public class FocusSessionController {

    private final StudentDataService dataService;

    public FocusSessionController(StudentDataService dataService) {
        this.dataService = dataService;
    }

    @Operation(summary = "Get all focus sessions (newest first)")
    @GetMapping
    public ResponseEntity<List<FocusSession>> getAll(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(dataService.getFocusSessions(user));
    }

    @Operation(summary = "Log a completed focus session")
    @PostMapping
    public ResponseEntity<FocusSession> create(
            @AuthenticationPrincipal User user,
            @RequestBody FocusSession session) {
        return ResponseEntity.ok(dataService.createFocusSession(user, session));
    }

    @Operation(summary = "Delete a focus session")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        dataService.deleteFocusSession(user, id);
        return ResponseEntity.noContent().build();
    }
}

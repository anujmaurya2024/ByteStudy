package com.bytepath.controller;

import com.bytepath.model.Deadline;
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
@RequestMapping("/api/deadlines")
@Tag(name = "Deadlines", description = "Student deadline / task tracker")
@SecurityRequirement(name = "Bearer Authentication")
public class DeadlineController {

    private final StudentDataService dataService;

    public DeadlineController(StudentDataService dataService) {
        this.dataService = dataService;
    }

    @Operation(summary = "Get all deadlines (sorted by due date)")
    @GetMapping
    public ResponseEntity<List<Deadline>> getAll(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(dataService.getDeadlines(user));
    }

    @Operation(summary = "Create a new deadline")
    @PostMapping
    public ResponseEntity<Deadline> create(
            @AuthenticationPrincipal User user,
            @RequestBody Deadline deadline) {
        return ResponseEntity.ok(dataService.createDeadline(user, deadline));
    }

    @Operation(summary = "Update an existing deadline")
    @PutMapping("/{id}")
    public ResponseEntity<Deadline> update(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @RequestBody Deadline deadline) {
        return ResponseEntity.ok(dataService.updateDeadline(user, id, deadline));
    }

    @Operation(summary = "Delete a deadline")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        dataService.deleteDeadline(user, id);
        return ResponseEntity.noContent().build();
    }
}

package com.bytepath.controller;

import com.bytepath.model.PyqResource;
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
@RequestMapping("/api/pyqs")
@Tag(name = "PYQ Resources", description = "Previous Year Question papers and study resources")
public class PyqController {

    private final StudentDataService dataService;

    public PyqController(StudentDataService dataService) {
        this.dataService = dataService;
    }

    @Operation(summary = "Get all PYQ resources (public)")
    @GetMapping
    public ResponseEntity<List<PyqResource>> getAll() {
        return ResponseEntity.ok(dataService.getAllPyqs());
    }

    @Operation(summary = "Get PYQ resources for a specific semester")
    @GetMapping("/semester/{sem}")
    public ResponseEntity<List<PyqResource>> getBySemester(@PathVariable int sem) {
        return ResponseEntity.ok(dataService.getPyqsBySemester(sem));
    }

    @Operation(summary = "Upload a new PYQ resource (ADMIN only)")
    @SecurityRequirement(name = "Bearer Authentication")
    @PostMapping
    public ResponseEntity<PyqResource> create(
            @AuthenticationPrincipal User user,
            @RequestBody PyqResource pyq) {
        return ResponseEntity.ok(dataService.createPyq(pyq));
    }

    @Operation(summary = "Delete a PYQ resource (ADMIN only)")
    @SecurityRequirement(name = "Bearer Authentication")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        dataService.deletePyq(id);
        return ResponseEntity.noContent().build();
    }
}

package com.bytepath.controller;

import com.bytepath.model.Expense;
import com.bytepath.model.User;
import com.bytepath.service.AcademicService;
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
@RequestMapping("/api/expenses")
@Tag(name = "Expenses", description = "Student pocket expense tracker")
@SecurityRequirement(name = "Bearer Authentication")
public class ExpenseController {

    private final StudentDataService dataService;
    private final AcademicService    academicService;

    public ExpenseController(StudentDataService dataService,
                             AcademicService academicService) {
        this.dataService     = dataService;
        this.academicService = academicService;
    }

    @Operation(summary = "Get all expenses (newest first)")
    @GetMapping
    public ResponseEntity<List<Expense>> getAll(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(dataService.getExpenses(user));
    }

    @Operation(summary = "Create a new expense entry")
    @PostMapping
    public ResponseEntity<Expense> create(
            @AuthenticationPrincipal User user,
            @RequestBody Expense expense) {
        return ResponseEntity.ok(dataService.createExpense(user, expense));
    }

    @Operation(summary = "Update an expense entry")
    @PutMapping("/{id}")
    public ResponseEntity<Expense> update(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @RequestBody Expense expense) {
        return ResponseEntity.ok(dataService.updateExpense(user, id, expense));
    }

    @Operation(summary = "Delete an expense entry")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        dataService.deleteExpense(user, id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Get current monthly budget")
    @GetMapping("/budget")
    public ResponseEntity<Map<String, Object>> getBudget(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(Map.of("monthlyBudget", user.getMonthlyBudget()));
    }

    @Operation(summary = "Update monthly budget")
    @PutMapping("/budget")
    public ResponseEntity<Map<String, Object>> updateBudget(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, Object> body) {
        double budget = ((Number) body.get("monthlyBudget")).doubleValue();
        User updated = academicService.setMonthlyBudget(user, budget);
        return ResponseEntity.ok(Map.of("monthlyBudget", updated.getMonthlyBudget()));
    }
}

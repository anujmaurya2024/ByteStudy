package com.bytepath.controller;

import com.bytepath.model.User;
import com.bytepath.service.OpenRouterClient;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/career")
@Tag(name = "Career AI", description = "AI-generated career roadmaps")
@SecurityRequirement(name = "Bearer Authentication")
public class CareerController {
    private final OpenRouterClient openRouterClient;

    public CareerController(OpenRouterClient openRouterClient) { this.openRouterClient = openRouterClient; }

    @Operation(summary = "Build a personalized career roadmap")
    @PostMapping("/roadmap")
    public ResponseEntity<Map<String, String>> buildRoadmap(@AuthenticationPrincipal User user,
                                                             @RequestBody Map<String, Object> body) {
        String goal = String.valueOf(body.getOrDefault("goal", "full-stack software developer"));
        String phase = String.valueOf(body.getOrDefault("phase", "current undergraduate phase"));
        String semester = String.valueOf(body.getOrDefault("semester", "1"));
        String name = user.getName() == null ? "student" : user.getName();
        String system = "You are BytePath's practical career mentor. Create realistic, India-aware career roadmaps for undergraduate CS students. Use Markdown, prioritize free or low-cost resources, never promise a job, include a 90-day weekly plan, portfolio projects, interview preparation, and measurable checklists. Keep the response under 900 words.";
        String prompt = String.format("Student: %s\nCurrent semester: %s\nCurrent phase: %s\nGoal: %s\nBuild a personalized roadmap with an outcome, skill sequence, 90-day weekly plan, two portfolio projects, interview preparation, and the next 3 actions.", name, semester, phase, goal);
        return openRouterClient.ask(system, prompt, 1400)
            .map(answer -> ResponseEntity.ok(Map.of("roadmap", answer)))
            .orElseGet(() -> ResponseEntity.status(503).body(Map.of("message", "AI roadmap is not configured or temporarily unavailable.")));
    }
}

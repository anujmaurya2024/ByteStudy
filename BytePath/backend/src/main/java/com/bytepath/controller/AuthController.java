package com.bytepath.controller;

import com.bytepath.dto.request.LoginRequest;
import com.bytepath.dto.request.RegisterRequest;
import com.bytepath.dto.response.AuthResponse;
import com.bytepath.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Authentication REST controller.
 * <p>
 * All endpoints are public (no JWT required).
 * On success, returns a JWT + account details.
 */
@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Register, login, and Google OAuth endpoints")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /** POST /api/auth/register — create a new student account */
    @Operation(summary = "Register a new BytePath account")
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest req) {
        return ResponseEntity.ok(authService.register(req));
    }

    /** POST /api/auth/login — sign in with loginId/email + password */
    @Operation(summary = "Login with BytePath ID or email")
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }

    /**
     * POST /api/auth/google
    * Body: { "credential": "<Google ID token>" }
     */
    @Operation(summary = "Login or register via Google OAuth profile")
    @PostMapping("/google")
    public ResponseEntity<AuthResponse> google(@RequestBody Map<String, String> body) {
        String credential = body.getOrDefault("credential", "").trim();
        if (credential.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(authService.loginWithGoogleCredential(credential));
    }
}

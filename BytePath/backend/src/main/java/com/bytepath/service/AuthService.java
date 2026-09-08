package com.bytepath.service;

import com.bytepath.dto.request.LoginRequest;
import com.bytepath.dto.request.RegisterRequest;
import com.bytepath.dto.response.AuthResponse;
import com.bytepath.model.User;
import com.bytepath.repository.UserRepository;
import com.bytepath.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;

import java.security.SecureRandom;
import java.time.Year;
import java.util.Map;

/**
 * Authentication service — handles registration, login, and Google OAuth.
 * <p>
 * Ports the logic from {@code authApi.js} (registerAccount, signIn, signInWithGoogleProfile).
 * Key differences from the JS version:
 * - Passwords are hashed with BCrypt instead of SHA-256
 * - State is persisted in a database instead of localStorage
 */
@Service
public class AuthService {

    private static final String ID_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final SecureRandom RANDOM = new SecureRandom();

    private final UserRepository    userRepo;
    private final PasswordEncoder   passwordEncoder;
    private final JwtTokenProvider  jwtProvider;
    private final String adminEmail;
    private final String adminPassword;
    private final String adminName;
    private final String googleClientId;

    public AuthService(UserRepository userRepo,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider jwtProvider,
                       @Value("${admin.email}") String adminEmail,
                       @Value("${admin.password}") String adminPassword,
                       @Value("${admin.name}") String adminName,
                       @Value("${google.client-id:}") String googleClientId) {
        this.userRepo        = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.jwtProvider     = jwtProvider;
        this.adminEmail      = adminEmail.trim().toLowerCase();
        this.adminPassword   = adminPassword;
        this.adminName       = adminName;
        this.googleClientId  = googleClientId;
    }

    // ── Register ───────────────────────────────────────────────────────────────

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        String email = req.getEmail().trim().toLowerCase();
        String name  = req.getName().trim().replaceAll("\\s+", " ");

        if (userRepo.existsByEmail(email)) {
            throw new IllegalArgumentException(
                "An account already exists for that email. Please sign in instead.");
        }

        User user = User.builder()
            .loginId(generateLoginId())
            .name(name)
            .email(email)
            .passwordHash(passwordEncoder.encode(req.getPassword()))
            .role(User.Role.STUDENT)
            .build();

        userRepo.save(user);
        return buildResponse(user);
    }

    // ── Login ──────────────────────────────────────────────────────────────────

    public AuthResponse login(LoginRequest req) {
        String identity = req.getIdentity().trim();
        String password = req.getPassword();

        // ── Admin shortcut ─────────────────────────────────────────────────────
        boolean isAdminIdentity =
            identity.equalsIgnoreCase(adminEmail);

        if (isAdminIdentity && password.equals(adminPassword)) {
            // Return or create the admin account
            User admin = userRepo.findByEmail(adminEmail)
                .orElseGet(() -> {
                    User a = User.builder()
                        .loginId(adminEmail)
                        .name(adminName)
                        .email(adminEmail)
                        .passwordHash(passwordEncoder.encode(adminPassword))
                        .role(User.Role.ADMIN)
                        .build();
                    return userRepo.save(a);
                });
            return buildResponse(admin);
        }

        // ── Regular student login ──────────────────────────────────────────────
        User user = findByIdentity(identity)
            .orElseThrow(() ->
                new IllegalArgumentException("That ID / email or password is incorrect."));

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new IllegalArgumentException("That ID / email or password is incorrect.");
        }

        return buildResponse(user);
    }

    // ── Google OAuth (profile-based, for local dev / demo) ────────────────────

    @Transactional
    public AuthResponse loginWithGoogle(String name, String email) {
        String cleanEmail = email.trim().toLowerCase();
        String cleanName  = (name != null && !name.isBlank()) ? name.trim() : "Google Scholar";

        User user = userRepo.findByEmail(cleanEmail).orElseGet(() -> {
            User newUser = User.builder()
                .loginId(generateLoginId())
                .name(cleanName)
                .email(cleanEmail)
                .passwordHash(passwordEncoder.encode("google-auth-provider"))
                .role(User.Role.STUDENT)
                .googleAuth(true)
                .build();
            return userRepo.save(newUser);
        });

        return buildResponse(user);
    }

    @Transactional
    public AuthResponse loginWithGoogleCredential(String credential) {
        if (googleClientId.isBlank()) {
            throw new IllegalArgumentException("Google OAuth is not configured on the backend.");
        }

        Map<String, Object> claims = RestClient.create()
            .get()
            .uri(uriBuilder -> uriBuilder
                .scheme("https")
                .host("oauth2.googleapis.com")
                .path("/tokeninfo")
                .queryParam("id_token", credential)
                .build())
            .retrieve()
            .body(Map.class);

        if (claims == null || !googleClientId.equals(String.valueOf(claims.get("aud")))) {
            throw new IllegalArgumentException("Google credential is invalid for this application.");
        }

        return loginWithGoogle(
            String.valueOf(claims.getOrDefault("name", "Google Scholar")),
            String.valueOf(claims.getOrDefault("email", ""))
        );
    }

    // ── UserDetailsService helper ──────────────────────────────────────────────

    public User loadUserByLoginId(String loginId) {
        return userRepo.findByLoginId(loginId)
            .orElseThrow(() ->
                new IllegalArgumentException("User not found: " + loginId));
    }

    // ── Private helpers ────────────────────────────────────────────────────────

    private AuthResponse buildResponse(User user) {
        String token = jwtProvider.generateToken(user.getLoginId());
        return AuthResponse.builder()
            .token(token)
            .loginId(user.getLoginId())
            .name(user.getName())
            .email(user.getEmail())
            .role(user.getRole().name())
            .build();
    }

    /**
     * Generates a unique login ID in the format BTP-YYYY-XXXXXX.
     * Matches the JavaScript createUniqueLoginId() function.
     */
    private String generateLoginId() {
        int year = Year.now().getValue();
        String candidate;
        do {
            candidate = "BTP-" + year + "-" + randomSegment();
        } while (userRepo.existsByLoginId(candidate));
        return candidate;
    }

    private String randomSegment() {
        StringBuilder sb = new StringBuilder(6);
        for (int i = 0; i < 6; i++) {
            sb.append(ID_ALPHABET.charAt(RANDOM.nextInt(ID_ALPHABET.length())));
        }
        return sb.toString();
    }

    private java.util.Optional<User> findByIdentity(String identity) {
        if (identity.contains("@")) {
            return userRepo.findByEmail(identity.toLowerCase());
        } else {
            return userRepo.findByLoginId(identity.toUpperCase()
                .replaceAll("\\s+", ""));
        }
    }
}

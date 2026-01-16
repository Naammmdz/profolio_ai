package com.naammm.authorizationserver.bff.controller;

import com.naammm.authorizationserver.bff.dto.OAuth2TokenExchangeRequest;
import com.naammm.authorizationserver.bff.service.BFFAuthService;
import com.naammm.authorizationserver.user.User;
import com.naammm.authorizationserver.user.UserRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * BFF (Backend for Frontend) Authentication Controller
 * 
 * This controller handles OAuth2 code exchange and sets HttpOnly cookies.
 * Tokens are NEVER returned in response body - only session cookies.
 * 
 * ⭐ SEPARATED from Authorization Server OAuth2 endpoints
 */
@RestController
@RequestMapping("/api/auth")
public class BFFAuthController {

    private static final Logger log = LoggerFactory.getLogger(BFFAuthController.class);

    private final BFFAuthService bffAuthService;
    private final UserRepository userRepository;
    private final JwtDecoder jwtDecoder;

    public BFFAuthController(
            BFFAuthService bffAuthService,
            UserRepository userRepository,
            JwtDecoder jwtDecoder) {
        this.bffAuthService = bffAuthService;
        this.userRepository = userRepository;
        this.jwtDecoder = jwtDecoder;
    }

    /**
     * Exchange OAuth2 authorization code for tokens
     * Sets HttpOnly cookie with session ID
     * Tokens are stored server-side, NOT returned to client
     */
    @PostMapping("/exchange")
    public ResponseEntity<?> exchangeCode(
            @Valid @RequestBody OAuth2TokenExchangeRequest request,
            HttpServletResponse response) {
        log.info("BFF: Code exchange request received");

        try {
            // Exchange code for tokens (stored server-side)
            String sessionId = bffAuthService.exchangeCodeForTokens(request);

            // Get user info from token
            BFFAuthService.TokenPair tokens = bffAuthService.getTokensBySessionId(sessionId);
            Jwt jwt = jwtDecoder.decode(tokens.getAccessToken());
            String email = jwt.getSubject();
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Set HttpOnly cookie with session ID
            Cookie sessionCookie = new Cookie("SESSION_ID", sessionId);
            sessionCookie.setHttpOnly(true);  // ⭐ Prevent XSS
            sessionCookie.setSecure(false);    // Set true in production with HTTPS
            sessionCookie.setPath("/");
            sessionCookie.setMaxAge(3600);    // 1 hour
            // sessionCookie.setAttribute("SameSite", "Lax"); // ⭐ CSRF protection (Java 11+)
            response.addCookie(sessionCookie);

            log.info("BFF: Code exchanged successfully. Session cookie set for user: {}", email);

            // Return success WITHOUT tokens, only user info
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Authentication successful",
                    "data", Map.of(
                            "user", Map.of(
                                    "id", user.getId(),
                                    "email", user.getEmail(),
                                    "roles", user.getRoles().stream()
                                            .map(role -> role.getName())
                                            .toList()
                            )
                    )
                    // ⭐ NO TOKENS IN RESPONSE
            ));
        } catch (Exception e) {
            log.error("BFF: Code exchange failed", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "success", false,
                            "message", "Invalid authorization code: " + e.getMessage()
                    ));
        }
    }

    /**
     * Get current user info
     * Uses session cookie to get tokens server-side
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@CookieValue(value = "SESSION_ID", required = false) String sessionId) {
        if (sessionId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "message", "Not authenticated"));
        }

        try {
            // Get tokens from server-side storage
            BFFAuthService.TokenPair tokens = bffAuthService.getTokensBySessionId(sessionId);
            if (tokens == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Session expired"));
            }

            // Decode JWT to get user info
            Jwt jwt = jwtDecoder.decode(tokens.getAccessToken());
            String email = jwt.getSubject();
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", Map.of(
                            "id", user.getId(),
                            "email", user.getEmail(),
                            "roles", user.getRoles().stream()
                                    .map(role -> role.getName())
                                    .toList()
                    )
            ));
        } catch (Exception e) {
            log.error("BFF: Failed to get user info", e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "message", "Invalid session"));
        }
    }

    /**
     * Logout - clear session
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(
            @CookieValue(value = "SESSION_ID", required = false) String sessionId,
            HttpServletResponse httpResponse) {
        
        if (sessionId != null) {
            // Remove tokens from server-side storage
            // TokenStorage.removeTokens(sessionId); // TODO: Implement
        }

        // Clear cookie
        Cookie cookie = new Cookie("SESSION_ID", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // Set true in production
        cookie.setPath("/");
        cookie.setMaxAge(0);
        httpResponse.addCookie(cookie);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Logged out successfully"
        ));
    }
}

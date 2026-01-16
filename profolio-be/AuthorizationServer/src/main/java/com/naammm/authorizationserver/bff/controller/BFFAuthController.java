package com.naammm.authorizationserver.bff.controller;

import com.naammm.authorizationserver.bff.dto.OAuth2TokenExchangeRequest;
import com.naammm.authorizationserver.bff.service.BFFAuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

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
    private final RestTemplate restTemplate;

    @org.springframework.beans.factory.annotation.Value("${spring.security.oauth2.authorizationserver.provider.issuer:http://localhost:9000}")
    private String authServerUrl;

    @org.springframework.beans.factory.annotation.Value("${app.oauth.client.id:auth-code-client}")
    private String clientId;

    @org.springframework.beans.factory.annotation.Value("${app.oauth.client.secret:secret123}")
    private String clientSecret;

    public BFFAuthController(
            BFFAuthService bffAuthService,
            RestTemplate restTemplate) {
        this.bffAuthService = bffAuthService;
        this.restTemplate = restTemplate;
    }

    /**
     * Exchange OAuth2 authorization code for tokens
     * Sets HttpOnly cookie with session ID
     * Tokens are stored server-side, NOT returned to client
     * Uses standard OAuth2 UserInfo endpoint to get user info
     */
    @PostMapping("/exchange")
    public ResponseEntity<?> exchangeCode(
            @Valid @RequestBody OAuth2TokenExchangeRequest request,
            HttpServletResponse response) {
        log.info("BFF: Code exchange request received");

        try {
            // Exchange code for tokens (stored server-side)
            String sessionId = bffAuthService.exchangeCodeForTokens(request);

            // Get tokens from server-side storage
            BFFAuthService.TokenPair tokens = bffAuthService.getTokensBySessionId(sessionId);
            if (tokens == null) {
                throw new RuntimeException("Failed to retrieve tokens after exchange");
            }

            // Use OAuth2 UserInfo endpoint to get user info (standard endpoint)
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(tokens.getAccessToken());
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            HttpEntity<?> entity = new HttpEntity<>(headers);
            
            ResponseEntity<Map> userInfoResponse = restTemplate.exchange(
                    authServerUrl + "/oauth2/userinfo",
                    HttpMethod.GET,
                    entity,
                    Map.class
            );

            if (!userInfoResponse.getStatusCode().is2xxSuccessful() || userInfoResponse.getBody() == null) {
                throw new RuntimeException("Failed to get user info from UserInfo endpoint");
            }

            // Set HttpOnly cookie with session ID
            Cookie sessionCookie = new Cookie("SESSION_ID", sessionId);
            sessionCookie.setHttpOnly(true);  // ⭐ Prevent XSS
            sessionCookie.setSecure(false);    // Set true in production with HTTPS
            sessionCookie.setPath("/");
            sessionCookie.setMaxAge(3600);    // 1 hour
            // sessionCookie.setAttribute("SameSite", "Lax"); // ⭐ CSRF protection (Java 11+)
            response.addCookie(sessionCookie);

            log.info("BFF: Code exchanged successfully. Session cookie set for user: {}", userInfoResponse.getBody().get("sub"));

            // Return success WITHOUT tokens, only user info from UserInfo endpoint
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Authentication successful",
                    "data", Map.of(
                            "user", userInfoResponse.getBody()
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
     * Internally calls OAuth2 UserInfo endpoint (/oauth2/userinfo)
     * This uses the standard OAuth2 UserInfo endpoint automatically provided by Spring Authorization Server
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

            // Call OAuth2 UserInfo endpoint internally (standard endpoint from Spring Authorization Server)
            // Token is never exposed to frontend (BFF pattern)
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(tokens.getAccessToken());
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            HttpEntity<?> entity = new HttpEntity<>(headers);
            
            ResponseEntity<Map> userInfoResponse = restTemplate.exchange(
                    authServerUrl + "/oauth2/userinfo",
                    HttpMethod.GET,
                    entity,
                    Map.class
            );

            if (!userInfoResponse.getStatusCode().is2xxSuccessful() || userInfoResponse.getBody() == null) {
                throw new RuntimeException("Failed to get user info from UserInfo endpoint");
            }

            // Return user info from standard OAuth2 UserInfo endpoint
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", userInfoResponse.getBody()
            ));
        } catch (Exception e) {
            log.error("BFF: Failed to get user info from UserInfo endpoint", e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "message", "Invalid session"));
        }
    }

    /**
     * Refresh access token using refresh token
     * Uses standard OAuth2 token endpoint with refresh_token grant type
     */
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(
            @CookieValue(value = "SESSION_ID", required = false) String sessionId,
            HttpServletResponse response) {
        
        if (sessionId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "message", "Not authenticated"));
        }

        try {
            // Get tokens from server-side storage
            BFFAuthService.TokenPair tokens = bffAuthService.getTokensBySessionId(sessionId);
            if (tokens == null || tokens.getRefreshToken() == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Session expired or no refresh token"));
            }

            // Call OAuth2 token endpoint with refresh_token grant type (standard endpoint)
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
            body.add("grant_type", "refresh_token");
            body.add("refresh_token", tokens.getRefreshToken());
            body.add("client_id", clientId);
            body.add("client_secret", clientSecret);

            HttpEntity<MultiValueMap<String, String>> httpEntity = new HttpEntity<>(body, headers);

            ResponseEntity<Map> tokenResponse = restTemplate.postForEntity(
                    authServerUrl + "/oauth2/token",
                    httpEntity,
                    Map.class
            );

            if (!tokenResponse.getStatusCode().is2xxSuccessful() || tokenResponse.getBody() == null) {
                throw new RuntimeException("Failed to refresh token");
            }

            Map<String, Object> newTokenResponse = tokenResponse.getBody();
            String newAccessToken = (String) newTokenResponse.get("access_token");
            String newRefreshToken = (String) newTokenResponse.get("refresh_token");

            // Update tokens in server-side storage
            if (newRefreshToken != null) {
                bffAuthService.updateTokens(sessionId, newAccessToken, newRefreshToken);
            } else {
                // If no new refresh token, keep the old one
                bffAuthService.updateTokens(sessionId, newAccessToken, tokens.getRefreshToken());
            }

            log.info("BFF: Token refreshed successfully for session: {}", sessionId);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Token refreshed successfully"
                    // ⭐ NO TOKENS IN RESPONSE - BFF pattern
            ));
        } catch (Exception e) {
            log.error("BFF: Failed to refresh token", e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "message", "Failed to refresh token: " + e.getMessage()));
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
            bffAuthService.removeTokens(sessionId);
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

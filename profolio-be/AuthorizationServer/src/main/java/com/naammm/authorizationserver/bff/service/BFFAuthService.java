package com.naammm.authorizationserver.bff.service;

import com.naammm.authorizationserver.bff.dto.OAuth2TokenExchangeRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.UUID;

/**
 * BFF (Backend for Frontend) Authentication Service
 * 
 * This service handles OAuth2 code exchange and manages tokens server-side.
 * Tokens are NEVER returned to frontend - only session cookies are used.
 */
@Service
public class BFFAuthService {

    private static final Logger log = LoggerFactory.getLogger(BFFAuthService.class);

    private final RestTemplate restTemplate;
    
    @Value("${app.oauth.client.id:auth-code-client}")
    private String clientId;
    
    @Value("${app.oauth.client.secret:secret123}")
    private String clientSecret;
    
    @Value("${spring.security.oauth2.authorizationserver.provider.issuer:http://localhost:9000}")
    private String authServerUrl;

    public BFFAuthService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * Exchange OAuth2 authorization code for tokens
     * Tokens are stored server-side, NOT returned to client
     * 
     * @return Session ID that will be used as cookie value
     */
    public String exchangeCodeForTokens(OAuth2TokenExchangeRequest request) {
        log.info("BFF: Exchanging authorization code for tokens");

        try {
            // Call OAuth2 token endpoint with client secret
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
            body.add("grant_type", "authorization_code");
            body.add("code", request.getCode());
            body.add("redirect_uri", request.getRedirectUri());
            body.add("client_id", clientId);
            body.add("client_secret", clientSecret);

            HttpEntity<MultiValueMap<String, String>> httpEntity = new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(
                    authServerUrl + "/oauth2/token",
                    httpEntity,
                    Map.class
            );

            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                throw new RuntimeException("Failed to exchange code for token");
            }

            Map<String, Object> tokenResponse = response.getBody();
            String accessToken = (String) tokenResponse.get("access_token");
            String refreshToken = (String) tokenResponse.get("refresh_token");

            // Generate session ID
            String sessionId = UUID.randomUUID().toString();

            // TODO: Store tokens in Redis or database with sessionId as key
            // For now, we'll use in-memory storage (should use Redis in production)
            TokenStorage.storeTokens(sessionId, accessToken, refreshToken);

            log.info("BFF: Successfully exchanged code. Session ID: {}", sessionId);
            
            return sessionId;
        } catch (Exception e) {
            log.error("BFF: Failed to exchange code for token", e);
            throw new RuntimeException("Invalid authorization code: " + e.getMessage());
        }
    }

    /**
     * Get tokens by session ID
     * Used when validating requests
     */
    public TokenPair getTokensBySessionId(String sessionId) {
        return TokenStorage.getTokens(sessionId);
    }

    /**
     * In-memory token storage
     * TODO: Replace with Redis in production
     */
    private static class TokenStorage {
        // In production, use Redis:
        // redis.setex("session:" + sessionId, 3600, accessToken)
        // redis.setex("refresh:" + sessionId, 86400, refreshToken)
        
        private static final java.util.Map<String, TokenPair> storage = new java.util.concurrent.ConcurrentHashMap<>();

        static void storeTokens(String sessionId, String accessToken, String refreshToken) {
            storage.put(sessionId, new TokenPair(accessToken, refreshToken));
        }

        static TokenPair getTokens(String sessionId) {
            return storage.get(sessionId);
        }

        static void removeTokens(String sessionId) {
            storage.remove(sessionId);
        }
    }

    public static class TokenPair {
        private final String accessToken;
        private final String refreshToken;

        public TokenPair(String accessToken, String refreshToken) {
            this.accessToken = accessToken;
            this.refreshToken = refreshToken;
        }

        public String getAccessToken() {
            return accessToken;
        }

        public String getRefreshToken() {
            return refreshToken;
        }
    }
}

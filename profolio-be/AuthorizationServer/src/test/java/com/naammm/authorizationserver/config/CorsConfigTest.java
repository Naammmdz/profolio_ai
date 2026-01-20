package com.naammm.authorizationserver.config;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for CorsConfig
 * Tests that CORS is only applied to endpoints called directly (not through Gateway)
 */
class CorsConfigTest {

    private CorsConfig corsConfig;
    private CorsConfigurationSource corsConfigurationSource;

    @BeforeEach
    void setUp() {
        corsConfig = new CorsConfig();
        // Set allowed origins using reflection
        ReflectionTestUtils.setField(corsConfig, "allowedOrigins", 
            new String[]{"http://localhost:3000", "http://localhost:8081"});
        
        corsConfigurationSource = corsConfig.corsConfigurationSource();
    }

    @Test
    void testCorsConfigurationForOAuth2Endpoints() {
        // Test that CORS is configured for /oauth2/** endpoints
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRequestURI("/oauth2/authorize");
        request.setContextPath("");
        request.setServletPath("");
        
        CorsConfiguration config = corsConfigurationSource.getCorsConfiguration(request);
        
        assertNotNull(config, "CORS configuration should exist for /oauth2/** endpoints");
        assertTrue(config.getAllowedOrigins().contains("http://localhost:3000"));
        assertTrue(config.getAllowCredentials());
        assertEquals(3600L, config.getMaxAge());
    }

    @Test
    void testCorsConfigurationForLoginEndpoint() {
        // Test that CORS is configured for /login endpoint
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRequestURI("/login");
        request.setContextPath("");
        request.setServletPath("");
        
        CorsConfiguration config = corsConfigurationSource.getCorsConfiguration(request);
        
        assertNotNull(config, "CORS configuration should exist for /login endpoint");
        assertTrue(config.getAllowedOrigins().contains("http://localhost:3000"));
        assertTrue(config.getAllowCredentials());
    }

    @Test
    void testCorsConfigurationForRegisterEndpoint() {
        // Test that CORS is configured for /register endpoint
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRequestURI("/register");
        request.setContextPath("");
        request.setServletPath("");
        
        CorsConfiguration config = corsConfigurationSource.getCorsConfiguration(request);
        
        assertNotNull(config, "CORS configuration should exist for /register endpoint");
        assertTrue(config.getAllowedOrigins().contains("http://localhost:3000"));
        assertTrue(config.getAllowCredentials());
    }

    @Test
    void testCorsNotConfiguredForApiEndpoints() {
        // Test that CORS is NOT configured for /api/** endpoints (Gateway handles these)
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRequestURI("/api/auth/me");
        request.setContextPath("");
        request.setServletPath("");
        
        CorsConfiguration config = corsConfigurationSource.getCorsConfiguration(request);
        
        assertNull(config, "CORS configuration should NOT exist for /api/** endpoints - Gateway handles CORS");
    }

    @Test
    void testCorsNotConfiguredForApiAuthExchange() {
        // Test that CORS is NOT configured for /api/auth/exchange
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRequestURI("/api/auth/exchange");
        request.setContextPath("");
        request.setServletPath("");
        
        CorsConfiguration config = corsConfigurationSource.getCorsConfiguration(request);
        
        assertNull(config, "CORS configuration should NOT exist for /api/auth/exchange - Gateway handles CORS");
    }

    @Test
    void testCorsConfigurationAllowsCredentials() {
        // Test that allowCredentials is set to true
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRequestURI("/oauth2/authorize");
        request.setContextPath("");
        request.setServletPath("");
        
        CorsConfiguration config = corsConfigurationSource.getCorsConfiguration(request);
        
        assertNotNull(config);
        assertTrue(config.getAllowCredentials(), "CORS should allow credentials for session-based auth");
    }

    @Test
    void testCorsConfigurationExposedHeaders() {
        // Test that required headers are exposed
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRequestURI("/oauth2/authorize");
        request.setContextPath("");
        request.setServletPath("");
        
        CorsConfiguration config = corsConfigurationSource.getCorsConfiguration(request);
        
        assertNotNull(config);
        assertTrue(config.getExposedHeaders().contains("Authorization"));
        assertTrue(config.getExposedHeaders().contains("X-CSRF-TOKEN"));
        assertTrue(config.getExposedHeaders().contains("X-Requested-With"));
    }

    @Test
    void testCorsConfigurationAllowedMethods() {
        // Test that all required HTTP methods are allowed
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRequestURI("/oauth2/authorize");
        request.setContextPath("");
        request.setServletPath("");
        
        CorsConfiguration config = corsConfigurationSource.getCorsConfiguration(request);
        
        assertNotNull(config);
        assertTrue(config.getAllowedMethods().contains("GET"));
        assertTrue(config.getAllowedMethods().contains("POST"));
        assertTrue(config.getAllowedMethods().contains("OPTIONS"));
    }

    @Test
    void testCorsConfigurationMaxAge() {
        // Test that maxAge is set correctly for preflight caching
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRequestURI("/oauth2/authorize");
        request.setContextPath("");
        request.setServletPath("");
        
        CorsConfiguration config = corsConfigurationSource.getCorsConfiguration(request);
        
        assertNotNull(config);
        assertEquals(3600L, config.getMaxAge(), "Preflight requests should be cached for 1 hour");
    }
}

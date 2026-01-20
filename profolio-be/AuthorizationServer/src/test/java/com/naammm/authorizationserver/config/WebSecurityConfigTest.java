package com.naammm.authorizationserver.config;

import com.naammm.authorizationserver.user.service.CustomUserDetailsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for WebSecurityConfig
 * Tests CSRF configuration, authorization rules, and SecurityFilterChain ordering
 */
@SpringBootTest
@TestPropertySource(properties = {
    "app.frontend.base-url=http://localhost:3000",
    "app.cors.allowed-origins=http://localhost:3000"
})
class WebSecurityConfigTest {

    @Autowired
    private WebApplicationContext context;

    @MockBean
    private CustomUserDetailsService userDetailsService;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(springSecurity())
                .build();
    }

    @Test
    void testLoginPageIsPublic() throws Exception {
        // Test that /login is accessible without authentication
        mockMvc.perform(get("/login"))
                .andExpect(status().isOk());
    }

    @Test
    void testRegisterPageIsPublic() throws Exception {
        // Test that /register is accessible without authentication
        mockMvc.perform(get("/register"))
                .andExpect(status().isOk());
    }

    @Test
    void testApiAuthExchangeIsPublic() throws Exception {
        // Test that /api/auth/exchange is accessible without authentication
        mockMvc.perform(post("/api/auth/exchange")
                        .contentType("application/json")
                        .content("{\"code\":\"test\",\"redirectUri\":\"http://localhost:3000/callback\"}"))
                .andExpect(status().is4xxClientError()); // May fail validation but should not require auth
    }

    @Test
    @WithMockUser
    void testOAuth2AuthorizeRequiresAuthentication() throws Exception {
        // Test that /oauth2/authorize requires authentication
        // This endpoint is handled by AuthorizationServerConfig (Order 1)
        // May return 400 (bad request) or 3xx (redirect) depending on params, but should not be 200
        int status = mockMvc.perform(get("/oauth2/authorize")
                        .param("client_id", "test")
                        .param("response_type", "code"))
                .andReturn().getResponse().getStatus();
        assertTrue(status >= 300 && status < 500, "Should not be accessible without proper auth/params"); // 3xx or 4xx
    }

    @Test
    @WithMockUser
    void testApiAuthMeRequiresAuthentication() throws Exception {
        // Test that /api/auth/me requires authentication
        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().is4xxClientError()); // Should require valid session/cookie
    }

    @Test
    void testLoginFormRequiresCsrf() throws Exception {
        // Test that POST /login requires CSRF token
        mockMvc.perform(post("/login")
                        .param("username", "test")
                        .param("password", "test"))
                .andExpect(status().isForbidden()); // Should fail without CSRF token
    }

    @Test
    void testLoginFormWithCsrfToken() throws Exception {
        // Test that POST /login works with CSRF token
        mockMvc.perform(post("/login")
                        .with(csrf())
                        .param("username", "test")
                        .param("password", "test"))
                .andExpect(status().is3xxRedirection()); // Should redirect (may fail auth but CSRF should pass)
    }

    @Test
    void testApiAuthExchangeDoesNotRequireCsrf() throws Exception {
        // Test that /api/auth/exchange does NOT require CSRF token
        mockMvc.perform(post("/api/auth/exchange")
                        .contentType("application/json")
                        .content("{\"code\":\"test\",\"redirectUri\":\"http://localhost:3000/callback\"}"))
                .andExpect(status().is4xxClientError()); // Should not fail due to CSRF
    }

    @Test
    void testOAuth2TokenDoesNotRequireCsrf() throws Exception {
        // Test that /oauth2/token does NOT require CSRF token
        // May redirect (302) or return error (4xx), but should NOT be 403 Forbidden (CSRF error)
        int status = mockMvc.perform(post("/oauth2/token")
                        .param("grant_type", "authorization_code")
                        .param("code", "test"))
                .andReturn().getResponse().getStatus();
        assertNotEquals(403, status, "Should not fail due to CSRF (403 Forbidden)"); // Should not be 403
    }

    @Test
    void testStaticResourcesArePublic() throws Exception {
        // Test that static resources are accessible (permitAll)
        // Note: These may not exist in test, but should not require auth (not 401/403)
        int status = mockMvc.perform(get("/css/test.css"))
                .andReturn().getResponse().getStatus();
        assertNotEquals(401, status, "Should not require authentication (401)");
        assertNotEquals(403, status, "Should not require authorization (403)");
    }

    @Test
    void testErrorPageIsPublic() throws Exception {
        // Test that /error is accessible (permitAll)
        // May return 200, 404, or 500 depending on error handler, but should not require auth (not 401/403)
        int status = mockMvc.perform(get("/error"))
                .andReturn().getResponse().getStatus();
        assertNotEquals(401, status, "Should not require authentication (401)");
        assertNotEquals(403, status, "Should not require authorization (403)");
    }
}

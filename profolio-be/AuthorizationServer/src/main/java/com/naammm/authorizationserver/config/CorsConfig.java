package com.naammm.authorizationserver.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig {

    @Value("${app.cors.allowed-origins}")
    private String[] allowedOrigins;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Set allowed origins (must be explicit, cannot use "*" with allowCredentials)
        configuration.setAllowedOrigins(Arrays.asList(allowedOrigins));
        
        // Allowed HTTP methods
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        
        // Allowed headers (including CSRF token header)
        configuration.setAllowedHeaders(List.of("*"));
        
        // Allow credentials (cookies, authorization headers) - REQUIRED for session-based auth
        configuration.setAllowCredentials(true);
        
        // Expose headers that frontend may need to read
        configuration.setExposedHeaders(List.of(
                "Authorization",
                "X-CSRF-TOKEN",
                "X-Requested-With"
        ));
        
        // Cache preflight requests for 1 hour
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        
        // Apply CORS to endpoints called directly by browser
        source.registerCorsConfiguration("/oauth2/**", configuration);
        source.registerCorsConfiguration("/login", configuration);
        source.registerCorsConfiguration("/register", configuration);
        
        // Apply CORS to BFF endpoints (/api/auth/**)
        // These endpoints are called directly from frontend when Gateway is not available
        source.registerCorsConfiguration("/api/auth/**", configuration);
        
        return source;
    }
}

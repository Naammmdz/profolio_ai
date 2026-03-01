package com.naammm.agw.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

/**
 * Security configuration for Spring Cloud Gateway (WebFlux)
 * Configures OAuth2 Resource Server to validate JWT tokens from Authorization Server
 */
@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        http
            // Disable CSRF for API Gateway (stateless, uses JWT)
            .csrf(csrf -> csrf.disable())
            
            // Configure OAuth2 Resource Server
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> {
                    // JWT configuration is done via application.yml:
                    // spring.security.oauth2.resourceserver.jwt.issuer-uri
                })
            )
            
            .authorizeExchange(exchanges -> exchanges
                // Allow actuator endpoints (health checks, metrics)
                .pathMatchers("/actuator/**").permitAll()
                
                // Allow OAuth2 endpoints to be called directly (not through Gateway)
                .pathMatchers("/api/auth/**").permitAll()
                .pathMatchers("/oauth2/**").permitAll()
                .pathMatchers("/.well-known/**").permitAll()
                
                // Allow Portfolio public endpoints (visitors)
                .pathMatchers("/api/v1/public/**").permitAll()
                
                // All other routes require authentication
                .anyExchange().authenticated()
            );

        return http.build();
    }
}

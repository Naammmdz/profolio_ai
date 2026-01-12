package com.naammm.authorizationserver.token;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.oauth2.server.authorization.OAuth2TokenType;
import org.springframework.security.oauth2.server.authorization.token.JwtEncodingContext;
import org.springframework.security.oauth2.server.authorization.token.OAuth2TokenCustomizer;
import java.util.Set;
import java.util.stream.Collectors;

@Configuration
public class TokenConfig {

    /**
     * Customize JWT access tokens to include user roles as a claim.
     */
    @Bean
    public OAuth2TokenCustomizer<JwtEncodingContext> jwtCustomizer() {
        return context -> {
            // Only customize access tokens (not refresh or ID tokens)
            if (OAuth2TokenType.ACCESS_TOKEN.equals(context.getTokenType())) {
                // Extract authorities and convert to role names
                Set<String> authorities = AuthorityUtils.authorityListToSet(context.getPrincipal().getAuthorities());
                Set<String> roles = authorities.stream()
                        .map(auth -> auth.replaceFirst("^ROLE_", ""))  // remove "ROLE_" prefix
                        .collect(Collectors.toSet());
                // Add roles as a claim in the JWT
                context.getClaims().claim("roles", roles);
            }
        };
    }
}

package com.naammm.authorizationserver.token;

import com.naammm.authorizationserver.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.oauth2.core.oidc.endpoint.OidcParameterNames;
import org.springframework.security.oauth2.server.authorization.OAuth2TokenType;
import org.springframework.security.oauth2.server.authorization.token.JwtEncodingContext;
import org.springframework.security.oauth2.server.authorization.token.OAuth2TokenCustomizer;

import java.util.Set;
import java.util.stream.Collectors;

@Configuration
@RequiredArgsConstructor
public class TokenConfig {

    private final UserRepository userRepository;

    @Bean
    public OAuth2TokenCustomizer<JwtEncodingContext> jwtCustomizer() {
        return context -> {
            String email = context.getPrincipal().getName();

            // Customize ACCESS TOKEN
            if (OAuth2TokenType.ACCESS_TOKEN.equals(context.getTokenType())) {
                userRepository.findByEmail(email).ifPresent(user -> {
                    context.getClaims().subject(user.getId().toString());
                    context.getClaims().claim("email", user.getEmail());
                    context.getClaims().claim("name", user.getName() != null ? user.getName() : email);
                });

                Set<String> authorities = AuthorityUtils.authorityListToSet(context.getPrincipal().getAuthorities());
                Set<String> roles = authorities.stream()
                        .map(auth -> auth.replaceFirst("^ROLE_", ""))
                        .collect(Collectors.toSet());
                context.getClaims().claim("roles", roles);
            }

            // Customize ID TOKEN — injected into auth.user.profile by oidc-client-ts
            if (OidcParameterNames.ID_TOKEN.equals(context.getTokenType().getValue())) {
                userRepository.findByEmail(email).ifPresent(user -> {
                    context.getClaims().subject(user.getId().toString());
                    context.getClaims().claim("email", user.getEmail());
                    context.getClaims().claim("name", user.getName() != null ? user.getName() : email);
                    context.getClaims().claim("email_verified", user.getEmailVerified());
                });

                // Include roles in ID token for frontend to read via profile
                Set<String> authorities = AuthorityUtils.authorityListToSet(context.getPrincipal().getAuthorities());
                Set<String> roles = authorities.stream()
                        .map(auth -> auth.replaceFirst("^ROLE_", ""))
                        .collect(Collectors.toSet());
                context.getClaims().claim("roles", roles);
            }
        };
    }
}

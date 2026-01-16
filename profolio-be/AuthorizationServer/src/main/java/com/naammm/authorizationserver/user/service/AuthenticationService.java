package com.naammm.authorizationserver.user.service;

import com.naammm.authorizationserver.user.User;
import com.naammm.authorizationserver.user.UserRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

    private static final Logger log = LoggerFactory.getLogger(AuthenticationService.class);

    private final UserRepository userRepository;
    private final JwtDecoder jwtDecoder;

    public AuthenticationService(
            UserRepository userRepository,
            JwtDecoder jwtDecoder) {
        this.userRepository = userRepository;
        this.jwtDecoder = jwtDecoder;
    }

    /**
     * Get user from JWT token
     * Used by BFF to get user info from stored tokens
     */
    public User getUserFromToken(String token) {
        try {
            Jwt jwt = jwtDecoder.decode(token);
            String email = jwt.getSubject();
            return userRepository.findByEmail(email)
                    .orElseThrow(() -> new BadCredentialsException("User not found"));
        } catch (Exception e) {
            log.error("Failed to decode token", e);
            throw new BadCredentialsException("Invalid token");
        }
    }
}

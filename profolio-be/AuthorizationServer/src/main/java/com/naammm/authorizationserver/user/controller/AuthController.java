package com.naammm.authorizationserver.user.controller;

import com.naammm.authorizationserver.user.User;
import com.naammm.authorizationserver.user.dto.RegisterRequest;
import com.naammm.authorizationserver.user.service.UserService;

import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * User Registration Controller
 * 
 * Note: Authentication endpoints are handled by:
 * - OAuth2 endpoints: /oauth2/authorize, /oauth2/token (Authorization Server)
 * - BFF endpoints: /api/auth/exchange, /api/auth/me, /api/auth/logout (BFFAuthController)
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);
    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Register new user
     * After registration, user should use OAuth2 flow to login
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        log.info("Registration request received for email: {}", registerRequest.getEmail());
        User user = userService.registerUser(registerRequest);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of(
                        "success", true,
                        "message", "User registered successfully. Please login using OAuth2 flow.",
                        "data", Map.of(
                                "email", user.getEmail(),
                                "id", user.getId()
                        )
                ));
    }
}

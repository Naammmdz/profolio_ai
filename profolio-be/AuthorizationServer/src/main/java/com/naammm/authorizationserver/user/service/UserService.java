package com.naammm.authorizationserver.user.service;

import com.naammm.authorizationserver.exception.ResourceNotFoundException;
import com.naammm.authorizationserver.exception.UserAlreadyExistsException;
import com.naammm.authorizationserver.user.RoleRepository;
import com.naammm.authorizationserver.user.User;
import com.naammm.authorizationserver.user.UserRepository;
import com.naammm.authorizationserver.user.dto.RegisterRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public User registerUser(RegisterRequest registerRequest) {
        log.debug("Attempting to register user with email: {}", registerRequest.getEmail());

        if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            log.warn("Registration failed: Email already in use - {}", registerRequest.getEmail());
            throw new UserAlreadyExistsException("Email already in use: " + registerRequest.getEmail());
        }

        User user = new User();
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setProvider("email"); // Email-based registration
        user.setEmailVerified(false); // Email verification required
        if (registerRequest.getName() != null) {
            user.setName(registerRequest.getName());
        }
        if (registerRequest.getUsername() != null) {
            user.setUsername(registerRequest.getUsername());
        }
        user.getRoles().add(roleRepository.findByName("USER")
                .orElseThrow(() -> new ResourceNotFoundException("Default role USER not found")));
        
        User savedUser = userRepository.save(user);
        log.info("User registered successfully with email: {}", savedUser.getEmail());
        return savedUser;
    }
}

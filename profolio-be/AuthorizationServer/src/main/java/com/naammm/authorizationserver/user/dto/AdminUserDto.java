package com.naammm.authorizationserver.user.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Data
@Builder
public class AdminUserDto {
    private UUID id;
    private String email;
    private String username;
    private String name;
    private String avatarUrl;
    private String provider;
    private Boolean emailVerified;
    private Boolean banned;
    private LocalDateTime bannedAt;
    private String bannedReason;
    private Set<String> roles;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

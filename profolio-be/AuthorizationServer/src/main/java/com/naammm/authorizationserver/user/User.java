package com.naammm.authorizationserver.user;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

/**
 * User entity matching DATABASE_DESIGN.md specification
 * 
 * Core user entity - người dùng đăng ký và sở hữu portfolio.
 */
@Entity
@Table(name = "users", indexes = {
    @Index(name = "idx_users_email", columnList = "email"),
    @Index(name = "idx_users_username", columnList = "username"),
    @Index(name = "idx_users_provider", columnList = "provider, provider_id")
})
@Getter @Setter @NoArgsConstructor
@ToString(exclude = "password")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "UUID")
    private UUID id;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(length = 100, unique = true)
    private String username;

    @Column(length = 255)
    private String name;

    @Column(name = "avatar_url", columnDefinition = "TEXT")
    private String avatarUrl;

    @Column(length = 50)
    private String provider; // 'google', 'github', 'email'

    @Column(name = "provider_id", length = 255)
    private String providerId; // External provider user ID

    @Column(name = "email_verified", nullable = false)
    private Boolean emailVerified = false;

    @Column(name = "password", length = 60)
    private String password; // Nullable for OAuth providers

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}

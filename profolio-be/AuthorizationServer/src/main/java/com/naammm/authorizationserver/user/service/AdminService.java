package com.naammm.authorizationserver.user.service;

import com.naammm.authorizationserver.exception.ResourceNotFoundException;
import com.naammm.authorizationserver.user.Role;
import com.naammm.authorizationserver.user.RoleRepository;
import com.naammm.authorizationserver.user.User;
import com.naammm.authorizationserver.user.UserRepository;
import com.naammm.authorizationserver.user.dto.AdminStatsDto;
import com.naammm.authorizationserver.user.dto.AdminUserDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Transactional(readOnly = true)
    public List<AdminUserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public AdminUserDto getUserById(UUID id) {
        return toDto(userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id)));
    }

    @Transactional(readOnly = true)
    public AdminStatsDto getStats() {
        List<User> allUsers = userRepository.findAll();
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfToday = now.with(LocalTime.MIN);
        LocalDateTime startOfWeek = now.minusDays(7);
        LocalDateTime startOfMonth = now.minusDays(30);

        long totalUsers = allUsers.size();
        long bannedUsers = allUsers.stream().filter(u -> Boolean.TRUE.equals(u.getBanned())).count();
        long adminUsers = allUsers.stream()
                .filter(u -> u.getRoles().stream().anyMatch(r -> "ADMIN".equals(r.getName())))
                .count();
        long newToday = allUsers.stream()
                .filter(u -> u.getCreatedAt() != null && u.getCreatedAt().isAfter(startOfToday))
                .count();
        long newWeek = allUsers.stream()
                .filter(u -> u.getCreatedAt() != null && u.getCreatedAt().isAfter(startOfWeek))
                .count();
        long newMonth = allUsers.stream()
                .filter(u -> u.getCreatedAt() != null && u.getCreatedAt().isAfter(startOfMonth))
                .count();

        return AdminStatsDto.builder()
                .totalUsers(totalUsers)
                .activeUsers(totalUsers - bannedUsers)
                .bannedUsers(bannedUsers)
                .adminUsers(adminUsers)
                .newUsersToday(newToday)
                .newUsersThisWeek(newWeek)
                .newUsersThisMonth(newMonth)
                .build();
    }

    @Transactional
    public AdminUserDto banUser(UUID id, String reason) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));

        if (user.getRoles().stream().anyMatch(r -> "ADMIN".equals(r.getName()))) {
            throw new IllegalArgumentException("Cannot ban an admin user");
        }

        user.setBanned(true);
        user.setBannedAt(LocalDateTime.now());
        user.setBannedReason(reason);
        return toDto(userRepository.save(user));
    }

    @Transactional
    public AdminUserDto unbanUser(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));

        user.setBanned(false);
        user.setBannedAt(null);
        user.setBannedReason(null);
        return toDto(userRepository.save(user));
    }

    @Transactional
    public void deleteUser(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));

        if (user.getRoles().stream().anyMatch(r -> "ADMIN".equals(r.getName()))) {
            throw new IllegalArgumentException("Cannot delete an admin user");
        }

        userRepository.delete(user);
    }

    @Transactional
    public AdminUserDto changeRole(UUID id, String roleName) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + roleName));

        user.getRoles().clear();
        user.getRoles().add(role);
        return toDto(userRepository.save(user));
    }

    private AdminUserDto toDto(User user) {
        return AdminUserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .username(user.getUsername())
                .name(user.getName())
                .avatarUrl(user.getAvatarUrl())
                .provider(user.getProvider())
                .emailVerified(user.getEmailVerified())
                .banned(user.getBanned())
                .bannedAt(user.getBannedAt())
                .bannedReason(user.getBannedReason())
                .roles(user.getRoles().stream().map(Role::getName).collect(Collectors.toSet()))
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}

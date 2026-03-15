package com.naammm.authorizationserver.user.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminStatsDto {
    private long totalUsers;
    private long activeUsers;
    private long bannedUsers;
    private long adminUsers;
    private long newUsersToday;
    private long newUsersThisWeek;
    private long newUsersThisMonth;
}

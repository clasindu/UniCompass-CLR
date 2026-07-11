package com.academiccompass.dto;

public record AuthResponse(
        String accessToken,
        long expiresIn,
        UserSummary user
) {}

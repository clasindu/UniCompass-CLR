package com.academiccompass.dto;

import java.time.LocalDateTime;

public record AssignmentUpdateRequest(
        String title,
        String description,
        LocalDateTime deadline,
        String priority,
        Integer difficulty,
        String status
) {}

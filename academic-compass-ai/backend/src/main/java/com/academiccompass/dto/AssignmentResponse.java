package com.academiccompass.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record AssignmentResponse(
        UUID id,
        String title,
        String description,
        UUID subjectId,
        LocalDateTime deadline,
        String priority,
        int difficulty,
        String status
) {}

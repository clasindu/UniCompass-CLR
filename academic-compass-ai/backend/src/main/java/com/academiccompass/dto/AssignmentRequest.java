package com.academiccompass.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDateTime;
import java.util.UUID;

public record AssignmentRequest(
        @NotBlank String title,
        String description,
        UUID subjectId,
        @NotNull @Future LocalDateTime deadline,
        String priority,
        @Min(1) @Max(5) int difficulty
) {}

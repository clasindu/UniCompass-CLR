package com.academiccompass.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record SubjectRequest(
        @NotNull UUID semesterId,
        @NotBlank String name,
        @Min(1) @Max(12) int creditHours
) {}

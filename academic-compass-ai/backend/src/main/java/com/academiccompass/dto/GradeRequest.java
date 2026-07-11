package com.academiccompass.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

public record GradeRequest(
        String assessmentType,
        @NotNull @DecimalMin("0.0") @DecimalMax("100.0") Double marks
) {}

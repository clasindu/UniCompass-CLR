package com.academiccompass.dto;

import jakarta.validation.constraints.NotBlank;

public record GradeRequest(
        String assessmentType,
        @NotBlank String letterGrade
) {}

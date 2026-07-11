package com.academiccompass.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.UUID;

public record ProfileRequest(
        @NotBlank String fullName,
        UUID universityId,
        UUID degreeId,
        String careerGoal,
        String interests
) {}

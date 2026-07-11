package com.academiccompass.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.UUID;

public record ExamRequest(
        @NotBlank String title,
        UUID subjectId,
        @NotNull @Future LocalDate examDate,
        String examType
) {}

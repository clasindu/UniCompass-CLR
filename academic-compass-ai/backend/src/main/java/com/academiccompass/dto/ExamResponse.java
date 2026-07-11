package com.academiccompass.dto;

import java.time.LocalDate;
import java.util.UUID;

public record ExamResponse(
        UUID id,
        String title,
        UUID subjectId,
        LocalDate examDate,
        String examType,
        String preparationStatus,
        long daysRemaining
) {}

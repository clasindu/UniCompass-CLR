package com.academiccompass.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

public record ExamResponse(
        UUID id,
        String title,
        UUID subjectId,
        LocalDate examDate,
        LocalTime examTime,
        String venue,
        String examType,
        String preparationStatus,
        long daysRemaining
) {}

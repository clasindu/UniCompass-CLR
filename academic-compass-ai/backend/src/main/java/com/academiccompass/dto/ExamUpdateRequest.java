package com.academiccompass.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public record ExamUpdateRequest(
        String title,
        LocalDate examDate,
        LocalTime examTime,
        String venue,
        String examType,
        String preparationStatus
) {}

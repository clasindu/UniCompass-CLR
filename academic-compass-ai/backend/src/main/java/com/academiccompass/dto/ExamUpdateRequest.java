package com.academiccompass.dto;

import java.time.LocalDate;

public record ExamUpdateRequest(
        String title,
        LocalDate examDate,
        String examType,
        String preparationStatus
) {}

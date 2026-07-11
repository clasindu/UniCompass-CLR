package com.academiccompass.dto;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record SemesterResponse(
        UUID id,
        String name,
        LocalDate startDate,
        LocalDate endDate,
        List<SubjectResponse> subjects
) {}

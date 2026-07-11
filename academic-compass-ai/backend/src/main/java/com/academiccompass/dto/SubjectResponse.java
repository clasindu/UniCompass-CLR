package com.academiccompass.dto;

import java.util.List;
import java.util.UUID;

public record SubjectResponse(
        UUID id,
        UUID semesterId,
        String name,
        int creditHours,
        List<GradeResponse> grades
) {}

package com.academiccompass.dto;

import java.util.UUID;

public record GradeResponse(
        UUID id,
        UUID subjectId,
        String assessmentType,
        String letterGrade,
        double gpaPoints
) {}

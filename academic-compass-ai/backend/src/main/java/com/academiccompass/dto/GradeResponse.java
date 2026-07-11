package com.academiccompass.dto;

import java.util.UUID;

public record GradeResponse(
        UUID id,
        UUID subjectId,
        String assessmentType,
        double marks,
        String letterGrade,
        double gpaPoints
) {}

package com.academiccompass.dto;

import java.util.List;
import java.util.UUID;

public record ProfileResponse(
        UUID id,
        String fullName,
        UUID universityId,
        UUID degreeId,
        String careerGoal,
        String interests,
        List<SkillResponse> skills
) {}

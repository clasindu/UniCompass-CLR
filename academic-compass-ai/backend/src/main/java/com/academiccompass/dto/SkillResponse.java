package com.academiccompass.dto;

import java.util.UUID;

public record SkillResponse(UUID id, String skillName, String category, int proficiencyLevel) {}

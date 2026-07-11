package com.academiccompass.service;

import com.academiccompass.dto.ProfileRequest;
import com.academiccompass.dto.ProfileResponse;
import com.academiccompass.dto.SkillRequest;

import java.util.UUID;

public interface ProfileService {
    ProfileResponse getProfile(UUID userId);
    ProfileResponse updateProfile(UUID userId, ProfileRequest request);
    ProfileResponse addSkill(UUID userId, SkillRequest request);
    ProfileResponse removeSkill(UUID userId, UUID studentSkillId);
}

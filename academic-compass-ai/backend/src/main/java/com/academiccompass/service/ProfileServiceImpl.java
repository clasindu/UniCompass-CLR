package com.academiccompass.service;

import com.academiccompass.dto.ProfileRequest;
import com.academiccompass.dto.ProfileResponse;
import com.academiccompass.dto.SkillRequest;
import com.academiccompass.dto.SkillResponse;
import com.academiccompass.entity.Skill;
import com.academiccompass.entity.StudentProfile;
import com.academiccompass.entity.StudentSkill;
import com.academiccompass.exception.ResourceNotFoundException;
import com.academiccompass.repository.SkillRepository;
import com.academiccompass.repository.StudentProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ProfileServiceImpl implements ProfileService {

    private final StudentProfileRepository profileRepository;
    private final SkillRepository skillRepository;

    public ProfileServiceImpl(StudentProfileRepository profileRepository,
                              SkillRepository skillRepository) {
        this.profileRepository = profileRepository;
        this.skillRepository = skillRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public ProfileResponse getProfile(UUID userId) {
        return toResponse(loadProfile(userId));
    }

    @Override
    @Transactional
    public ProfileResponse updateProfile(UUID userId, ProfileRequest request) {
        StudentProfile profile = loadProfile(userId);
        profile.setFullName(request.fullName());
        profile.setUniversityId(request.universityId());
        profile.setDegreeId(request.degreeId());
        profile.setCareerGoal(request.careerGoal());
        profile.setInterests(request.interests());
        return toResponse(profileRepository.save(profile));
    }

    @Override
    @Transactional
    public ProfileResponse addSkill(UUID userId, SkillRequest request) {
        StudentProfile profile = loadProfile(userId);
        Skill skill = skillRepository.findByNameIgnoreCase(request.skillName())
                .orElseGet(() -> {
                    Skill s = new Skill();
                    s.setName(request.skillName());
                    s.setCategory("TECHNICAL");
                    return skillRepository.save(s);
                });

        boolean exists = profile.getSkills().stream()
                .anyMatch(ss -> ss.getSkill().getId().equals(skill.getId()));
        if (exists) {
            profile.getSkills().stream()
                    .filter(ss -> ss.getSkill().getId().equals(skill.getId()))
                    .findFirst()
                    .ifPresent(ss -> ss.setProficiencyLevel(request.proficiencyLevel()));
        } else {
            StudentSkill ss = new StudentSkill();
            ss.setStudentProfile(profile);
            ss.setSkill(skill);
            ss.setProficiencyLevel(request.proficiencyLevel());
            profile.getSkills().add(ss);
        }
        return toResponse(profileRepository.save(profile));
    }

    @Override
    @Transactional
    public ProfileResponse removeSkill(UUID userId, UUID studentSkillId) {
        StudentProfile profile = loadProfile(userId);
        profile.getSkills().removeIf(ss -> ss.getId().equals(studentSkillId));
        return toResponse(profileRepository.save(profile));
    }

    private StudentProfile loadProfile(UUID userId) {
        return profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found for current user"));
    }

    private ProfileResponse toResponse(StudentProfile p) {
        List<SkillResponse> skills = p.getSkills().stream()
                .map(ss -> new SkillResponse(
                        ss.getId(),
                        ss.getSkill().getName(),
                        ss.getSkill().getCategory(),
                        ss.getProficiencyLevel()))
                .toList();
        return new ProfileResponse(
                p.getId(), p.getFullName(), p.getUniversityId(), p.getDegreeId(),
                p.getCareerGoal(), p.getInterests(), skills);
    }
}

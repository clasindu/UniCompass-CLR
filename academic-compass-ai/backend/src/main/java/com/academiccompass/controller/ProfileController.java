package com.academiccompass.controller;

import com.academiccompass.dto.ProfileRequest;
import com.academiccompass.dto.ProfileResponse;
import com.academiccompass.dto.SkillRequest;
import com.academiccompass.security.UserPrincipal;
import com.academiccompass.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/student")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/profile")
    public ResponseEntity<ProfileResponse> getProfile(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(profileService.getProfile(principal.id()));
    }

    @PutMapping("/profile")
    public ResponseEntity<ProfileResponse> updateProfile(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody ProfileRequest request) {
        return ResponseEntity.ok(profileService.updateProfile(principal.id(), request));
    }

    @PostMapping("/skills")
    public ResponseEntity<ProfileResponse> addSkill(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody SkillRequest request) {
        return ResponseEntity.ok(profileService.addSkill(principal.id(), request));
    }

    @DeleteMapping("/skills/{id}")
    public ResponseEntity<ProfileResponse> removeSkill(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id) {
        return ResponseEntity.ok(profileService.removeSkill(principal.id(), id));
    }
}

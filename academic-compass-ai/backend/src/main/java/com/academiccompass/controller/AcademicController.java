package com.academiccompass.controller;

import com.academiccompass.dto.*;
import com.academiccompass.security.UserPrincipal;
import com.academiccompass.service.AcademicService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class AcademicController {

    private final AcademicService academicService;

    public AcademicController(AcademicService academicService) {
        this.academicService = academicService;
    }

    @PostMapping("/semesters")
    public ResponseEntity<SemesterResponse> createSemester(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody SemesterRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(academicService.createSemester(principal.id(), req));
    }

    @GetMapping("/semesters")
    public ResponseEntity<List<SemesterResponse>> listSemesters(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(academicService.listSemesters(principal.id()));
    }

    @PostMapping("/subjects")
    public ResponseEntity<SubjectResponse> createSubject(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody SubjectRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(academicService.createSubject(principal.id(), req));
    }

    @PostMapping("/subjects/{id}/grades")
    public ResponseEntity<GradeResponse> recordGrade(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id,
            @Valid @RequestBody GradeRequest req) {
        return ResponseEntity.ok(academicService.recordGrade(principal.id(), id, req));
    }

    @GetMapping("/gpa")
    public ResponseEntity<GpaResponse> getGpa(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(academicService.getGpa(principal.id()));
    }
}

package com.academiccompass.controller;

import com.academiccompass.dto.ExamRequest;
import com.academiccompass.dto.ExamResponse;
import com.academiccompass.dto.ExamUpdateRequest;
import com.academiccompass.security.UserPrincipal;
import com.academiccompass.service.ExamService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/exams")
public class ExamController {

    private final ExamService examService;

    public ExamController(ExamService examService) {
        this.examService = examService;
    }

    @PostMapping
    public ResponseEntity<ExamResponse> create(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody ExamRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(examService.create(principal.id(), req));
    }

    @GetMapping
    public ResponseEntity<List<ExamResponse>> list(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(examService.list(principal.id()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExamResponse> update(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id,
            @RequestBody ExamUpdateRequest req) {
        return ResponseEntity.ok(examService.update(principal.id(), id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id) {
        examService.delete(principal.id(), id);
        return ResponseEntity.noContent().build();
    }
}

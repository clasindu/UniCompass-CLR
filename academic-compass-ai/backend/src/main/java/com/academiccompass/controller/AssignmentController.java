package com.academiccompass.controller;

import com.academiccompass.dto.AssignmentRequest;
import com.academiccompass.dto.AssignmentResponse;
import com.academiccompass.dto.AssignmentUpdateRequest;
import com.academiccompass.security.UserPrincipal;
import com.academiccompass.service.AssignmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/assignments")
public class AssignmentController {

    private final AssignmentService assignmentService;

    public AssignmentController(AssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    @PostMapping
    public ResponseEntity<AssignmentResponse> create(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody AssignmentRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(assignmentService.create(principal.id(), req));
    }

    @GetMapping
    public ResponseEntity<List<AssignmentResponse>> list(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(assignmentService.list(principal.id()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AssignmentResponse> update(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id,
            @RequestBody AssignmentUpdateRequest req) {
        return ResponseEntity.ok(assignmentService.update(principal.id(), id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id) {
        assignmentService.delete(principal.id(), id);
        return ResponseEntity.noContent().build();
    }
}

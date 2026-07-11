package com.academiccompass.service;

import com.academiccompass.dto.AssignmentRequest;
import com.academiccompass.dto.AssignmentResponse;
import com.academiccompass.dto.AssignmentUpdateRequest;
import com.academiccompass.entity.Assignment;
import com.academiccompass.exception.ResourceNotFoundException;
import com.academiccompass.repository.AssignmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;

    public AssignmentService(AssignmentRepository assignmentRepository) {
        this.assignmentRepository = assignmentRepository;
    }

    @Transactional
    public AssignmentResponse create(UUID userId, AssignmentRequest req) {
        Assignment a = new Assignment();
        a.setUserId(userId);
        a.setTitle(req.title());
        a.setDescription(req.description());
        a.setSubjectId(req.subjectId());
        a.setDeadline(req.deadline());
        a.setPriority(req.priority() == null ? "MEDIUM" : req.priority());
        a.setDifficulty(req.difficulty() == 0 ? 3 : req.difficulty());
        a.setStatus("NOT_STARTED");
        return toResponse(assignmentRepository.save(a));
    }

    @Transactional(readOnly = true)
    public List<AssignmentResponse> list(UUID userId) {
        return assignmentRepository.findByUserIdOrderByDeadlineAsc(userId).stream()
                .map(this::toResponse).toList();
    }

    @Transactional
    public AssignmentResponse update(UUID userId, UUID id, AssignmentUpdateRequest req) {
        Assignment a = loadOwned(userId, id);
        if (req.title() != null) a.setTitle(req.title());
        if (req.description() != null) a.setDescription(req.description());
        if (req.deadline() != null) a.setDeadline(req.deadline());
        if (req.priority() != null) a.setPriority(req.priority());
        if (req.difficulty() != null) a.setDifficulty(req.difficulty());
        if (req.status() != null) a.setStatus(req.status());
        return toResponse(assignmentRepository.save(a));
    }

    @Transactional
    public void delete(UUID userId, UUID id) {
        Assignment a = loadOwned(userId, id);
        assignmentRepository.delete(a);
    }

    private Assignment loadOwned(UUID userId, UUID id) {
        return assignmentRepository.findById(id)
                .filter(a -> a.getUserId().equals(userId))
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found"));
    }

    private AssignmentResponse toResponse(Assignment a) {
        return new AssignmentResponse(
                a.getId(), a.getTitle(), a.getDescription(), a.getSubjectId(),
                a.getDeadline(), a.getPriority(), a.getDifficulty(), a.getStatus());
    }
}

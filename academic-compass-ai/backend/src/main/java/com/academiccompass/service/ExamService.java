package com.academiccompass.service;

import com.academiccompass.dto.ExamRequest;
import com.academiccompass.dto.ExamResponse;
import com.academiccompass.dto.ExamUpdateRequest;
import com.academiccompass.entity.Exam;
import com.academiccompass.exception.ResourceNotFoundException;
import com.academiccompass.repository.ExamRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Service
public class ExamService {

    private final ExamRepository examRepository;

    public ExamService(ExamRepository examRepository) {
        this.examRepository = examRepository;
    }

    @Transactional
    public ExamResponse create(UUID userId, ExamRequest req) {
        Exam e = new Exam();
        e.setUserId(userId);
        e.setTitle(req.title());
        e.setSubjectId(req.subjectId());
        e.setExamDate(req.examDate());
        e.setExamType(req.examType() == null ? "FINAL" : req.examType());
        e.setPreparationStatus("NOT_STARTED");
        return toResponse(examRepository.save(e));
    }

    @Transactional(readOnly = true)
    public List<ExamResponse> list(UUID userId) {
        return examRepository.findByUserIdOrderByExamDateAsc(userId).stream()
                .map(this::toResponse).toList();
    }

    @Transactional
    public ExamResponse update(UUID userId, UUID id, ExamUpdateRequest req) {
        Exam e = loadOwned(userId, id);
        if (req.title() != null) e.setTitle(req.title());
        if (req.examDate() != null) e.setExamDate(req.examDate());
        if (req.examType() != null) e.setExamType(req.examType());
        if (req.preparationStatus() != null) e.setPreparationStatus(req.preparationStatus());
        return toResponse(examRepository.save(e));
    }

    @Transactional
    public void delete(UUID userId, UUID id) {
        Exam e = loadOwned(userId, id);
        examRepository.delete(e);
    }

    private Exam loadOwned(UUID userId, UUID id) {
        return examRepository.findById(id)
                .filter(e -> e.getUserId().equals(userId))
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found"));
    }

    private ExamResponse toResponse(Exam e) {
        long days = ChronoUnit.DAYS.between(LocalDate.now(), e.getExamDate());
        return new ExamResponse(
                e.getId(), e.getTitle(), e.getSubjectId(), e.getExamDate(),
                e.getExamType(), e.getPreparationStatus(), days);
    }
}

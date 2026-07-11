package com.academiccompass.repository;

import com.academiccompass.entity.Exam;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ExamRepository extends JpaRepository<Exam, UUID> {
    List<Exam> findByUserIdOrderByExamDateAsc(UUID userId);
}

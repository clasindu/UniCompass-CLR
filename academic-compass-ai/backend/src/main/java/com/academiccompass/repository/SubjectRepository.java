package com.academiccompass.repository;

import com.academiccompass.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SubjectRepository extends JpaRepository<Subject, UUID> {
    List<Subject> findBySemesterId(UUID semesterId);
    boolean existsBySemesterIdAndNameIgnoreCase(UUID semesterId, String name);
}

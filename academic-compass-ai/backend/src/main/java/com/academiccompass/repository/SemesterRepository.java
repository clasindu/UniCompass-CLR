package com.academiccompass.repository;

import com.academiccompass.entity.Semester;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SemesterRepository extends JpaRepository<Semester, UUID> {
    List<Semester> findByUserIdOrderByStartDateAsc(UUID userId);
}

package com.academiccompass.repository;

import com.academiccompass.entity.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AssignmentRepository extends JpaRepository<Assignment, UUID> {
    List<Assignment> findByUserIdOrderByDeadlineAsc(UUID userId);
}

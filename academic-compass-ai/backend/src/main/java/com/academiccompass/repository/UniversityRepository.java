package com.academiccompass.repository;

import com.academiccompass.entity.University;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface UniversityRepository extends JpaRepository<University, UUID> {
}

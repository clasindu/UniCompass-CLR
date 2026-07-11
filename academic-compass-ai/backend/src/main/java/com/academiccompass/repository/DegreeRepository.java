package com.academiccompass.repository;

import com.academiccompass.entity.Degree;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface DegreeRepository extends JpaRepository<Degree, UUID> {
}

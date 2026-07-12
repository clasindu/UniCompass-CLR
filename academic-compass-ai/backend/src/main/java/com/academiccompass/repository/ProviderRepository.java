package com.academiccompass.repository;

import com.academiccompass.entity.Provider;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ProviderRepository extends JpaRepository<Provider, UUID> {
    List<Provider> findByCategoryOrderBySpecialtyAsc(String category);
}

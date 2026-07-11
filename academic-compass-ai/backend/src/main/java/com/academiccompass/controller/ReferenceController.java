package com.academiccompass.controller;

import com.academiccompass.entity.Degree;
import com.academiccompass.entity.University;
import com.academiccompass.repository.DegreeRepository;
import com.academiccompass.repository.UniversityRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reference")
public class ReferenceController {

    private final UniversityRepository universityRepository;
    private final DegreeRepository degreeRepository;

    public ReferenceController(UniversityRepository universityRepository,
                               DegreeRepository degreeRepository) {
        this.universityRepository = universityRepository;
        this.degreeRepository = degreeRepository;
    }

    @GetMapping("/universities")
    public List<University> universities() {
        return universityRepository.findAll();
    }

    @GetMapping("/degrees")
    public List<Degree> degrees() {
        return degreeRepository.findAll();
    }
}

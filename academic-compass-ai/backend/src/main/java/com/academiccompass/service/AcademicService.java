package com.academiccompass.service;

import com.academiccompass.dto.*;
import com.academiccompass.entity.Grade;
import com.academiccompass.entity.Semester;
import com.academiccompass.entity.Subject;
import com.academiccompass.exception.ResourceNotFoundException;
import com.academiccompass.repository.GradeRepository;
import com.academiccompass.repository.SemesterRepository;
import com.academiccompass.repository.SubjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class AcademicService {

    private final SemesterRepository semesterRepository;
    private final SubjectRepository subjectRepository;
    private final GradeRepository gradeRepository;
    private final GradeScale gradeScale;

    public AcademicService(SemesterRepository semesterRepository,
                           SubjectRepository subjectRepository,
                           GradeRepository gradeRepository,
                           GradeScale gradeScale) {
        this.semesterRepository = semesterRepository;
        this.subjectRepository = subjectRepository;
        this.gradeRepository = gradeRepository;
        this.gradeScale = gradeScale;
    }

    @Transactional
    public SemesterResponse createSemester(UUID userId, SemesterRequest req) {
        Semester s = new Semester();
        s.setUserId(userId);
        s.setName(req.name());
        s.setStartDate(req.startDate());
        s.setEndDate(req.endDate());
        return toSemesterResponse(semesterRepository.save(s));
    }

    @Transactional(readOnly = true)
    public List<SemesterResponse> listSemesters(UUID userId) {
        return semesterRepository.findByUserIdOrderByStartDateAsc(userId).stream()
                .map(this::toSemesterResponse).toList();
    }

    @Transactional
    public SubjectResponse createSubject(UUID userId, SubjectRequest req) {
        Semester sem = semesterRepository.findById(req.semesterId())
                .filter(s -> s.getUserId().equals(userId))
                .orElseThrow(() -> new ResourceNotFoundException("Semester not found"));
        if (subjectRepository.existsBySemesterIdAndNameIgnoreCase(sem.getId(), req.name())) {
            throw new ResourceNotFoundException("A subject with that name already exists in this semester");
        }
        Subject sub = new Subject();
        sub.setSemesterId(sem.getId());
        sub.setName(req.name());
        sub.setCreditHours(req.creditHours());
        return toSubjectResponse(subjectRepository.save(sub));
    }

    @Transactional
    public GradeResponse recordGrade(UUID userId, UUID subjectId, GradeRequest req) {
        Subject subject = loadOwnedSubject(userId, subjectId);

        String letter = req.letterGrade().trim().toUpperCase();
        if (!gradeScale.isValid(letter)) {
            throw new ResourceNotFoundException("Invalid grade '" + letter
                    + "'. Valid grades: " + String.join(", ", GradeScale.VALID_GRADES));
        }
        BigDecimal points = gradeScale.toGpaPoints(letter);

        Grade g = new Grade();
        g.setSubjectId(subject.getId());
        g.setAssessmentType(req.assessmentType() == null ? "FINAL" : req.assessmentType());
        g.setLetterGrade(letter);
        g.setGpaPoints(points);
        Grade saved = gradeRepository.save(g);
        return toGradeResponse(saved);
    }

    @Transactional(readOnly = true)
    public GpaResponse getGpa(UUID userId) {
        List<Semester> semesters = semesterRepository.findByUserIdOrderByStartDateAsc(userId);
        List<GpaResponse.SemesterGpa> perSemester = new ArrayList<>();
        BigDecimal totalPoints = BigDecimal.ZERO;
        int totalCredits = 0;

        for (Semester sem : semesters) {
            List<Subject> subjects = subjectRepository.findBySemesterId(sem.getId());
            BigDecimal semPoints = BigDecimal.ZERO;
            int semCredits = 0;
            for (Subject sub : subjects) {
                List<Grade> grades = gradeRepository.findBySubjectIdOrderByRecordedAtDesc(sub.getId());
                if (grades.isEmpty()) continue;
                BigDecimal latest = grades.get(0).getGpaPoints();
                semPoints = semPoints.add(latest.multiply(BigDecimal.valueOf(sub.getCreditHours())));
                semCredits += sub.getCreditHours();
            }
            double semGpa = semCredits == 0 ? 0.0
                    : semPoints.divide(BigDecimal.valueOf(semCredits), 2, RoundingMode.HALF_UP).doubleValue();
            perSemester.add(new GpaResponse.SemesterGpa(sem.getName(), semGpa));
            totalPoints = totalPoints.add(semPoints);
            totalCredits += semCredits;
        }

        double cumulative = totalCredits == 0 ? 0.0
                : totalPoints.divide(BigDecimal.valueOf(totalCredits), 2, RoundingMode.HALF_UP).doubleValue();
        return new GpaResponse(cumulative, perSemester);
    }

    // ---- helpers ----

    private Subject loadOwnedSubject(UUID userId, UUID subjectId) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));
        Semester sem = semesterRepository.findById(subject.getSemesterId())
                .orElseThrow(() -> new ResourceNotFoundException("Semester not found"));
        if (!sem.getUserId().equals(userId)) {
            throw new ResourceNotFoundException("Subject not found");
        }
        return subject;
    }

    private SemesterResponse toSemesterResponse(Semester s) {
        List<SubjectResponse> subjects = subjectRepository.findBySemesterId(s.getId()).stream()
                .map(this::toSubjectResponse).toList();
        return new SemesterResponse(s.getId(), s.getName(), s.getStartDate(), s.getEndDate(), subjects);
    }

    private SubjectResponse toSubjectResponse(Subject sub) {
        List<GradeResponse> grades = gradeRepository.findBySubjectIdOrderByRecordedAtDesc(sub.getId()).stream()
                .map(this::toGradeResponse).toList();
        return new SubjectResponse(sub.getId(), sub.getSemesterId(), sub.getName(), sub.getCreditHours(), grades);
    }

    private GradeResponse toGradeResponse(Grade g) {
        return new GradeResponse(
                g.getId(), g.getSubjectId(), g.getAssessmentType(),
                g.getLetterGrade(), g.getGpaPoints().doubleValue());
    }
}

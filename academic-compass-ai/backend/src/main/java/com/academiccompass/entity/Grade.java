package com.academiccompass.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "grades")
public class Grade {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "subject_id", nullable = false)
    private UUID subjectId;

    @Column(name = "assessment_type", nullable = false)
    private String assessmentType = "FINAL";

    // Marks are optional now — SLTC records letter grades directly.
    @Column
    private BigDecimal marks;

    @Column(name = "letter_grade", nullable = false)
    private String letterGrade;

    @Column(name = "gpa_points", nullable = false)
    private BigDecimal gpaPoints;

    @CreationTimestamp
    @Column(name = "recorded_at", updatable = false)
    private LocalDateTime recordedAt;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getSubjectId() { return subjectId; }
    public void setSubjectId(UUID subjectId) { this.subjectId = subjectId; }
    public String getAssessmentType() { return assessmentType; }
    public void setAssessmentType(String assessmentType) { this.assessmentType = assessmentType; }
    public BigDecimal getMarks() { return marks; }
    public void setMarks(BigDecimal marks) { this.marks = marks; }
    public String getLetterGrade() { return letterGrade; }
    public void setLetterGrade(String letterGrade) { this.letterGrade = letterGrade; }
    public BigDecimal getGpaPoints() { return gpaPoints; }
    public void setGpaPoints(BigDecimal gpaPoints) { this.gpaPoints = gpaPoints; }
    public LocalDateTime getRecordedAt() { return recordedAt; }
}

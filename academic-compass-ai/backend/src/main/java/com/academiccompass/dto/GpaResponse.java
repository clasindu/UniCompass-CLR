package com.academiccompass.dto;

import java.util.List;

public record GpaResponse(
        double cumulativeGpa,
        List<SemesterGpa> perSemester
) {
    public record SemesterGpa(String semesterName, double gpa) {}
}

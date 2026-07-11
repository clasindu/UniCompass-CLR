package com.academiccompass.service;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;

/**
 * Converts a percentage mark into a letter grade and GPA points.
 * A common 4.0-scale mapping — adjust the thresholds to match your university if needed.
 */
@Component
public class GradeScale {

    public String toLetter(double marks) {
        if (marks >= 85) return "A+";
        if (marks >= 75) return "A";
        if (marks >= 70) return "A-";
        if (marks >= 65) return "B+";
        if (marks >= 60) return "B";
        if (marks >= 55) return "B-";
        if (marks >= 50) return "C+";
        if (marks >= 45) return "C";
        if (marks >= 40) return "C-";
        if (marks >= 35) return "D";
        return "F";
    }

    public BigDecimal toGpaPoints(String letter) {
        return switch (letter) {
            case "A+", "A" -> new BigDecimal("4.00");
            case "A-" -> new BigDecimal("3.70");
            case "B+" -> new BigDecimal("3.30");
            case "B" -> new BigDecimal("3.00");
            case "B-" -> new BigDecimal("2.70");
            case "C+" -> new BigDecimal("2.30");
            case "C" -> new BigDecimal("2.00");
            case "C-" -> new BigDecimal("1.70");
            case "D" -> new BigDecimal("1.00");
            default -> new BigDecimal("0.00");
        };
    }
}

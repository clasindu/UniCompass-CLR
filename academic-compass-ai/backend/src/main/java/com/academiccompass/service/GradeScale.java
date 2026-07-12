package com.academiccompass.service;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

/**
 * SLTC grading scale.
 * Grades: A+ A A- B+ B B- C+ C C- D+ D E   (E is the failing grade; there is no D- or F)
 */
@Component
public class GradeScale {

    // The valid SLTC letter grades, best-to-worst.
    public static final List<String> VALID_GRADES =
            List.of("A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "E");

    /** Convert an SLTC letter grade to its GPA points. */
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
            case "D+" -> new BigDecimal("1.30");
            case "D" -> new BigDecimal("1.00");
            case "E" -> new BigDecimal("0.00");
            default -> throw new IllegalArgumentException("Invalid grade: " + letter);
        };
    }

    public boolean isValid(String letter) {
        return VALID_GRADES.contains(letter);
    }

    /** Optional: convert a percentage mark to an SLTC letter grade (kept for future use). */
    public String toLetter(double marks) {
        if (marks >= 85) return "A+";
        if (marks >= 80) return "A";
        if (marks >= 75) return "A-";
        if (marks >= 70) return "B+";
        if (marks >= 65) return "B";
        if (marks >= 60) return "B-";
        if (marks >= 55) return "C+";
        if (marks >= 50) return "C";
        if (marks >= 45) return "C-";
        if (marks >= 40) return "D+";
        if (marks >= 35) return "D";
        return "E";
    }
}

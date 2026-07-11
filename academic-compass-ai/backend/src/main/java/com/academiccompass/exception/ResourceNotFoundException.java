package com.academiccompass.exception;

import org.springframework.http.HttpStatus;

public class ResourceNotFoundException extends AcademicCompassException {
    public ResourceNotFoundException(String message) {
        super(message, HttpStatus.NOT_FOUND, "NOT_FOUND");
    }
}

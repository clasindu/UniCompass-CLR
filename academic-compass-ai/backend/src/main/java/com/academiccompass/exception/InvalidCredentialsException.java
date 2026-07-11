package com.academiccompass.exception;

import org.springframework.http.HttpStatus;

public class InvalidCredentialsException extends AcademicCompassException {
    public InvalidCredentialsException() {
        super("Invalid email or password", HttpStatus.UNAUTHORIZED, "INVALID_CREDENTIALS");
    }
}

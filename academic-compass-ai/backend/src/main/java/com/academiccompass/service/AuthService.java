package com.academiccompass.service;

import com.academiccompass.dto.AuthResponse;
import com.academiccompass.dto.LoginRequest;
import com.academiccompass.dto.RegisterRequest;

import java.util.UUID;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    AuthResponse refresh(String refreshTokenValue);
    void logout(UUID userId);
}

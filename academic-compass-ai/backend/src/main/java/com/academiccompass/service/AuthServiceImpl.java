package com.academiccompass.service;

import com.academiccompass.dto.*;
import com.academiccompass.entity.AuthProvider;
import com.academiccompass.entity.StudentProfile;
import com.academiccompass.entity.User;
import com.academiccompass.exception.DuplicateEmailException;
import com.academiccompass.exception.InvalidCredentialsException;
import com.academiccompass.repository.StudentProfileRepository;
import com.academiccompass.repository.UserRepository;
import com.academiccompass.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final StudentProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthServiceImpl(UserRepository userRepository,
                           StudentProfileRepository profileRepository,
                           PasswordEncoder passwordEncoder,
                           JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new DuplicateEmailException(request.email());
        }
        User user = new User();
        user.setEmail(request.email());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setAuthProvider(AuthProvider.LOCAL);
        user = userRepository.save(user);

        // create a minimal profile so the student has something to edit on first login
        StudentProfile profile = new StudentProfile();
        profile.setUserId(user.getId());
        profile.setFullName(request.fullName());
        profileRepository.save(profile);

        return buildAuthResponse(user);
    }

    @Override
    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(InvalidCredentialsException::new);
        if (user.getPasswordHash() == null
                || !passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new InvalidCredentialsException();
        }
        return buildAuthResponse(user);
    }

    @Override
    @Transactional
    public AuthResponse refresh(String refreshTokenValue) {
        // Day 1: minimal refresh — look up by hashed token match.
        // (Simple linear approach acceptable at MVP scale; index/optimize later.)
        User user = userRepository.findAll().stream()
                .filter(u -> u.getRefreshTokenHash() != null
                        && passwordEncoder.matches(refreshTokenValue, u.getRefreshTokenHash()))
                .filter(u -> u.getRefreshTokenExpiresAt() != null
                        && u.getRefreshTokenExpiresAt().isAfter(LocalDateTime.now()))
                .findFirst()
                .orElseThrow(InvalidCredentialsException::new);
        return buildAuthResponse(user);
    }

    @Override
    @Transactional
    public void logout(UUID userId) {
        userRepository.findById(userId).ifPresent(u -> {
            u.setRefreshTokenHash(null);
            u.setRefreshTokenExpiresAt(null);
            userRepository.save(u);
        });
    }

    private AuthResponse buildAuthResponse(User user) {
        String accessToken = tokenProvider.generateAccessToken(user.getId(), user.getEmail());
        String refreshValue = tokenProvider.generateRefreshTokenValue();
        user.setRefreshTokenHash(passwordEncoder.encode(refreshValue));
        user.setRefreshTokenExpiresAt(
                LocalDateTime.now().plusSeconds(tokenProvider.getRefreshExpiryMs() / 1000));
        userRepository.save(user);

        // NOTE: refresh token value is returned in body for Day 1 simplicity.
        // Day 6/7 hardening: move to httpOnly Secure SameSite cookie per Phase 2 Section 17.
        return new AuthResponse(
                accessToken,
                tokenProvider.getAccessExpirySeconds(),
                new UserSummary(user.getId(), user.getEmail()));
    }
}

package com.academiccompass.dto;

import java.util.UUID;

public record ProviderResponse(
        UUID id,
        String category,
        String name,
        String specialty,
        String qualification,
        String bio
) {}

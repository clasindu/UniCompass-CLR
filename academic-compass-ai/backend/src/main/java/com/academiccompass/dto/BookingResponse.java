package com.academiccompass.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

public record BookingResponse(
        UUID id,
        UUID providerId,
        String providerName,
        String providerSpecialty,
        String category,
        LocalDate bookingDate,
        LocalTime bookingTime,
        String reason,
        String status
) {}

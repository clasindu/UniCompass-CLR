package com.academiccompass.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

public record BookingRequest(
        @NotNull UUID providerId,
        @NotNull LocalDate bookingDate,
        LocalTime bookingTime,
        String reason
) {}

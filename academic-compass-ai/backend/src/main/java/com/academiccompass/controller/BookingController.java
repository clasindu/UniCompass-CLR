package com.academiccompass.controller;

import com.academiccompass.dto.BookingRequest;
import com.academiccompass.dto.BookingResponse;
import com.academiccompass.dto.ProviderResponse;
import com.academiccompass.security.UserPrincipal;
import com.academiccompass.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping("/providers")
    public ResponseEntity<List<ProviderResponse>> providers(
            @RequestParam(required = false) String category) {
        return ResponseEntity.ok(bookingService.listProviders(category));
    }

    @PostMapping("/bookings")
    public ResponseEntity<BookingResponse> book(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody BookingRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(bookingService.createBooking(principal.id(), req));
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<BookingResponse>> myBookings(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(bookingService.listBookings(principal.id()));
    }

    @DeleteMapping("/bookings/{id}")
    public ResponseEntity<Void> cancel(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id) {
        bookingService.cancelBooking(principal.id(), id);
        return ResponseEntity.noContent().build();
    }
}

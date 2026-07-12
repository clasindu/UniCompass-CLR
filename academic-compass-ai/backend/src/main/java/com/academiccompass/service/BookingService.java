package com.academiccompass.service;

import com.academiccompass.dto.BookingRequest;
import com.academiccompass.dto.BookingResponse;
import com.academiccompass.dto.ProviderResponse;
import com.academiccompass.entity.Booking;
import com.academiccompass.entity.Provider;
import com.academiccompass.exception.ResourceNotFoundException;
import com.academiccompass.repository.BookingRepository;
import com.academiccompass.repository.ProviderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class BookingService {

    private final ProviderRepository providerRepository;
    private final BookingRepository bookingRepository;

    public BookingService(ProviderRepository providerRepository,
                          BookingRepository bookingRepository) {
        this.providerRepository = providerRepository;
        this.bookingRepository = bookingRepository;
    }

    @Transactional(readOnly = true)
    public List<ProviderResponse> listProviders(String category) {
        List<Provider> providers = (category == null || category.isBlank())
                ? providerRepository.findAll()
                : providerRepository.findByCategoryOrderBySpecialtyAsc(category.toUpperCase());
        return providers.stream().map(this::toProviderResponse).toList();
    }

    @Transactional
    public BookingResponse createBooking(UUID userId, BookingRequest req) {
        Provider provider = providerRepository.findById(req.providerId())
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found"));
        Booking b = new Booking();
        b.setUserId(userId);
        b.setProviderId(provider.getId());
        b.setBookingDate(req.bookingDate());
        b.setBookingTime(req.bookingTime());
        b.setReason(req.reason());
        b.setStatus("REQUESTED");
        return toBookingResponse(bookingRepository.save(b), provider);
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> listBookings(UUID userId) {
        List<Booking> bookings = bookingRepository.findByUserIdOrderByBookingDateAsc(userId);
        // preload providers into a map to avoid N+1 lookups
        Map<UUID, Provider> providerMap = new HashMap<>();
        for (Provider p : providerRepository.findAll()) {
            providerMap.put(p.getId(), p);
        }
        return bookings.stream()
                .map(b -> toBookingResponse(b, providerMap.get(b.getProviderId())))
                .toList();
    }

    @Transactional
    public void cancelBooking(UUID userId, UUID bookingId) {
        Booking b = bookingRepository.findById(bookingId)
                .filter(x -> x.getUserId().equals(userId))
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        b.setStatus("CANCELLED");
        bookingRepository.save(b);
    }

    private ProviderResponse toProviderResponse(Provider p) {
        return new ProviderResponse(p.getId(), p.getCategory(), p.getName(),
                p.getSpecialty(), p.getQualification(), p.getBio());
    }

    private BookingResponse toBookingResponse(Booking b, Provider p) {
        String name = p != null ? p.getName() : "Unknown";
        String specialty = p != null ? p.getSpecialty() : "";
        String category = p != null ? p.getCategory() : "";
        return new BookingResponse(
                b.getId(), b.getProviderId(), name, specialty, category,
                b.getBookingDate(), b.getBookingTime(), b.getReason(), b.getStatus());
    }
}

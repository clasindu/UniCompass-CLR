// Day 5 types — Booking system

export type ProviderCategory = "MEDICAL" | "COUNSELING" | "MENTOR" | "FITNESS";

export interface Provider {
  id: string;
  category: ProviderCategory;
  name: string;
  specialty: string;
  qualification: string | null;
  bio: string | null;
}

export interface Booking {
  id: string;
  providerId: string;
  providerName: string;
  providerSpecialty: string;
  category: string;
  bookingDate: string;
  bookingTime: string | null;
  reason: string | null;
  status: "REQUESTED" | "CONFIRMED" | "CANCELLED";
}

import apiClient from "../lib/apiClient";
import type { Provider, Booking } from "../types/booking";

export async function getProviders(category?: string): Promise<Provider[]> {
  const { data } = await apiClient.get<Provider[]>("/providers", {
    params: category ? { category } : {},
  });
  return data;
}

export async function createBooking(payload: {
  providerId: string;
  bookingDate: string;
  bookingTime: string | null;
  reason: string | null;
}): Promise<Booking> {
  const { data } = await apiClient.post<Booking>("/bookings", payload);
  return data;
}

export async function getMyBookings(): Promise<Booking[]> {
  const { data } = await apiClient.get<Booking[]>("/bookings");
  return data;
}

export async function cancelBooking(id: string): Promise<void> {
  await apiClient.delete(`/bookings/${id}`);
}

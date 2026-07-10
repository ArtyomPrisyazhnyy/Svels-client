import { apiRequest } from '@/shared/api/api-client';
import type {
  Booking,
  BookingAvailability,
  CreateBookingPayload,
} from '@/shared/types/booking';

export function fetchBookingAvailability(
  restaurantId: string,
  date: string,
): Promise<BookingAvailability> {
  return apiRequest<BookingAvailability>(
    `/restaurants/${restaurantId}/bookings/availability?date=${encodeURIComponent(date)}`,
  );
}

export function createBooking(
  restaurantId: string,
  token: string,
  payload: CreateBookingPayload,
): Promise<Booking> {
  return apiRequest<Booking>(`/restaurants/${restaurantId}/bookings`, {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  });
}

export function fetchMyBookings(token: string): Promise<Booking[]> {
  return apiRequest<Booking[]>('/users/me/bookings', { token });
}

export function cancelBooking(token: string, bookingId: string): Promise<Booking> {
  return apiRequest<Booking>(`/users/me/bookings/${bookingId}/cancel`, {
    method: 'PATCH',
    token,
  });
}

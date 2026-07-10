import { apiRequest } from '../../../shared/api/api-client';
import type { Booking, BookingStatus } from '../../../shared/types/booking';

export function fetchRestaurantBookings(restaurantId: string, token: string): Promise<Booking[]> {
  return apiRequest<Booking[]>(`/restaurants/${restaurantId}/bookings`, { token });
}

export function updateBookingStatus(
  restaurantId: string,
  token: string,
  bookingId: string,
  status: BookingStatus,
): Promise<Booking> {
  return apiRequest<Booking>(
    `/restaurants/${restaurantId}/bookings/${bookingId}/status`,
    {
      method: 'PATCH',
      token,
      body: JSON.stringify({ status }),
    },
  );
}

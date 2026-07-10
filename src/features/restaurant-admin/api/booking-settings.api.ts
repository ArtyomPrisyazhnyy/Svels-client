import { apiRequest } from '../../../shared/api/api-client';
import type {
  BookingSettings,
  UpdateBookingSettingsPayload,
} from '../../../shared/types/booking-settings';

export function fetchBookingSettings(restaurantId: string): Promise<BookingSettings> {
  return apiRequest<BookingSettings>(`/restaurants/${restaurantId}/booking-settings`);
}

export function updateBookingSettings(
  restaurantId: string,
  token: string,
  payload: UpdateBookingSettingsPayload,
): Promise<BookingSettings> {
  return apiRequest<BookingSettings>(`/restaurants/${restaurantId}/booking-settings`, {
    method: 'PATCH',
    token,
    body: JSON.stringify(payload),
  });
}

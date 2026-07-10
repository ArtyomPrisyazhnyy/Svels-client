import { apiRequest } from '@/shared/api/api-client';
import type {
  AuthResponse,
  GuestLoginPayload,
  GuestRegisterPayload,
} from '@/shared/types/auth';

export function registerGuest(
  restaurantId: string,
  payload: GuestRegisterPayload,
): Promise<AuthResponse> {
  return apiRequest<AuthResponse>(`/restaurants/${restaurantId}/auth/register`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function loginGuest(
  restaurantId: string,
  payload: GuestLoginPayload,
): Promise<AuthResponse> {
  return apiRequest<AuthResponse>(`/restaurants/${restaurantId}/auth/login`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

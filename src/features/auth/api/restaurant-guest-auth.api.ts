import { apiRequest } from '@/shared/api/api-client';
import type {
  AuthResponse,
  GuestOtpRegisterPayload,
  GuestOtpSendPayload,
  GuestOtpSendResponse,
  GuestOtpVerifyPayload,
  GuestOtpVerifyResponse,
} from '@/shared/types/auth';

export function sendGuestOtp(
  restaurantId: string,
  payload: GuestOtpSendPayload,
): Promise<GuestOtpSendResponse> {
  return apiRequest<GuestOtpSendResponse>(`/restaurants/${restaurantId}/auth/otp/send`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function resendGuestOtp(
  restaurantId: string,
  payload: GuestOtpSendPayload,
): Promise<GuestOtpSendResponse> {
  return apiRequest<GuestOtpSendResponse>(`/restaurants/${restaurantId}/auth/otp/resend`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function verifyGuestOtp(
  restaurantId: string,
  payload: GuestOtpVerifyPayload,
): Promise<GuestOtpVerifyResponse> {
  return apiRequest<GuestOtpVerifyResponse>(`/restaurants/${restaurantId}/auth/otp/verify`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function registerGuestWithOtp(
  restaurantId: string,
  payload: GuestOtpRegisterPayload,
): Promise<AuthResponse> {
  return apiRequest<AuthResponse>(`/restaurants/${restaurantId}/auth/otp/register`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

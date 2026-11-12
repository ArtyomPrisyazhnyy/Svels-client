import { apiRequest } from '@/shared/api/api-client';
import type {
  AuthResponse,
  GuestOAuthAppleLoginPayload,
  GuestOAuthGoogleLoginPayload,
  GuestOAuthLoginResponse,
  GuestOAuthProvidersResponse,
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

export function fetchGuestOAuthProviders(
  restaurantId: string,
): Promise<GuestOAuthProvidersResponse> {
  return apiRequest<GuestOAuthProvidersResponse>(
    `/restaurants/${restaurantId}/auth/oauth/providers`,
  );
}

export function loginGuestWithGoogleOAuth(
  restaurantId: string,
  payload: GuestOAuthGoogleLoginPayload,
): Promise<GuestOAuthLoginResponse> {
  return apiRequest<GuestOAuthLoginResponse>(
    `/restaurants/${restaurantId}/auth/oauth/google`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
  );
}

export function loginGuestWithAppleOAuth(
  restaurantId: string,
  payload: GuestOAuthAppleLoginPayload,
): Promise<GuestOAuthLoginResponse> {
  return apiRequest<GuestOAuthLoginResponse>(
    `/restaurants/${restaurantId}/auth/oauth/apple`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
  );
}

export type AuthProvider = 'local' | 'google';

export type UserRole =
  | 'user'
  | 'restaurant_admin'
  | 'restaurant_manager'
  | 'restaurant_hall'
  | 'restaurant_production'
  | 'super_admin';

export type OtpDeliveryChannel = 'telegram' | 'sms' | 'dev';

export interface AuthUser {
  id: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  authProvider: AuthProvider;
  restaurantId?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface GuestOtpSendPayload {
  phone: string;
}

export interface GuestOtpSendResponse {
  maskedPhone: string;
  channel: OtpDeliveryChannel;
  resendAvailableAt: string;
  expiresAt: string;
}

export interface GuestOtpVerifyPayload {
  phone: string;
  code: string;
}

export type GuestOtpVerifyResponse =
  | {
      status: 'authenticated';
      accessToken: string;
      user: AuthUser;
    }
  | {
      status: 'registration_required';
      registrationToken: string;
      maskedPhone: string;
    };

export interface GuestOtpRegisterPayload {
  registrationToken: string;
  firstName: string;
  lastName: string;
}

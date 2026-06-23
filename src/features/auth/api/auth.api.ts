import { apiRequest } from '../../../shared/api/api-client';
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
} from '../../../shared/types/auth';

export function register(payload: RegisterPayload): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function login(payload: LoginPayload): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function loginWithGoogle(idToken: string): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/auth/google', {
    method: 'POST',
    body: JSON.stringify({ idToken }),
  });
}

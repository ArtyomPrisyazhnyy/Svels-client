import { apiRequest } from '@/shared/api/api-client';
import type { AuthResponse } from '@/shared/types/auth';

export interface SetPasswordPayload {
  token: string;
  password: string;
}

export function setPassword(payload: SetPasswordPayload): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/auth/set-password', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

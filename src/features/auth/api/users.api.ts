import { apiRequest } from '../../../shared/api/api-client';
import type { AuthUser } from '../../../shared/types/auth';

export function fetchProfile(token: string): Promise<AuthUser> {
  return apiRequest<AuthUser>('/users/me', { token });
}

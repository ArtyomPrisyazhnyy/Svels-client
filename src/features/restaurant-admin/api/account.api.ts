import { apiRequest } from '../../../shared/api/api-client';
import type { AuthUser } from '../../../shared/types/auth';

export function changePassword(token: string, password: string): Promise<AuthUser> {
  return apiRequest<AuthUser>('/users/me/password', {
    method: 'PATCH',
    token,
    body: JSON.stringify({ password }),
  });
}

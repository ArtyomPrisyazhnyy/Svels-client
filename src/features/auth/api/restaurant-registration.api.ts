import { apiRequest } from '../../../shared/api/api-client';

export interface MyRegistrationStatus {
  id: string;
  name: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason: string | null;
  createdAt: string;
}

export function fetchMyRegistration(token: string): Promise<MyRegistrationStatus | null> {
  return apiRequest<MyRegistrationStatus | null>('/restaurants/registrations/me', { token });
}

import { apiRequest } from '../../../shared/api/api-client';

export interface RegistrationLocation {
  label?: string;
  address: string;
}

export interface PendingRegistration {
  id: string;
  name: string;
  description: string | null;
  address: string;
  unp: string;
  isChain: boolean;
  locations: RegistrationLocation[];
  applicantId: string;
  status: string;
  createdAt: string;
}

export interface ReviewRegistrationPayload {
  requestId: string;
  action: 'approve' | 'reject';
  rejectionReason?: string;
}

export function fetchPendingRegistrations(token: string): Promise<PendingRegistration[]> {
  return apiRequest<PendingRegistration[]>('/restaurants/admin/registrations/pending', {
    token,
  });
}

export function reviewRegistration(
  token: string,
  payload: ReviewRegistrationPayload,
): Promise<unknown> {
  return apiRequest('/restaurants/admin/registrations/review', {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  });
}

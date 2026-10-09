import { apiRequest } from '../../../shared/api/api-client';
import type {
  AdminCreateRestaurantPayload,
  AdminCreateRestaurantResponse,
  AdminOwnerInviteResponse,
  AdminRestaurantListItem,
} from '@/shared/types/admin-restaurants';

export interface RegistrationLocation {
  label?: string;
  city?: string;
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

export function fetchAllRestaurants(
  token: string,
  search?: string,
): Promise<AdminRestaurantListItem[]> {
  const query = search ? `?search=${encodeURIComponent(search)}` : '';
  return apiRequest<AdminRestaurantListItem[]>(`/restaurants/admin/all${query}`, {
    token,
  });
}

export function createRestaurantByAdmin(
  token: string,
  payload: AdminCreateRestaurantPayload,
): Promise<AdminCreateRestaurantResponse> {
  return apiRequest<AdminCreateRestaurantResponse>('/restaurants/admin/create', {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  });
}

export function createOwnerInvite(
  token: string,
  restaurantId: string,
): Promise<AdminOwnerInviteResponse> {
  return apiRequest<AdminOwnerInviteResponse>(
    `/restaurants/admin/${restaurantId}/owner-invite`,
    {
      method: 'POST',
      token,
    },
  );
}

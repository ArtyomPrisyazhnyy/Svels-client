import { apiRequest } from '@/shared/api/api-client';
import type {
  CreateGuestAddressPayload,
  GuestAddress,
  UpdateGuestAddressPayload,
} from '@/shared/types/guest-address';

export function fetchGuestAddresses(
  restaurantId: string,
  token: string,
): Promise<GuestAddress[]> {
  return apiRequest<GuestAddress[]>(`/restaurants/${restaurantId}/me/addresses`, {
    method: 'GET',
    token,
  });
}

export function createGuestAddress(
  restaurantId: string,
  token: string,
  payload: CreateGuestAddressPayload,
): Promise<GuestAddress> {
  return apiRequest<GuestAddress>(`/restaurants/${restaurantId}/me/addresses`, {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  });
}

export function updateGuestAddress(
  restaurantId: string,
  token: string,
  addressId: string,
  payload: UpdateGuestAddressPayload,
): Promise<GuestAddress> {
  return apiRequest<GuestAddress>(
    `/restaurants/${restaurantId}/me/addresses/${addressId}`,
    {
      method: 'PATCH',
      token,
      body: JSON.stringify(payload),
    },
  );
}

export function deleteGuestAddress(
  restaurantId: string,
  token: string,
  addressId: string,
): Promise<void> {
  return apiRequest<void>(`/restaurants/${restaurantId}/me/addresses/${addressId}`, {
    method: 'DELETE',
    token,
  });
}

export function setDefaultGuestAddress(
  restaurantId: string,
  token: string,
  addressId: string,
): Promise<GuestAddress> {
  return apiRequest<GuestAddress>(
    `/restaurants/${restaurantId}/me/addresses/${addressId}/default`,
    {
      method: 'POST',
      token,
    },
  );
}

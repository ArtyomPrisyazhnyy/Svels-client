import type { AuthResponse } from './auth';

/** Ответ `RestaurantsService.createByAdmin` / публичная карточка заведения. */
export interface RestaurantResponse {
  id: string;
  name: string;
  description: string | null;
  address: string;
  status: string;
  customDomain?: string | null;
  logoUrl?: string | null;
  logoWebpUrl?: string | null;
  createdAt: string;
}

export interface AdminRestaurantListItem {
  id: string;
  name: string;
  status: string;
  customDomain: string | null;
  ownerEmail: string | null;
  createdAt: string;
}

export interface AdminCreateRestaurantOwnerPayload {
  email: string;
  firstName: string;
  lastName?: string;
  phone?: string;
}

export interface AdminCreateRestaurantPayload {
  name: string;
  address: string;
  unp?: string;
  customDomain?: string;
  owner: AdminCreateRestaurantOwnerPayload;
}

export interface AdminCreateRestaurantResponse {
  restaurant: RestaurantResponse;
  owner: { id: string; email: string };
  setPasswordUrl: string;
  expiresAt: string;
}

export interface AdminOwnerInviteResponse {
  setPasswordUrl: string;
  expiresAt: string;
}

export type SetPasswordResponse = AuthResponse;

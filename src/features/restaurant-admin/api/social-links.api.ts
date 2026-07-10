import { apiRequest } from '../../../shared/api/api-client';
import type {
  CreateSocialLinkPayload,
  SocialLink,
  UpdateSocialLinkPayload,
} from '../../../shared/types/social-link';

export function fetchSocialLinks(restaurantId: string): Promise<SocialLink[]> {
  return apiRequest<SocialLink[]>(`/restaurants/${restaurantId}/social-links`);
}

export function createSocialLink(
  restaurantId: string,
  token: string,
  payload: CreateSocialLinkPayload,
): Promise<SocialLink> {
  return apiRequest<SocialLink>(`/restaurants/${restaurantId}/social-links`, {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  });
}

export function updateSocialLink(
  restaurantId: string,
  token: string,
  linkId: string,
  payload: UpdateSocialLinkPayload,
): Promise<SocialLink> {
  return apiRequest<SocialLink>(`/restaurants/${restaurantId}/social-links/${linkId}`, {
    method: 'PATCH',
    token,
    body: JSON.stringify(payload),
  });
}

export function deleteSocialLink(
  restaurantId: string,
  token: string,
  linkId: string,
): Promise<void> {
  return apiRequest(`/restaurants/${restaurantId}/social-links/${linkId}`, {
    method: 'DELETE',
    token,
  });
}

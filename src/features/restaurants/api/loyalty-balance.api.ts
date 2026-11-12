import { apiRequest } from '@/shared/api/api-client';
import type { LoyaltyBalance } from '@/shared/types/loyalty-balance';
import { guestLoyaltyMePath } from './loyalty-balance.request';

export function fetchGuestLoyaltyBalance(
  restaurantId: string,
  token: string,
): Promise<LoyaltyBalance> {
  return apiRequest<LoyaltyBalance>(guestLoyaltyMePath(restaurantId), { token });
}

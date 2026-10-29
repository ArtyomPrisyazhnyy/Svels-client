import { apiRequest } from '@/shared/api/api-client';
import type { LoyaltyBalance } from '@/shared/types/loyalty-balance';

export function fetchGuestLoyaltyBalance(restaurantId: string): Promise<LoyaltyBalance> {
  return apiRequest<LoyaltyBalance>(`/restaurants/${restaurantId}/loyalty/me`);
}

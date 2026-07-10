'use server';

import { revalidateRestaurantPublicPageCache } from '@/shared/cache/revalidate-restaurant-public-page';

export interface RevalidateRestaurantPublicPageResult {
  ok: boolean;
}

export async function revalidateRestaurantPublicPage(
  restaurantId: string,
): Promise<RevalidateRestaurantPublicPageResult> {
  if (!restaurantId) {
    return { ok: false };
  }

  revalidateRestaurantPublicPageCache(restaurantId);
  return { ok: true };
}

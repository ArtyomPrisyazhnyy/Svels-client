import { revalidatePath, revalidateTag } from 'next/cache';
import { restaurantPublicPageTag } from './restaurant-public-cache';

export function revalidateRestaurantPublicPageCache(restaurantId: string): void {
  const tag = restaurantPublicPageTag(restaurantId);
  const pagePath = `/restaurants/${restaurantId}`;

  revalidateTag(tag);
  revalidatePath(pagePath, 'page');
  revalidatePath('/restaurants/[id]', 'page');
}

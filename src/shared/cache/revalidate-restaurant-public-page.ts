import { revalidatePath, revalidateTag } from 'next/cache';
import { restaurantPublicPageTag } from './restaurant-public-cache';

export function revalidateRestaurantPublicPageCache(restaurantId: string): void {
  const tag = restaurantPublicPageTag(restaurantId);
  const pagePath = `/restaurants/${restaurantId}`;

  revalidateTag(tag);
  // VenueHeader (flame, favorites) and styling shell live in layout — not only page segment.
  revalidatePath(pagePath, 'layout');
  revalidatePath('/restaurants/[id]', 'layout');
  revalidatePath(pagePath, 'page');
  revalidatePath('/restaurants/[id]', 'page');

  for (const slug of ['account', 'booking', 'pre-order', 'favorites', 'auth', 'legal']) {
    revalidatePath(`${pagePath}/${slug}`, 'page');
    revalidatePath(`/restaurants/[id]/${slug}`, 'page');
  }
}

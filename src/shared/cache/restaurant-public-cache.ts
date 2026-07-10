/** Fallback ISR: обновление страницы, если on-demand revalidation не сработал */
export const RESTAURANT_PUBLIC_REVALIDATE_SECONDS = 3600;

export function restaurantPublicPageTag(restaurantId: string): string {
  return `restaurant-public:${restaurantId}`;
}

/** Fallback ISR: обновление страницы, если on-demand revalidation не сработал */
const parsedRevalidate = Number(process.env.RESTAURANT_PUBLIC_REVALIDATE_SECONDS);
export const RESTAURANT_PUBLIC_REVALIDATE_SECONDS =
  Number.isFinite(parsedRevalidate) && parsedRevalidate >= 0 ? parsedRevalidate : 3600;

export function restaurantPublicPageTag(restaurantId: string): string {
  return `restaurant-public:${restaurantId}`;
}

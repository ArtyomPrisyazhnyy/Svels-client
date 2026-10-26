import type { MetadataRoute } from 'next';
import { buildVenueSitemapEntries, getPlatformOrigin } from '@/features/restaurants/seo/venue-seo';
import type { PublicRestaurant } from '@/features/restaurants/types/restaurant';
import { serverFetch } from '@/shared/api/server-api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getPlatformOrigin();

  let restaurants: PublicRestaurant[] = [];

  try {
    restaurants = await serverFetch<PublicRestaurant[]>('/restaurants');
  } catch {
    restaurants = [];
  }

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...restaurants.flatMap((restaurant) =>
      buildVenueSitemapEntries({
        restaurantId: restaurant.id,
        customDomain: restaurant.customDomain,
        lastModified: restaurant.createdAt,
        platformOrigin: siteUrl,
      }),
    ),
  ];
}

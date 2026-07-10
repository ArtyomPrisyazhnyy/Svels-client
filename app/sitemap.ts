import type { MetadataRoute } from 'next';
import type { PublicRestaurant } from '@/features/restaurants/types/restaurant';
import { serverFetch } from '@/shared/api/server-api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3001';

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
    ...restaurants.map((restaurant) => ({
      url: `${siteUrl}/restaurants/${restaurant.id}`,
      lastModified: new Date(restaurant.createdAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];
}

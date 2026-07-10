import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/restaurants/'],
      disallow: [
        '/admin',
        '/restaurant-admin',
        '/account',
        '/auth',
        '/booking',
        '/pre-order',
        '/restaurants/*/auth',
        '/restaurants/*/account',
        '/restaurants/*/booking',
        '/restaurants/*/pre-order',
      ],
    },
  };
}

import { getBaseUrl } from './env';

export async function revalidateRestaurantPublicPage(restaurantId: string): Promise<void> {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    throw new Error('REVALIDATE_SECRET is required to refresh the public page cache');
  }

  const response = await fetch(`${getBaseUrl()}/api/revalidate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secret}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ restaurantId }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`POST /api/revalidate → ${response.status}: ${text}`);
  }
}

import { NextResponse } from 'next/server';
import { revalidateRestaurantPublicPageCache } from '@/shared/cache/revalidate-restaurant-public-page';

interface RevalidateBody {
  restaurantId?: string;
}

export async function POST(request: Request): Promise<NextResponse> {
  const secret = process.env.REVALIDATE_SECRET;

  if (!secret) {
    return NextResponse.json({ error: 'Revalidation is not configured' }, { status: 503 });
  }

  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: RevalidateBody;

  try {
    body = (await request.json()) as RevalidateBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body.restaurantId) {
    return NextResponse.json({ error: 'restaurantId is required' }, { status: 400 });
  }

  revalidateRestaurantPublicPageCache(body.restaurantId);

  return NextResponse.json({ revalidated: true, restaurantId: body.restaurantId });
}

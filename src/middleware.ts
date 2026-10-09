import { NextRequest, NextResponse } from 'next/server';
import { buildRestaurantGuestPath } from '@/shared/routing/restaurant-guest-path';
import { isPlatformHost, normalizeHost } from '@/shared/tenant/platform-hosts';
import { resolveRestaurantByDomain } from '@/shared/tenant/resolve-restaurant';

const TENANT_GUEST_SEGMENTS = new Set(['booking', 'pre-order', 'account', 'auth', 'favorites', 'legal']);
const TENANT_BLOCKED_PREFIXES = ['/admin', '/restaurant-admin'];

function mapTenantPath(pathname: string, restaurantId: string): string {
  const normalizedPath = pathname !== '/' && pathname.endsWith('/')
    ? pathname.slice(0, -1)
    : pathname;

  if (normalizedPath === '/') {
    return buildRestaurantGuestPath(restaurantId, 'home');
  }

  // bePaid return URL на custom domain: /payment/result?...
  if (normalizedPath === '/payment/result' || normalizedPath.startsWith('/payment/result/')) {
    return `/restaurants/${restaurantId}/payment/result`;
  }

  const segment = normalizedPath.slice(1).split('/')[0];

  if (segment && TENANT_GUEST_SEGMENTS.has(segment)) {
    return buildRestaurantGuestPath(restaurantId, segment as 'booking' | 'pre-order' | 'account' | 'auth' | 'favorites');
  }

  return buildRestaurantGuestPath(restaurantId, 'home');
}

export async function middleware(request: NextRequest) {
  const host = normalizeHost(request.headers.get('host') ?? '');

  if (isPlatformHost(host)) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  if (TENANT_BLOCKED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    const platformBase = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3001';
    return NextResponse.redirect(new URL(pathname, platformBase));
  }

  if (pathname.startsWith('/restaurants/')) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/';
    return NextResponse.redirect(redirectUrl);
  }

  const restaurantId = await resolveRestaurantByDomain(host);

  if (!restaurantId) {
    return new NextResponse('Заведение для этого домена не найдено', { status: 404 });
  }

  const normalizedPath =
    pathname !== '/' && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;

  if (normalizedPath !== '/') {
    const isPaymentResult =
      normalizedPath === '/payment/result' || normalizedPath.startsWith('/payment/result/');
    const segment = normalizedPath.slice(1).split('/')[0];
    if (!isPaymentResult && (!segment || !TENANT_GUEST_SEGMENTS.has(segment))) {
      return new NextResponse('Страница не найдена', { status: 404 });
    }
  }

  const rewriteUrl = request.nextUrl.clone();
  rewriteUrl.pathname = mapTenantPath(pathname, restaurantId);

  const response = NextResponse.rewrite(rewriteUrl);
  response.headers.set('x-svels-tenant', 'custom');
  response.headers.set('x-svels-restaurant-id', restaurantId);

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|fonts|uploads|api).*)'],
};

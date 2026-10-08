import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:3000';
const UPSTREAM_TIMEOUT_MS = 4_000;

/**
 * Прокси /uploads/* на Nest с коротким таймаутом.
 * Иначе при рестарте backend Next rewrite висит и браузер показывает 504 Gateway Timeout.
 */
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  const relativePath = path.map(encodeURIComponent).join('/');
  const upstreamUrl = `${API_URL}/uploads/${relativePath}`;

  try {
    const response = await fetch(upstreamUrl, {
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
      cache: 'no-store',
    });

    if (!response.ok || !response.body) {
      return new NextResponse(null, { status: response.status === 404 ? 404 : 502 });
    }

    const headers = new Headers();
    const contentType = response.headers.get('content-type');
    if (contentType) {
      headers.set('Content-Type', contentType);
    }
    headers.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');

    return new NextResponse(response.body, {
      status: 200,
      headers,
    });
  } catch {
    return new NextResponse('Uploads upstream unavailable', { status: 502 });
  }
}

import { API_URL } from '@/shared/config/env';

interface ResolveDomainResponse {
  id: string;
  name: string;
  customDomain: string;
}

const DOMAIN_CACHE_TTL_MS = 60_000;
const domainCache = new Map<string, { id: string; expiresAt: number }>();

export async function resolveRestaurantByDomain(host: string): Promise<string | null> {
  const normalizedHost = host.trim().toLowerCase();
  const cached = domainCache.get(normalizedHost);

  if (cached && cached.expiresAt > Date.now()) {
    return cached.id;
  }

  try {
    const response = await fetch(
      `${API_URL}/restaurants/resolve-domain?host=${encodeURIComponent(normalizedHost)}`,
      { next: { revalidate: 60 } },
    );

    if (!response.ok) {
      return null;
    }

    const body = (await response.json()) as ResolveDomainResponse;
    domainCache.set(normalizedHost, {
      id: body.id,
      expiresAt: Date.now() + DOMAIN_CACHE_TTL_MS,
    });

    return body.id;
  } catch {
    return null;
  }
}

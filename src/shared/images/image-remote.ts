/**
 * Hosts the Next image optimizer is allowed to fetch.
 * Keep this in sync with `images.remotePatterns` in next.config.ts (it imports this).
 */

export interface ImageRemotePattern {
  protocol: 'http' | 'https';
  hostname: string;
  port?: string;
  pathname: string;
}

function patternFromOrigin(origin: string, pathname: string): ImageRemotePattern | null {
  try {
    const url = origin.includes('://') ? new URL(origin) : new URL(`https://${origin}`);
    return {
      protocol: url.protocol === 'https:' ? 'https' : 'http',
      hostname: url.hostname,
      ...(url.port ? { port: url.port } : {}),
      pathname,
    };
  } catch {
    return null;
  }
}

export function imageRemotePatterns(): ImageRemotePattern[] {
  const patterns: ImageRemotePattern[] = [
    { protocol: 'http', hostname: 'localhost', port: '3000', pathname: '/uploads/**' },
    { protocol: 'http', hostname: '127.0.0.1', port: '3000', pathname: '/uploads/**' },
    { protocol: 'https', hostname: 'storage.yandexcloud.net', pathname: '/**' },
    { protocol: 'https', hostname: '*.storage.yandexcloud.net', pathname: '/**' },
  ];

  const api = process.env.NEXT_PUBLIC_API_URL;
  if (api) {
    const pattern = patternFromOrigin(api, '/uploads/**');
    if (pattern) {
      patterns.push(pattern);
    }
  }

  const extra = process.env.NEXT_PUBLIC_IMAGE_HOSTS ?? '';
  for (const host of extra.split(',').map((item) => item.trim()).filter(Boolean)) {
    const pattern = patternFromOrigin(host, '/**');
    if (pattern) {
      patterns.push(pattern);
    }
  }

  return patterns;
}

function hostMatches(pattern: string, host: string): boolean {
  if (pattern === host) {
    return true;
  }
  if (pattern.startsWith('*.')) {
    const suffix = pattern.slice(1);
    return host.endsWith(suffix) && host.length > suffix.length && !host.slice(0, -suffix.length).includes('.');
  }
  return false;
}

function pathMatches(pattern: string, pathname: string): boolean {
  if (pattern === '/**') {
    return true;
  }
  if (pattern.endsWith('/**')) {
    const prefix = pattern.slice(0, -3);
    return pathname === prefix || pathname.startsWith(`${prefix}/`);
  }
  return pattern === pathname;
}

export function isOptimizableImageUrl(absoluteUrl: string): boolean {
  let url: URL;
  try {
    url = new URL(absoluteUrl);
  } catch {
    return false;
  }

  const protocol = url.protocol === 'https:' ? 'https' : url.protocol === 'http:' ? 'http' : null;
  if (!protocol) {
    return false;
  }

  return imageRemotePatterns().some((pattern) => {
    if (pattern.protocol !== protocol) {
      return false;
    }
    if ((pattern.port ?? '') !== url.port) {
      return false;
    }
    if (!hostMatches(pattern.hostname, url.hostname)) {
      return false;
    }
    return pathMatches(pattern.pathname, url.pathname);
  });
}

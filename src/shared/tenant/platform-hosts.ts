const DEFAULT_PLATFORM_HOSTS = ['localhost', '127.0.0.1', 'svels.by', 'www.svels.by'];

function parsePlatformHosts(raw: string | undefined): string[] {
  if (!raw?.trim()) {
    return DEFAULT_PLATFORM_HOSTS;
  }

  return raw
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

export function getPlatformHosts(): string[] {
  return parsePlatformHosts(
    process.env.NEXT_PUBLIC_PLATFORM_HOSTS ?? process.env.PLATFORM_HOSTS,
  );
}

export function normalizeHost(raw: string): string {
  let host = raw.trim().toLowerCase();
  host = host.split(':')[0] ?? host;

  if (host.startsWith('www.')) {
    host = host.slice(4);
  }

  return host;
}

export function isPlatformHost(rawHost: string): boolean {
  const host = normalizeHost(rawHost);
  const platformHosts = getPlatformHosts();

  if (platformHosts.includes(host)) {
    return true;
  }

  // LAN IP during local development
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) {
    return true;
  }

  return false;
}

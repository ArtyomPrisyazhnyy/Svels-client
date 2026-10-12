import type { NextConfig } from 'next';

const platformHosts = (process.env.NEXT_PUBLIC_PLATFORM_HOSTS ?? '')
  .split(',')
  .map((host) => host.trim())
  .filter(Boolean);

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  devIndicators: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    // Keep client router prefetched RSC payloads warm (guest subpages revisit without full refetch).
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
  // Доступ к dev-серверу с телефона/другого ПК в локальной сети
  allowedDevOrigins: [...new Set(['localhost', '127.0.0.1', ...platformHosts])],
};

export default nextConfig;

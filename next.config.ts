import type { NextConfig } from 'next';

const platformHosts = (process.env.NEXT_PUBLIC_PLATFORM_HOSTS ?? '')
  .split(',')
  .map((host) => host.trim())
  .filter(Boolean);

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    staleTimes: {
      dynamic: 0,
      static: 0,
    },
  },
  // Доступ к dev-серверу с телефона/другого ПК в локальной сети
  allowedDevOrigins: [...new Set(['localhost', '127.0.0.1', ...platformHosts])],
};

export default nextConfig;

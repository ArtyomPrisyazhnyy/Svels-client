import type { NextConfig } from 'next';
import { withSentryConfig } from '@sentry/nextjs';

const platformHosts = (process.env.NEXT_PUBLIC_PLATFORM_HOSTS ?? '')
  .split(',')
  .map((host) => host.trim())
  .filter(Boolean);

const isProduction = process.env.NODE_ENV === 'production';

const productionSecurityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains',
  },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(self), payment=(self)',
  },
];

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
  async headers() {
    if (!isProduction) {
      return [];
    }

    return [
      {
        source: '/:path*',
        headers: productionSecurityHeaders,
      },
    ];
  },
};

const sentryDsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
const sentrySourceMapsEnabled = Boolean(process.env.SENTRY_AUTH_TOKEN);

export default sentryDsn
  ? withSentryConfig(nextConfig, {
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      silent: !sentrySourceMapsEnabled,
      widenClientFileUpload: true,
      disableLogger: true,
      sourcemaps: {
        disable: !sentrySourceMapsEnabled,
      },
      telemetry: false,
    })
  : nextConfig;

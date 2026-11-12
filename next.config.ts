import path from 'node:path';
import type { NextConfig } from 'next';
import { withSentryConfig } from '@sentry/nextjs';
import { imageRemotePatterns } from './src/shared/images/image-remote';

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
    // One HTML payload instead of a dozen render-blocking stylesheet round trips.
    inlineCss: true,
  },
  images: {
    formats: ['image/webp'],
    qualities: [65, 75],
    imageSizes: [64, 80, 96, 128, 176, 256, 288, 384, 480],
    deviceSizes: [640, 768, 1024, 1280, 1920],
    minimumCacheTTL: 60 * 60 * 24,
    remotePatterns: imageRemotePatterns(),
  },
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /build[\\/]polyfills[\\/]polyfill-module(?:\.js)?$/,
          path.join(process.cwd(), 'src/shared/lib/empty-polyfill.js'),
        ),
      );
    }
    return config;
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

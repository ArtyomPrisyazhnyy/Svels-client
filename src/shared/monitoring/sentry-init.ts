import type { BrowserOptions, EdgeOptions, NodeOptions } from '@sentry/nextjs';

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

export function isSentryEnabled(): boolean {
  return Boolean(dsn);
}

function resolveSentryEnvironment(): string {
  return (
    process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ??
    process.env.SENTRY_ENVIRONMENT ??
    process.env.NODE_ENV ??
    'development'
  );
}

function stripRequestPii<T extends BrowserOptions | NodeOptions | EdgeOptions>(options: T): T {
  return {
    ...options,
    beforeSend(event) {
      if (event.request) {
        delete event.request.cookies;
        if (event.request.headers) {
          delete event.request.headers.authorization;
          delete event.request.headers.cookie;
          delete event.request.headers['x-guest-id'];
        }
      }
      return event;
    },
  };
}

function baseOptions(): Pick<BrowserOptions, 'dsn' | 'environment' | 'sendDefaultPii' | 'tracesSampleRate'> {
  const tracesSampleRate = Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? '0.1');

  return {
    dsn,
    environment: resolveSentryEnvironment(),
    sendDefaultPii: false,
    tracesSampleRate: Number.isFinite(tracesSampleRate) ? tracesSampleRate : 0.1,
  };
}

export function getSentryClientOptions(): BrowserOptions | null {
  if (!dsn) {
    return null;
  }

  return stripRequestPii({
    ...baseOptions(),
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
  });
}

export function getSentryServerOptions(): NodeOptions | null {
  if (!dsn) {
    return null;
  }

  return stripRequestPii({
    ...baseOptions(),
  });
}

export function getSentryEdgeOptions(): EdgeOptions | null {
  if (!dsn) {
    return null;
  }

  return stripRequestPii({
    ...baseOptions(),
  });
}

import * as Sentry from '@sentry/nextjs';
import { classifyError, type ErrorKind } from '@/lib/errors/classify';
import { parseApiPathContext } from '@/lib/errors/parse-api-path-context';
import { ApiError } from '@/shared/api/api-client';
import { isSentryEnabled } from '@/shared/monitoring/sentry-init';

const NETWORK_BURST_WINDOW_MS = 60_000;
const NETWORK_BURST_THRESHOLD = 3;

interface NetworkBurstState {
  timestamps: number[];
  reportedInWindow: boolean;
}

let networkBurstState: NetworkBurstState | null = null;

function getNetworkBurstState(): NetworkBurstState {
  if (!networkBurstState) {
    networkBurstState = { timestamps: [], reportedInWindow: false };
  }
  return networkBurstState;
}

function pruneNetworkTimestamps(state: NetworkBurstState, now: number): void {
  state.timestamps = state.timestamps.filter((ts) => now - ts < NETWORK_BURST_WINDOW_MS);
  if (state.timestamps.length === 0) {
    state.reportedInWindow = false;
  }
}

export interface ApiErrorTelemetryContext {
  path: string;
  method?: string;
  status?: number;
  errorId?: string;
}

function buildTags(
  kind: ErrorKind,
  pathContext: ReturnType<typeof parseApiPathContext>,
  status?: number,
  errorId?: string,
): Record<string, string> {
  const tags: Record<string, string> = {
    kind,
    route: pathContext.route,
  };

  if (pathContext.restaurantId) {
    tags.restaurantId = pathContext.restaurantId;
  }
  if (pathContext.restaurantSlug) {
    tags.restaurantSlug = pathContext.restaurantSlug;
  }
  if (status !== undefined && status > 0) {
    tags.httpStatus = String(status);
  }
  if (errorId) {
    tags.errorId = errorId;
  }

  return tags;
}

function recordNetworkBreadcrumb(context: ApiErrorTelemetryContext, kind: ErrorKind): void {
  if (!isSentryEnabled()) {
    return;
  }

  const pathContext = parseApiPathContext(context.path);
  Sentry.addBreadcrumb({
    category: 'api.network',
    level: 'warning',
    message: 'API network failure',
    data: {
      kind,
      route: pathContext.route,
      method: context.method ?? 'GET',
      status: context.status ?? 0,
      errorId: context.errorId,
    },
  });

  const now = Date.now();
  const state = getNetworkBurstState();
  pruneNetworkTimestamps(state, now);
  state.timestamps.push(now);

  if (state.timestamps.length >= NETWORK_BURST_THRESHOLD && !state.reportedInWindow) {
    state.reportedInWindow = true;
    Sentry.captureMessage('Repeated API network failures in session', {
      level: 'warning',
      tags: buildTags(kind, pathContext, context.status, context.errorId),
    });
  }
}

export function reportApiErrorTelemetry(error: unknown, context: ApiErrorTelemetryContext): void {
  if (!isSentryEnabled() || typeof window === 'undefined') {
    return;
  }

  const kind = classifyError(error, { status: context.status });
  const pathContext = parseApiPathContext(context.path);
  const tags = buildTags(kind, pathContext, context.status, context.errorId);

  if (kind === 'network') {
    recordNetworkBreadcrumb(context, kind);
    return;
  }

  if (kind === 'client') {
    return;
  }

  const captureTarget = error instanceof Error ? error : new ApiError(context.status ?? 500, 'API error');

  Sentry.captureException(captureTarget, {
    tags,
    extra: {
      route: pathContext.route,
      method: context.method,
      errorId: context.errorId,
    },
  });
}

export function reportCrashTelemetry(error: unknown, tags?: Record<string, string>): void {
  if (!isSentryEnabled()) {
    return;
  }

  Sentry.captureException(error, tags ? { tags } : undefined);
}

'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
import { classifyError } from '@/lib/errors/classify';
import { getFriendlyErrorCopy } from '@/lib/errors/messages';
import { reportCrashTelemetry } from '@/shared/monitoring/api-error-telemetry';
import { FriendlyErrorPanel } from '@/shared/components/FriendlyErrorPanel';

interface AppErrorBoundaryViewProps {
  error: Error & { digest?: string };
  reset?: () => void;
}

export function AppErrorBoundaryView({ error, reset }: AppErrorBoundaryViewProps) {
  useEffect(() => {
    const kind = classifyError(error);
    if (kind === 'server' || kind === 'crash') {
      reportCrashTelemetry(error, { kind, source: 'error-boundary' });
      Sentry.captureException(error);
    }
  }, [error]);

  const kind = classifyError(error);
  const copy = getFriendlyErrorCopy(kind === 'network' ? 'network' : 'crash');

  return <FriendlyErrorPanel copy={copy} onRetry={reset} />;
}

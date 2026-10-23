'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';
import { AppErrorBoundaryView } from '@/shared/components/AppErrorBoundaryView';
import '@/shared/styles/_tokens.scss';
import './globals.css';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="ru">
      <body>
        <AppErrorBoundaryView error={error} reset={reset} />
      </body>
    </html>
  );
}

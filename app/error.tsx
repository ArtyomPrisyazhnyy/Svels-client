'use client';

import { AppErrorBoundaryView } from '@/shared/components/AppErrorBoundaryView';

interface RootErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function RootError({ error, reset }: RootErrorProps) {
  return <AppErrorBoundaryView error={error} reset={reset} />;
}

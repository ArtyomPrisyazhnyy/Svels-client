'use client';

import { AppErrorBoundaryView } from '@/shared/components/AppErrorBoundaryView';

interface VenueErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function VenueError({ error, reset }: VenueErrorProps) {
  return <AppErrorBoundaryView error={error} reset={reset} />;
}

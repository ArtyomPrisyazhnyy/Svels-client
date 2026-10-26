'use client';

import { Button } from '@/shared/ui/Button/Button';
import { Stack } from '@/shared/ui/Stack/Stack';
import '../styles/guest-data-status.scss';

interface GuestDataRefreshMarkProps {
  active: boolean;
  testId: string;
}

/** Absolute accent line. It does not take space in the list. */
export function GuestDataRefreshMark({ active, testId }: GuestDataRefreshMarkProps) {
  if (!active) {
    return null;
  }

  return <span className="guest-data-refresh" data-testid={testId} aria-hidden />;
}

interface GuestDataErrorProps {
  message: string;
  testId: string;
  retryTestId: string;
  retrying: boolean;
  onRetry: () => void;
}

export function GuestDataError({
  message,
  testId,
  retryTestId,
  retrying,
  onRetry,
}: GuestDataErrorProps) {
  return (
    <Stack gap={3} align="flex-start" testId={testId}>
      <p className="guest-data-status__message">{message}</p>
      <Button
        variant="secondary"
        testId={retryTestId}
        loading={retrying}
        onClick={onRetry}
      >
        Повторить
      </Button>
    </Stack>
  );
}

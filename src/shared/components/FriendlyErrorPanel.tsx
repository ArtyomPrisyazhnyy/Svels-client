'use client';

import { Button } from '@/shared/ui/Button/Button';
import { Stack } from '@/shared/ui/Stack/Stack';
import type { FriendlyErrorCopy } from '@/lib/errors/messages';
import './friendly-error-panel.scss';

export interface FriendlyErrorPanelProps {
  copy: FriendlyErrorCopy;
  onRetry?: () => void;
  testId?: string;
}

export function FriendlyErrorPanel({ copy, onRetry, testId = 'friendly-error-panel' }: FriendlyErrorPanelProps) {
  return (
    <div className="friendly-error-panel" data-testid={testId}>
      <Stack gap={4} className="friendly-error-panel__inner">
        <h1 className="friendly-error-panel__title">{copy.title}</h1>
        <p className="friendly-error-panel__description">{copy.description}</p>
        {onRetry ? (
          <Button type="button" onClick={onRetry} testId="friendly-error-retry">
            {copy.retryLabel}
          </Button>
        ) : null}
      </Stack>
    </div>
  );
}

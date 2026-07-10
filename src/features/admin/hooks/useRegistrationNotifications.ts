'use client';

import { fetchEventSource } from '@microsoft/fetch-event-source';
import { useEffect } from 'react';
import type { PendingRegistration } from '../api/admin.api';
import { resolveApiUrl } from '@/shared/config/env';

export function useRegistrationNotifications(
  accessToken: string | null,
  onSubmitted: (registration: PendingRegistration) => void,
  onReviewed: (requestId: string) => void,
): void {
  useEffect(() => {
    if (!accessToken) {
      return;
    }

    const controller = new AbortController();

    void fetchEventSource(`${resolveApiUrl()}/admin/notifications/registrations/stream`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      signal: controller.signal,
      openWhenHidden: true,
      onmessage(message) {
        if (!message.data) {
          return;
        }

        let payload: {
          type?: string;
          data?: PendingRegistration | { requestId: string };
        };

        try {
          payload = JSON.parse(message.data) as typeof payload;
        } catch {
          return;
        }

        if (payload.type === 'registration.submitted' && payload.data) {
          onSubmitted(payload.data as PendingRegistration);
          return;
        }

        if (payload.type === 'registration.reviewed' && payload.data) {
          const reviewed = payload.data as { requestId: string };
          onReviewed(reviewed.requestId);
        }
      },
      onerror(error) {
        console.error('[SSE] registration stream error:', error);
      },
    });

    return () => {
      controller.abort();
    };
  }, [accessToken, onSubmitted, onReviewed]);
}

'use client';

import { useEffect } from 'react';
import { fetchProfile } from '../features/auth/api/users.api';
import { useAuthStore } from '../store/auth.store';

async function syncProfileFromStore(): Promise<void> {
  const { accessToken, updateUser } = useAuthStore.getState();

  if (!accessToken) {
    return;
  }

  try {
    const profile = await fetchProfile(accessToken);
    updateUser(profile);
  } catch {
    // ignore — stale token handled on next protected request
  }
}

function runAfterHydration(callback: () => void): void {
  const { persist } = useAuthStore;

  if (!persist?.hasHydrated) {
    callback();
    return;
  }

  if (persist.hasHydrated()) {
    callback();
    return;
  }

  persist.onFinishHydration(callback);
}

export function useAuthProfileSync() {
  useEffect(() => {
    runAfterHydration(() => {
      void syncProfileFromStore();
    });

    return useAuthStore.subscribe((state, prevState) => {
      if (state.accessToken !== prevState.accessToken) {
        void syncProfileFromStore();
      }
    });
  }, []);
}

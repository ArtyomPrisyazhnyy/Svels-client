'use client';

import { useEffect } from 'react';
import { fetchProfile } from '../features/auth/api/users.api';
import { useAuthStore } from '../store/auth.store';

let profileSyncInFlight: Promise<void> | null = null;
let lastSyncedAccessToken: string | null = null;

async function syncProfileFromStore(force = false): Promise<void> {
  const { accessToken, updateUser } = useAuthStore.getState();

  if (!accessToken) {
    lastSyncedAccessToken = null;
    return;
  }

  if (!force && lastSyncedAccessToken === accessToken) {
    return;
  }

  if (profileSyncInFlight) {
    await profileSyncInFlight;
    if (!force && lastSyncedAccessToken === accessToken) {
      return;
    }
  }

  profileSyncInFlight = (async () => {
    try {
      const profile = await fetchProfile(accessToken);
      updateUser(profile);
      lastSyncedAccessToken = accessToken;
    } catch {
      // ignore — stale token handled on next protected request
    } finally {
      profileSyncInFlight = null;
    }
  })();

  await profileSyncInFlight;
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
        void syncProfileFromStore(true);
      }
    });
  }, []);
}

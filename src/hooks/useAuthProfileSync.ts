import { useEffect } from 'react';
import { fetchProfile } from '../features/auth/api/users.api';
import { useAuthStore } from '../store/auth.store';

export function useAuthProfileSync() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const updateUser = useAuthStore((s) => s.updateUser);

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    fetchProfile(accessToken)
      .then((profile) => updateUser(profile))
      .catch(() => {
        // ignore — stale token handled on next protected request
      });
  }, [accessToken, updateUser]);
}

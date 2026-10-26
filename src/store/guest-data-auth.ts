import { useAuthStore } from './auth.store';
import { syncGuestDataOwner } from './guest-data.store';

let subscribed = false;

/** Drop the venue cache when the signed-in user changes or logs out. */
export function subscribeGuestDataAuth(): void {
  if (subscribed) {
    return;
  }
  subscribed = true;
  useAuthStore.subscribe((state, prev) => {
    const nextId = state.user?.id ?? null;
    const prevId = prev.user?.id ?? null;
    if (nextId === prevId) {
      return;
    }
    syncGuestDataOwner(nextId);
  });
}

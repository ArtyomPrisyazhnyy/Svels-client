import { resetGuestId } from '@/shared/utils/guest-id';
import { useAuthStore } from '@/store/auth.store';
import { useCartStore } from '@/store/cart.store';
import { useFavoritesStore } from '@/store/favorites.store';

/** Корзина, избранное и guest id живут в localStorage отдельно от JWT. */
export function clearLocalCommerceSession(): void {
  useCartStore.getState().clearCart();
  useFavoritesStore.getState().reset();
  resetGuestId();
}

let subscribed = false;

/** Выход / 401: не оставляем лайки и корзину прошлого аккаунта на устройстве. */
export function subscribeAuthLogoutCleanup(): void {
  if (subscribed) {
    return;
  }
  subscribed = true;
  useAuthStore.subscribe((state, prev) => {
    if (prev.accessToken && !state.accessToken) {
      clearLocalCommerceSession();
    }
  });
}

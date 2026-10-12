'use client';

import { useEffect, useState } from 'react';
import { preloadRestaurantCartModal } from './lazy-venue-modals';
import '../styles/restaurant-cart-button.scss';

interface RestaurantCartButtonProps {
  restaurantId: string;
  onOpen: () => void;
}

function CartIcon() {
  return (
    <svg
      className="restaurant-cart-button__icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 6h15l-1.5 9H8L6 6Z" />
      <path d="M6 6 5 3H2" />
      <circle cx="9.5" cy="19" r="1.25" fill="currentColor" stroke="none" />
      <circle cx="17.5" cy="19" r="1.25" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function RestaurantCartButton({ restaurantId, onOpen }: RestaurantCartButtonProps) {
  const [hydrated, setHydrated] = useState(false);
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    let unsubscribe = () => {};
    let cancelled = false;

    void import('@/store/cart.store').then(({ useCartStore }) => {
      if (cancelled) {
        return;
      }
      const { persist } = useCartStore;
      const sync = () => {
        const state = useCartStore.getState();
        const items = state.restaurantId === restaurantId ? state.items : [];
        setItemCount(items.reduce((sum, line) => sum + line.quantity, 0));
        setHydrated(!persist?.hasHydrated || persist.hasHydrated());
      };
      if (persist && !persist.hasHydrated()) {
        void persist.rehydrate();
        unsubscribe = persist.onFinishHydration(() => {
          sync();
        });
      }
      sync();
      const storeUnsub = useCartStore.subscribe(sync);
      const previous = unsubscribe;
      unsubscribe = () => {
        previous();
        storeUnsub();
      };
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [restaurantId]);

  const hasItems = hydrated && itemCount > 0;

  return (
    <button
      type="button"
      className="restaurant-cart-button"
      onClick={onOpen}
      onMouseEnter={preloadRestaurantCartModal}
      onTouchStart={preloadRestaurantCartModal}
      aria-label={hasItems ? `Корзина, ${itemCount} поз.` : 'Корзина'}
      data-testid="cart-button"
    >
      <CartIcon />
      {hasItems && <span className="restaurant-cart-button__badge">{itemCount}</span>}
    </button>
  );
}

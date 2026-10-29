'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/store/cart.store';
import { useCartHydrated } from '@/hooks/useCartHydrated';
import { formatCartItemsCount, sumCartQuantity } from '../utils/cart-items-label.util';
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
  const hydrated = useCartHydrated();
  const itemCount = useCartStore((s) => {
    const items = s.restaurantId === restaurantId ? s.items : [];
    return sumCartQuantity(items);
  });

  useEffect(() => {
    preloadRestaurantCartModal();
  }, [restaurantId]);

  const hasItems = hydrated && itemCount > 0;

  return (
    <button
      type="button"
      className="restaurant-cart-button"
      onClick={onOpen}
      onMouseEnter={preloadRestaurantCartModal}
      onTouchStart={preloadRestaurantCartModal}
      aria-label={hasItems ? `Корзина, ${formatCartItemsCount(itemCount)}` : 'Корзина'}
      data-testid="cart-button"
    >
      <CartIcon />
      {hasItems && (
        <span className="restaurant-cart-button__badge" data-testid="cart-button-badge">
          {itemCount}
        </span>
      )}
    </button>
  );
}

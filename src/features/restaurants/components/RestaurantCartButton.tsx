'use client';

import type { CartLineItem } from '@/shared/types/cart';
import { useCartHydrated } from '@/hooks/useCartHydrated';
import { useCartStore } from '@/store/cart.store';
import '../styles/restaurant-cart-button.scss';

interface RestaurantCartButtonProps {
  restaurantId: string;
  onOpen: () => void;
}

const EMPTY_CART_ITEMS: CartLineItem[] = [];

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
  const items = useCartStore((s) =>
    s.restaurantId === restaurantId ? s.items : EMPTY_CART_ITEMS,
  );
  const itemCount = items.reduce((sum, line) => sum + line.quantity, 0);
  const hasItems = hydrated && itemCount > 0;

  return (
    <button
      type="button"
      className="restaurant-cart-button"
      onClick={onOpen}
      aria-label={hasItems ? `Корзина, ${itemCount} поз.` : 'Корзина'}
      data-testid="cart-button"
    >
      <CartIcon />
      {hasItems && <span className="restaurant-cart-button__badge">{itemCount}</span>}
    </button>
  );
}

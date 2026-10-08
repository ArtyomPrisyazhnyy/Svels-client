'use client';

import Link from 'next/link';
import { useFavoritesStore } from '@/store/favorites.store';
import '../styles/restaurant-favorites-header-button.scss';

interface RestaurantFavoritesHeaderButtonProps {
  href: string;
}

function HeartIcon() {
  return (
    <svg
      className="restaurant-favorites-header-button__icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

export function RestaurantFavoritesHeaderButton({ href }: RestaurantFavoritesHeaderButtonProps) {
  const hasFavorites = useFavoritesStore((s) => s.menuItemIds.length > 0);

  return (
    <Link
      href={href}
      className={`restaurant-favorites-header-button${
        hasFavorites ? ' restaurant-favorites-header-button--active' : ''
      }`}
      aria-label="Избранное"
      data-testid="favorites-header-button"
    >
      <HeartIcon />
    </Link>
  );
}

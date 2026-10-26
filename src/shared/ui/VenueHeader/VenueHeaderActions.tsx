'use client';

import { useRouter } from 'next/navigation';
import { useAuthHydrated } from '@/hooks/useAuthHydrated';
import { useRestaurantGuestPaths } from '@/shared/routing/restaurant-guest-path';
import { useAuthStore } from '@/store/auth.store';
import { useVenueOverlayOptional } from '@/features/restaurants/context/VenueOverlayContext';
import { prefetchGuestData } from '@/features/restaurants/guest-data/ensure-guest-data';
import { RestaurantCartButton } from '@/features/restaurants/components/RestaurantCartButton';
import { RestaurantFavoritesHeaderButton } from '@/features/restaurants/components/RestaurantFavoritesHeaderButton';
import { RestaurantGuestProfileButton } from '@/features/restaurants/components/RestaurantGuestProfileButton';
import '@/features/restaurants/styles/loyalty-flame-button.scss';

interface VenueHeaderActionsProps {
  restaurantId: string;
  flameDisplayEnabled?: boolean;
  favoritesEnabled?: boolean;
  enableCart?: boolean;
}

export function VenueHeaderActions({
  restaurantId,
  flameDisplayEnabled = false,
  favoritesEnabled = false,
  enableCart = true,
}: VenueHeaderActionsProps) {
  const router = useRouter();
  const hydrated = useAuthHydrated();
  const user = useAuthStore((s) => s.user);
  const paths = useRestaurantGuestPaths(restaurantId);
  const overlay = useVenueOverlayOptional();

  const isGuestOfRestaurant =
    hydrated && user?.role === 'user' && user.restaurantId === restaurantId;

  function handleProfileClick() {
    if (isGuestOfRestaurant) {
      router.push(paths.account);
      return;
    }
    overlay?.openAuth();
  }

  function handleFlameClick() {
    handleProfileClick();
  }

  return (
    <div className="venue-header__actions" data-testid="venue-header-actions">
      {flameDisplayEnabled ? (
        <div className="venue-header__action-slot">
          <button
            type="button"
            className={`loyalty-flame-button${
              isGuestOfRestaurant ? ' loyalty-flame-button--lit' : ''
            }`}
            onClick={handleFlameClick}
            aria-label="Огонёк лояльности"
            title="Огонёк лояльности"
            data-testid="loyalty-flame-button"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
              <path
                fill="currentColor"
                d="M12 2c1.5 3.2-.2 5.2-1.5 6.6C9 10.2 8 11.5 8 14a4 4 0 0 0 8 0c0-2.2-1-4.1-2.2-5.6-.7-.9-1.4-1.8-1.4-3.2 0-.8.2-1.7.6-2.7.3 1.2 1.1 2.1 2.2 2.9C17.1 6.7 19 9.2 19 13a7 7 0 1 1-14 0c0-2.6 1.1-4.7 2.6-6.4C9.2 4.8 10.6 3.4 12 2z"
              />
            </svg>
          </button>
        </div>
      ) : null}
      {favoritesEnabled ? (
        <div className="venue-header__action-slot" data-testid="venue-header-favorites">
          <RestaurantFavoritesHeaderButton href={paths.favorites} />
        </div>
      ) : null}
      <div className="venue-header__action-slot" data-testid="venue-header-profile">
        <RestaurantGuestProfileButton
          authenticated={isGuestOfRestaurant}
          onClick={handleProfileClick}
          onMouseEnter={() => prefetchGuestData(restaurantId, 'both')}
          onTouchStart={() => prefetchGuestData(restaurantId, 'both')}
        />
      </div>
      {enableCart && overlay ? (
        <div className="venue-header__action-slot" data-testid="venue-header-cart">
          <RestaurantCartButton restaurantId={restaurantId} onOpen={overlay.openCart} />
        </div>
      ) : null}
    </div>
  );
}

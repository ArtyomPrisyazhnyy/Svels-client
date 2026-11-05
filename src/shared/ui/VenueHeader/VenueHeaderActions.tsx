'use client';

import { useRouter } from 'next/navigation';
import { useAuthHydrated } from '@/hooks/useAuthHydrated';
import { useRestaurantGuestPaths } from '@/shared/routing/restaurant-guest-path';
import { useAuthStore } from '@/store/auth.store';
import { useVenueOverlayOptional } from '@/features/restaurants/context/VenueOverlayContext';
import { RestaurantCartButton } from '@/features/restaurants/components/RestaurantCartButton';
import { RestaurantFavoritesHeaderButton } from '@/features/restaurants/components/RestaurantFavoritesHeaderButton';
import { LoyaltyFlameHeaderButton } from '@/features/restaurants/components/LoyaltyFlameHeaderButton';
import { RestaurantGuestProfileButton } from '@/features/restaurants/components/RestaurantGuestProfileButton';

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
    overlay?.openFlameInfo();
  }

  const flameVisual = overlay?.loyaltyFlameVisual ?? 'off';
  const flameStreakDays = overlay?.loyaltyFlameStreakDays ?? 0;
  const flameExpiring = overlay?.loyaltyFlameExpiring ?? false;

  return (
    <div className="venue-header__actions" data-testid="venue-header-actions">
      {flameDisplayEnabled ? (
        <div className="venue-header__action-slot">
          <LoyaltyFlameHeaderButton
            visual={flameVisual}
            streakDays={flameStreakDays}
            expiring={flameExpiring}
            onClick={handleFlameClick}
          />
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

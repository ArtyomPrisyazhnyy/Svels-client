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
import {
  resolveVenueHeaderActionOrder,
  type VenueHeaderActionId,
} from '@/features/restaurants/utils/venue-header-actions.order';

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
  const streakDays = overlay?.loyaltyFlameStreakDays ?? 0;
  const flameExpiring = overlay?.loyaltyFlameExpiring ?? false;
  const showCart = enableCart && overlay !== null;
  const actionOrder = resolveVenueHeaderActionOrder({
    flame: flameDisplayEnabled,
    favorites: favoritesEnabled,
    cart: showCart,
  });

  function renderAction(action: VenueHeaderActionId) {
    if (action === 'flame') {
      return (
        <div key="flame" className="venue-header__action-slot venue-header__action-slot--flame">
          <LoyaltyFlameHeaderButton
            visual={flameVisual}
            streakDays={streakDays}
            expiring={flameExpiring}
            onClick={handleFlameClick}
          />
        </div>
      );
    }
    if (action === 'favorites') {
      return (
        <div key="favorites" className="venue-header__action-slot" data-testid="venue-header-favorites">
          <RestaurantFavoritesHeaderButton href={paths.favorites} />
        </div>
      );
    }
    if (action === 'cart' && overlay) {
      return (
        <div key="cart" className="venue-header__action-slot" data-testid="venue-header-cart">
          <RestaurantCartButton restaurantId={restaurantId} onOpen={overlay.openCart} />
        </div>
      );
    }
    return (
      <div key="profile" className="venue-header__action-slot" data-testid="venue-header-profile">
        <RestaurantGuestProfileButton
          authenticated={isGuestOfRestaurant}
          onClick={handleProfileClick}
        />
      </div>
    );
  }

  return (
    <div className="venue-header__actions" data-testid="venue-header-actions">
      {actionOrder.map(renderAction)}
    </div>
  );
}

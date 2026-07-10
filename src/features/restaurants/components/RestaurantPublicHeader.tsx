'use client';

import { useRouter } from 'next/navigation';
import { resolveImageUrl } from '@/shared/types/menu';
import { useAuthHydrated } from '@/hooks/useAuthHydrated';
import { useRestaurantGuestPaths } from '@/shared/routing/restaurant-guest-path';
import { useAuthStore } from '@/store/auth.store';
import { useMenuCategoryNavOptional } from '../context/MenuCategoryNavContext';
import { MenuCategoryNav } from './MenuCategoryNav';
import { RestaurantCartButton } from './RestaurantCartButton';
import { RestaurantGuestProfileButton } from './RestaurantGuestProfileButton';

interface RestaurantPublicHeaderProps {
  restaurantId: string;
  restaurantName: string;
  logoUrl?: string | null;
  onOpenCart?: () => void;
  onOpenAuth?: () => void;
}

export function RestaurantPublicHeader({
  restaurantId,
  restaurantName,
  logoUrl,
  onOpenCart,
  onOpenAuth,
}: RestaurantPublicHeaderProps) {
  const router = useRouter();
  const hydrated = useAuthHydrated();
  const user = useAuthStore((s) => s.user);
  const paths = useRestaurantGuestPaths(restaurantId);
  const navContext = useMenuCategoryNavOptional();

  const showHeaderCategoryNav =
    navContext !== null &&
    (navContext.mode === 'always_in_header' ||
      (navContext.mode === 'dock_in_header' && navContext.docked));

  const isGuestOfRestaurant =
    hydrated && user?.role === 'user' && user.restaurantId === restaurantId;

  function handleProfileClick() {
    if (isGuestOfRestaurant) {
      router.push(paths.account);
      return;
    }

    onOpenAuth?.();
  }

  return (
    <header
      className={`glass-header${
        showHeaderCategoryNav ? ' glass-header--category-docked' : ''
      }`}
    >
      <div className="glass-header__brand">
        {logoUrl && (
          <img
            className="glass-header__logo"
            src={resolveImageUrl(logoUrl)}
            alt=""
          />
        )}
        <span className="glass-header__brand-name">{restaurantName}</span>
      </div>

      {showHeaderCategoryNav && (
        <div className="glass-header__category-nav glass-header__category-nav--visible">
          <MenuCategoryNav placement="header" />
        </div>
      )}

      <div className="glass-header__actions">
        {onOpenCart && (
          <RestaurantCartButton restaurantId={restaurantId} onOpen={onOpenCart} />
        )}
        <RestaurantGuestProfileButton
          authenticated={isGuestOfRestaurant}
          onClick={handleProfileClick}
        />
      </div>
    </header>
  );
}

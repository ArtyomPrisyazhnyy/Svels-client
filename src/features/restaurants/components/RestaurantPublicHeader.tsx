'use client';

import { useRouter } from 'next/navigation';
import { ResponsiveImage } from '@/shared/components/ResponsiveImage';
import { useAuthHydrated } from '@/hooks/useAuthHydrated';
import { useRestaurantGuestPaths } from '@/shared/routing/restaurant-guest-path';
import { useAuthStore } from '@/store/auth.store';
import { useMenuCategoryNavOptional } from '../context/MenuCategoryNavContext';
import { MenuCategoryNav } from './MenuCategoryNav';
import { RestaurantCartButton } from './RestaurantCartButton';
import { RestaurantFavoritesHeaderButton } from './RestaurantFavoritesHeaderButton';
import { RestaurantGuestProfileButton } from './RestaurantGuestProfileButton';
import '../styles/loyalty-flame-button.scss';

interface RestaurantPublicHeaderProps {
  restaurantId: string;
  restaurantName: string;
  logoUrl?: string | null;
  logoWebpUrl?: string | null;
  onOpenCart?: () => void;
  onOpenAuth?: () => void;
  /** Показывать огонёк лояльности рядом с кабинетом. */
  flameDisplayEnabled?: boolean;
  /** Показывать кнопку избранного слева от профиля. */
  favoritesEnabled?: boolean;
}

export function RestaurantPublicHeader({
  restaurantId,
  restaurantName,
  logoUrl,
  logoWebpUrl,
  onOpenCart,
  onOpenAuth,
  flameDisplayEnabled = false,
  favoritesEnabled = false,
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

  function handleFlameClick() {
    handleProfileClick();
  }

  return (
    <header
      className={`glass-header glass-header--tenant${
        showHeaderCategoryNav ? ' glass-header--category-docked' : ''
      }`}
    >
      <div className="glass-header__brand">
        {logoUrl && (
          <ResponsiveImage
            className="glass-header__logo"
            src={logoUrl}
            webpSrc={logoWebpUrl}
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
        {flameDisplayEnabled && (
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
        )}
        {favoritesEnabled && (
          <RestaurantFavoritesHeaderButton href={paths.favorites} />
        )}
        <RestaurantGuestProfileButton
          authenticated={isGuestOfRestaurant}
          onClick={handleProfileClick}
        />
        {onOpenCart && (
          <RestaurantCartButton restaurantId={restaurantId} onOpen={onOpenCart} />
        )}
      </div>
    </header>
  );
}

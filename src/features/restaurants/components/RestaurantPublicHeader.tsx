'use client';

import { useRouter } from 'next/navigation';
import { ResponsiveImage } from '@/shared/components/ResponsiveImage';
import { useAuthHydrated } from '@/hooks/useAuthHydrated';
import { useRestaurantGuestPaths } from '@/shared/routing/restaurant-guest-path';
import { useAuthStore } from '@/store/auth.store';
import type { LoyaltySettings } from '@/shared/types/loyalty-settings';
import { useMenuCategoryNavOptional } from '../context/MenuCategoryNavContext';
import { LoyaltyFlameHeaderButton } from './LoyaltyFlameHeaderButton';
import { MenuCategoryNav } from './MenuCategoryNav';
import { RestaurantCartButton } from './RestaurantCartButton';
import { RestaurantFavoritesHeaderButton } from './RestaurantFavoritesHeaderButton';
import { RestaurantGuestProfileButton } from './RestaurantGuestProfileButton';
import { useGuestLoyaltyBalance } from '../hooks/useGuestLoyaltyBalance';
import { isLoyaltyFlameLit } from '../utils/loyalty-flame-info.util';

interface RestaurantPublicHeaderProps {
  restaurantId: string;
  restaurantName: string;
  logoUrl?: string | null;
  logoWebpUrl?: string | null;
  onOpenCart?: () => void;
  onOpenAuth?: () => void;
  onOpenFlameInfo?: () => void;
  loyaltyFlameLit?: boolean;
  /** Показывать огонёк лояльности рядом с кабинетом. */
  flameDisplayEnabled?: boolean;
  /** Показывать кнопку избранного слева от профиля. */
  favoritesEnabled?: boolean;
  useLocalLoyaltyFlameState?: boolean;
}

export function RestaurantPublicHeader({
  restaurantId,
  restaurantName,
  logoUrl,
  logoWebpUrl,
  onOpenCart,
  onOpenAuth,
  onOpenFlameInfo,
  loyaltyFlameLit: loyaltyFlameLitProp,
  flameDisplayEnabled = false,
  favoritesEnabled = false,
  useLocalLoyaltyFlameState = false,
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

  const { balance } = useGuestLoyaltyBalance(restaurantId, {
    enabled: useLocalLoyaltyFlameState && flameDisplayEnabled && isGuestOfRestaurant,
  });

  const localFlameLit =
    flameDisplayEnabled && isLoyaltyFlameLit(balance, isGuestOfRestaurant);
  const flameLit = useLocalLoyaltyFlameState
    ? localFlameLit
    : (loyaltyFlameLitProp ?? false);

  function handleProfileClick() {
    if (isGuestOfRestaurant) {
      router.push(paths.account);
      return;
    }

    onOpenAuth?.();
  }

  function handleFlameClick() {
    onOpenFlameInfo?.();
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
          <LoyaltyFlameHeaderButton lit={flameLit} onClick={handleFlameClick} />
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

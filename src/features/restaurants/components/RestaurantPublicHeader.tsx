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
import {
  resolveLoyaltyFlameExpiring,
  resolveLoyaltyFlameHeaderVisual,
  resolveLoyaltyFlameStreakDays,
  type LoyaltyFlameHeaderVisual,
} from '../utils/loyalty-flame-info.util';
import {
  resolveVenueHeaderActionOrder,
  type VenueHeaderActionId,
} from '../utils/venue-header-actions.order';

interface RestaurantPublicHeaderProps {
  restaurantId: string;
  restaurantName: string;
  logoUrl?: string | null;
  logoWebpUrl?: string | null;
  onOpenCart?: () => void;
  onOpenAuth?: () => void;
  onOpenFlameInfo?: () => void;
  loyaltyFlameVisual?: LoyaltyFlameHeaderVisual;
  loyaltyFlameStreakDays?: number;
  loyaltySettings?: LoyaltySettings;
  /** Показывать огонёк лояльности рядом с кабинетом. */
  flameDisplayEnabled?: boolean;
  /** Показывать кнопку избранного слева от корзины. */
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
  loyaltyFlameVisual: loyaltyFlameVisualProp,
  loyaltyFlameStreakDays: loyaltyFlameStreakDaysProp,
  loyaltySettings,
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

  const localFlameVisual =
    flameDisplayEnabled && loyaltySettings
      ? resolveLoyaltyFlameHeaderVisual(balance, loyaltySettings, isGuestOfRestaurant)
      : 'off';
  const flameVisual = useLocalLoyaltyFlameState
    ? localFlameVisual
    : (loyaltyFlameVisualProp ?? 'off');
  const localStreakDays =
    flameDisplayEnabled && isGuestOfRestaurant ? resolveLoyaltyFlameStreakDays(balance) : 0;
  const streakDays = useLocalLoyaltyFlameState
    ? localStreakDays
    : (loyaltyFlameStreakDaysProp ?? 0);
  const flameExpiring = useLocalLoyaltyFlameState
    ? resolveLoyaltyFlameExpiring(balance)
    : false;

  const actionOrder = resolveVenueHeaderActionOrder({
    flame: flameDisplayEnabled,
    favorites: favoritesEnabled,
    cart: Boolean(onOpenCart),
  });

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

  function renderHeaderAction(action: VenueHeaderActionId) {
    if (action === 'flame') {
      return (
        <LoyaltyFlameHeaderButton
          key="flame"
          visual={flameVisual}
          streakDays={streakDays}
          expiring={flameExpiring}
          onClick={handleFlameClick}
        />
      );
    }
    if (action === 'favorites') {
      return <RestaurantFavoritesHeaderButton key="favorites" href={paths.favorites} />;
    }
    if (action === 'cart' && onOpenCart) {
      return (
        <RestaurantCartButton key="cart" restaurantId={restaurantId} onOpen={onOpenCart} />
      );
    }
    return (
      <RestaurantGuestProfileButton
        key="profile"
        authenticated={isGuestOfRestaurant}
        onClick={handleProfileClick}
      />
    );
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
        {actionOrder.map((action) => renderHeaderAction(action))}
      </div>
    </header>
  );
}

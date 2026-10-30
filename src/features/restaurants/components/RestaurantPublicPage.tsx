'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useMemo, useState, type ReactNode } from 'react';
import { useAuthHydrated } from '@/hooks/useAuthHydrated';
import { useAuthStore } from '@/store/auth.store';
import { useGuestLoyaltyBalance } from '../hooks/useGuestLoyaltyBalance';
import type { PublicRestaurant } from '@/features/restaurants/types/restaurant';
import type { MenuResponse } from '@/shared/types/menu';
import type { RestaurantOrderSettings } from '@/shared/types/order-settings';
import type { RestaurantStyling } from '@/shared/types/restaurant-styling';
import type { BookingSettings } from '@/shared/types/booking-settings';
import type { LoyaltySettings } from '@/shared/types/loyalty-settings';
import { DEFAULT_LOYALTY_SETTINGS } from '@/shared/types/loyalty-settings';
import type { PromoBanner } from '@/shared/types/promo-banner';
import type { SocialLink } from '@/shared/types/social-link';
import { useRestaurantGuestPaths } from '@/shared/routing/restaurant-guest-path';
import { RestaurantStylingShell } from '../context/RestaurantStylingContext';
import { useVenueOverlayOptional } from '../context/VenueOverlayContext';
import { MenuCategoryNavProvider } from '../context/MenuCategoryNavContext';
import {
  getAvailableMenuCategories,
  toMenuCategoryNavItems,
} from '../utils/menu-catalog.util';
import { PromoBannerModalGate, PromoBannersHost } from './promo-banners.lazy';
import {
  LoyaltyFlameInfoModal,
  RestaurantCartModal,
  RestaurantGuestAuthModal,
} from './lazy-venue-modals';
const RestaurantMenuCatalog = dynamic(
  () => import('./RestaurantMenuCatalog').then((module) => module.RestaurantMenuCatalog),
);
const RestaurantMenuInlineCategoryNav = dynamic(
  () =>
    import('./RestaurantMenuInlineCategoryNav').then((module) => ({
      default: module.RestaurantMenuInlineCategoryNav,
    })),
);
import { VenueNavHeightSync } from './VenueNavHeightSync';
import { RestaurantPublicHeader } from './RestaurantPublicHeader';
import { RestaurantFooter } from './RestaurantFooter';
import '../styles/restaurant-public.scss';

interface RestaurantPublicPageProps {
  restaurant: PublicRestaurant;
  menu: MenuResponse;
  orderSettings: RestaurantOrderSettings;
  styling: RestaurantStyling;
  bookingSettings?: BookingSettings;
  socialLinks?: SocialLink[];
  promoBanners?: PromoBanner[];
  /** Server-rendered strip. When set, the client host does not paint a second one. */
  promoStrip?: ReactNode;
  loyaltySettings?: LoyaltySettings;
  embedded?: boolean;
}

function RestaurantPublicPageBody({
  restaurant,
  menu,
  orderSettings,
  styling,
  bookingSettings,
  socialLinks = [],
  promoBanners = [],
  promoStrip,
  loyaltySettings,
  embedded = false,
  categoryNavEnabled,
}: RestaurantPublicPageProps & { categoryNavEnabled: boolean }) {
  const paths = useRestaurantGuestPaths(restaurant.id, embedded);
  const venueOverlay = useVenueOverlayOptional();
  const hydrated = useAuthHydrated();
  const user = useAuthStore((s) => s.user);
  const isGuestOfRestaurant =
    hydrated && user?.role === 'user' && user.restaurantId === restaurant.id;
  const resolvedLoyaltySettings = loyaltySettings ?? {
    ...DEFAULT_LOYALTY_SETTINGS,
    restaurantId: restaurant.id,
    updatedAt: '',
  };
  const flameEnabled = resolvedLoyaltySettings.flameDisplayEnabled;
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [flameOpen, setFlameOpen] = useState(false);
  const bookingEnabled = bookingSettings?.bookingEnabled ?? false;
  const favoritesEnabled = styling.favoritesEnabled !== false;

  const { balance, loading, error, refresh } = useGuestLoyaltyBalance(restaurant.id, {
    enabled:
      flameEnabled &&
      isGuestOfRestaurant &&
      (embedded || flameOpen),
  });

  const openCart = embedded ? () => setCartOpen(true) : () => venueOverlay?.openCart();
  const openAuth = embedded ? () => setAuthOpen(true) : () => venueOverlay?.openAuth();
  const openFlameInfo = embedded
    ? () => {
        setFlameOpen(true);
        if (isGuestOfRestaurant) {
          void refresh();
        }
      }
    : () => venueOverlay?.openFlameInfo();

  const headerProps = {
    restaurantId: restaurant.id,
    restaurantName: restaurant.name,
    logoUrl: restaurant.logoUrl,
    logoWebpUrl: restaurant.logoWebpUrl,
    onOpenCart: embedded ? () => setCartOpen(true) : openCart,
    onOpenAuth: embedded ? () => setAuthOpen(true) : openAuth,
    onOpenFlameInfo: flameEnabled ? openFlameInfo : undefined,
    loyaltyFlameVisual: embedded ? undefined : venueOverlay?.loyaltyFlameVisual,
    loyaltySettings: resolvedLoyaltySettings,
    useLocalLoyaltyFlameState: embedded,
    flameDisplayEnabled: flameEnabled,
    favoritesEnabled: embedded ? false : favoritesEnabled,
  };

  return (
    <div
      className={`restaurant-public${embedded ? ' restaurant-public--embedded' : ''}`}
      data-testid="restaurant-public-page"
    >
      {embedded ? <RestaurantPublicHeader {...headerProps} /> : null}

      <main className="restaurant-public__main">
        <h1>{restaurant.name}</h1>
        <p className="restaurant-public__address">{restaurant.address}</p>

        {restaurant.description && (
          <p className="restaurant-public__description">{restaurant.description}</p>
        )}

        {promoStrip ?? (
          <PromoBannersHost banners={promoBanners} persistSeen={!embedded} />
        )}
        {promoStrip ? (
          <PromoBannerModalGate banners={promoBanners} persistSeen={!embedded} />
        ) : null}

        {!embedded && categoryNavEnabled ? (
          <div className="venue-home__category-nav" data-testid="venue-home-category-nav">
            <VenueNavHeightSync />
            <RestaurantMenuInlineCategoryNav />
          </div>
        ) : null}

        <RestaurantMenuCatalog
          restaurantId={restaurant.id}
          menu={menu}
          deferImages={promoBanners.some((banner) => banner.type === 'strip' && banner.isActive)}
        />

        {bookingEnabled && (
          <div className="restaurant-public__actions">
            <Link
              href={paths.booking}
              className="restaurant-public__btn"
              data-testid="cta-booking"
            >
              Забронировать стол
            </Link>
          </div>
        )}
      </main>

      <RestaurantFooter
        restaurant={restaurant}
        socialLinks={socialLinks}
        bookingEnabled={bookingEnabled}
        favoritesEnabled={favoritesEnabled}
      />

      {embedded && flameOpen && flameEnabled ? (
        <LoyaltyFlameInfoModal
          open
          onClose={() => setFlameOpen(false)}
          loyaltySettings={resolvedLoyaltySettings}
          balance={balance}
          balanceLoading={loading}
          balanceError={error}
          isGuestOfRestaurant={isGuestOfRestaurant}
        />
      ) : null}

      {embedded && authOpen && (
        <RestaurantGuestAuthModal
          restaurantId={restaurant.id}
          restaurantName={restaurant.name}
          onClose={() => setAuthOpen(false)}
        />
      )}

      {embedded && cartOpen && (
        <RestaurantCartModal
          restaurantId={restaurant.id}
          orderSettings={orderSettings}
          bookingEnabled={bookingEnabled}
          onClose={() => setCartOpen(false)}
          onOpenAuth={() => {
            setCartOpen(false);
            setAuthOpen(true);
          }}
        />
      )}
    </div>
  );
}

export function RestaurantPublicPage({
  restaurant,
  menu,
  orderSettings,
  styling,
  bookingSettings,
  socialLinks,
  promoBanners,
  promoStrip,
  loyaltySettings,
  embedded,
}: RestaurantPublicPageProps) {
  const navCategories = useMemo(
    () => toMenuCategoryNavItems(getAvailableMenuCategories(menu.categories)),
    [menu.categories],
  );

  const categoryNavEnabled =
    styling.menuCategoryNavEnabled && navCategories.length > 1;

  const navMode = embedded ? 'dock_in_header' : 'inline_only';

  const body = categoryNavEnabled ? (
    <MenuCategoryNavProvider categories={navCategories} mode={navMode}>
      <RestaurantPublicPageBody
        restaurant={restaurant}
        menu={menu}
        orderSettings={orderSettings}
        styling={styling}
        bookingSettings={bookingSettings}
        socialLinks={socialLinks}
        promoBanners={promoBanners}
        promoStrip={promoStrip}
        loyaltySettings={loyaltySettings}
        embedded={embedded}
        categoryNavEnabled
      />
    </MenuCategoryNavProvider>
  ) : (
    <RestaurantPublicPageBody
      restaurant={restaurant}
      menu={menu}
      orderSettings={orderSettings}
      styling={styling}
      bookingSettings={bookingSettings}
      socialLinks={socialLinks}
      promoBanners={promoBanners}
      promoStrip={promoStrip}
      loyaltySettings={loyaltySettings}
      embedded={embedded}
      categoryNavEnabled={false}
    />
  );

  if (embedded) {
    return (
      <RestaurantStylingShell styling={styling}>
        {body}
      </RestaurantStylingShell>
    );
  }

  return body;
}

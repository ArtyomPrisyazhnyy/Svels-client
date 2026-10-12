'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { PublicRestaurant } from '@/features/restaurants/types/restaurant';
import type { MenuResponse } from '@/shared/types/menu';
import type { RestaurantOrderSettings } from '@/shared/types/order-settings';
import type { RestaurantStyling } from '@/shared/types/restaurant-styling';
import type { BookingSettings } from '@/shared/types/booking-settings';
import type { LoyaltySettings } from '@/shared/types/loyalty-settings';
import type { PromoBanner } from '@/shared/types/promo-banner';
import type { SocialLink } from '@/shared/types/social-link';
import { ResponsiveImage } from '@/shared/components/ResponsiveImage';
import { useRestaurantGuestPaths } from '@/shared/routing/restaurant-guest-path';
import { RestaurantStylingShell } from '../context/RestaurantStylingContext';
import { useVenueOverlayOptional } from '../context/VenueOverlayContext';
import { MenuCategoryNavProvider } from '../context/MenuCategoryNavContext';
import {
  getAvailableMenuCategories,
  toMenuCategoryNavItems,
} from '../utils/menu-catalog.util';
import { PromoBannersHost } from './PromoBanners';
import { RestaurantCartModal } from './RestaurantCartModal';
import { RestaurantGuestAuthModal } from './RestaurantGuestAuthModal';
import { RestaurantMenuCatalog } from './RestaurantMenuCatalog';
import { RestaurantMenuInlineCategoryNav } from './RestaurantMenuInlineCategoryNav';
import { RestaurantPublicHeader } from './RestaurantPublicHeader';
import { RestaurantSocialLinks } from './RestaurantSocialLinks';
import '../styles/restaurant-public.scss';

interface RestaurantPublicPageProps {
  restaurant: PublicRestaurant;
  menu: MenuResponse;
  orderSettings: RestaurantOrderSettings;
  styling: RestaurantStyling;
  bookingSettings?: BookingSettings;
  socialLinks?: SocialLink[];
  promoBanners?: PromoBanner[];
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
  loyaltySettings,
  embedded = false,
  categoryNavEnabled,
}: RestaurantPublicPageProps & { categoryNavEnabled: boolean }) {
  const paths = useRestaurantGuestPaths(restaurant.id, embedded);
  const venueOverlay = useVenueOverlayOptional();
  const legalPath = paths.tenantMode
    ? '/legal'
    : `/restaurants/${restaurant.id}/legal`;
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const bookingEnabled = bookingSettings?.bookingEnabled ?? false;
  const favoritesEnabled = styling.favoritesEnabled !== false;

  const openCart = embedded ? () => setCartOpen(true) : () => venueOverlay?.openCart();
  const openAuth = embedded ? () => setAuthOpen(true) : () => venueOverlay?.openAuth();

  const headerProps = {
    restaurantId: restaurant.id,
    restaurantName: restaurant.name,
    logoUrl: restaurant.logoUrl,
    logoWebpUrl: restaurant.logoWebpUrl,
    onOpenCart: embedded ? () => setCartOpen(true) : openCart,
    onOpenAuth: embedded ? () => setAuthOpen(true) : openAuth,
    flameDisplayEnabled: loyaltySettings?.flameDisplayEnabled ?? false,
    favoritesEnabled: embedded ? false : favoritesEnabled,
  };

  return (
    <div
      className={`restaurant-public${embedded ? ' restaurant-public--embedded' : ''}`}
      data-testid="restaurant-public-page"
    >
      {embedded ? <RestaurantPublicHeader {...headerProps} /> : null}

      <main className="restaurant-public__main">
        {!embedded && categoryNavEnabled ? (
          <div className="venue-home__category-nav" data-testid="venue-home-category-nav">
            <RestaurantMenuInlineCategoryNav />
          </div>
        ) : null}

        <h1>{restaurant.name}</h1>
        <p className="restaurant-public__address">{restaurant.address}</p>

        {restaurant.description && (
          <p className="restaurant-public__description">{restaurant.description}</p>
        )}

        <PromoBannersHost banners={promoBanners} persistSeen={!embedded} />

        <RestaurantMenuCatalog restaurantId={restaurant.id} menu={menu} />

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

      <footer className="restaurant-public__footer">
        <div className="restaurant-public__footer-inner">
          <div className="restaurant-public__footer-brand">
            {restaurant.logoUrl && (
              <ResponsiveImage
                className="restaurant-public__footer-logo"
                src={restaurant.logoUrl}
                webpSrc={restaurant.logoWebpUrl}
                alt=""
              />
            )}
            <div className="restaurant-public__footer-brand-text">
              <span className="restaurant-public__footer-name">{restaurant.name}</span>
              {restaurant.description && (
                <p className="restaurant-public__footer-tagline">{restaurant.description}</p>
              )}
            </div>
          </div>

          <nav className="restaurant-public__footer-col">
            <span className="restaurant-public__footer-label">Навигация</span>
            {bookingEnabled && (
              <Link href={paths.booking} className="restaurant-public__footer-link">
                Бронирование стола
              </Link>
            )}
            {favoritesEnabled && (
              <Link href={paths.favorites} className="restaurant-public__footer-link">
                Избранное
              </Link>
            )}
            <Link href={paths.preOrder} className="restaurant-public__footer-link">
              Предзаказ
            </Link>
            <Link href={paths.account} className="restaurant-public__footer-link">
              Личный кабинет
            </Link>
            <Link
              href={legalPath}
              className="restaurant-public__footer-link"
              data-testid="restaurant-footer-legal"
            >
              Реквизиты и условия
            </Link>
          </nav>

          {socialLinks.length > 0 && (
            <div className="restaurant-public__footer-col restaurant-public__footer-social">
              <RestaurantSocialLinks links={socialLinks} />
            </div>
          )}
        </div>

        <div className="restaurant-public__footer-bottom">
          <span>
            © {new Date().getFullYear()} {restaurant.name} · {restaurant.address}
          </span>
          <span className="restaurant-public__footer-credit">Работает на Svels</span>
        </div>
      </footer>

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

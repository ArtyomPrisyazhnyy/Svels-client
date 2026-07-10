'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { PublicRestaurant } from '@/features/restaurants/types/restaurant';
import type { MenuResponse } from '@/shared/types/menu';
import type { RestaurantOrderSettings } from '@/shared/types/order-settings';
import type { RestaurantStyling } from '@/shared/types/restaurant-styling';
import type { BookingSettings } from '@/shared/types/booking-settings';
import type { SocialLink } from '@/shared/types/social-link';
import { resolveImageUrl } from '@/shared/types/menu';
import { useRestaurantGuestPaths } from '@/shared/routing/restaurant-guest-path';
import { RestaurantStylingShell } from '../context/RestaurantStylingContext';
import { MenuCategoryNavProvider } from '../context/MenuCategoryNavContext';
import {
  getAvailableMenuCategories,
  tempExpandMenuCategoryNavItems,
  toMenuCategoryNavItems,
} from '../utils/menu-catalog.util';
import { RestaurantCartModal } from './RestaurantCartModal';
import { RestaurantGuestAuthModal } from './RestaurantGuestAuthModal';
import { RestaurantMenuCatalog } from './RestaurantMenuCatalog';
import { RestaurantPublicHeader } from './RestaurantPublicHeader';
import { RestaurantPublicHeaderStack } from './RestaurantPublicHeaderStack';
import { RestaurantSocialLinks } from './RestaurantSocialLinks';
import '../styles/restaurant-public.scss';

interface RestaurantPublicPageProps {
  restaurant: PublicRestaurant;
  menu: MenuResponse;
  orderSettings: RestaurantOrderSettings;
  styling: RestaurantStyling;
  bookingSettings?: BookingSettings;
  socialLinks?: SocialLink[];
  embedded?: boolean;
}

function RestaurantPublicPageBody({
  restaurant,
  menu,
  orderSettings,
  bookingSettings,
  socialLinks = [],
  embedded = false,
  categoryNavEnabled,
}: RestaurantPublicPageProps & { categoryNavEnabled: boolean }) {
  const paths = useRestaurantGuestPaths(restaurant.id, embedded);
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const bookingEnabled = bookingSettings?.bookingEnabled ?? false;

  const headerProps = {
    restaurantId: restaurant.id,
    restaurantName: restaurant.name,
    logoUrl: restaurant.logoUrl,
    onOpenCart: embedded ? undefined : () => setCartOpen(true),
    onOpenAuth: embedded ? undefined : () => setAuthOpen(true),
  };

  return (
    <div className={`restaurant-public${embedded ? ' restaurant-public--embedded' : ''}`}>
      {categoryNavEnabled ? (
        <RestaurantPublicHeaderStack {...headerProps} />
      ) : (
        <RestaurantPublicHeader {...headerProps} />
      )}

      <main className="restaurant-public__main">
        <h1>{restaurant.name}</h1>
        <p className="restaurant-public__address">{restaurant.address}</p>

        {restaurant.description && (
          <p className="restaurant-public__description">{restaurant.description}</p>
        )}

        <RestaurantMenuCatalog restaurantId={restaurant.id} menu={menu} />

        <div className="restaurant-public__actions">
          {bookingEnabled && (
            <Link href={paths.booking} className="restaurant-public__btn">
              Забронировать стол
            </Link>
          )}
          <Link
            href={paths.preOrder}
            className={`restaurant-public__btn${bookingEnabled ? ' restaurant-public__btn--secondary' : ''}`}
          >
            Сделать предзаказ
          </Link>
        </div>
      </main>

      <footer className="restaurant-public__footer">
        <div className="restaurant-public__footer-inner">
          <div className="restaurant-public__footer-brand">
            {restaurant.logoUrl && (
              <img
                className="restaurant-public__footer-logo"
                src={resolveImageUrl(restaurant.logoUrl)}
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
            <Link href={paths.preOrder} className="restaurant-public__footer-link">
              Предзаказ
            </Link>
            <Link href={paths.account} className="restaurant-public__footer-link">
              Личный кабинет
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

      {!embedded && authOpen && (
        <RestaurantGuestAuthModal
          restaurantId={restaurant.id}
          restaurantName={restaurant.name}
          onClose={() => setAuthOpen(false)}
        />
      )}

      {!embedded && cartOpen && (
        <RestaurantCartModal
          restaurantId={restaurant.id}
          orderSettings={orderSettings}
          bookingEnabled={bookingEnabled}
          onClose={() => setCartOpen(false)}
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
  embedded,
}: RestaurantPublicPageProps) {
  const navCategories = useMemo(
    () =>
      tempExpandMenuCategoryNavItems(
        toMenuCategoryNavItems(getAvailableMenuCategories(menu.categories)),
      ),
    [menu.categories],
  );

  const categoryNavEnabled =
    styling.menuCategoryNavEnabled && navCategories.length > 1;

  return (
    <RestaurantStylingShell styling={styling}>
      {categoryNavEnabled ? (
        <MenuCategoryNavProvider categories={navCategories} mode="dock_in_header">
          <RestaurantPublicPageBody
            restaurant={restaurant}
            menu={menu}
            orderSettings={orderSettings}
            styling={styling}
            bookingSettings={bookingSettings}
            socialLinks={socialLinks}
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
          embedded={embedded}
          categoryNavEnabled={false}
        />
      )}
    </RestaurantStylingShell>
  );
}

'use client';

import Link from 'next/link';
import { ResponsiveImage } from '@/shared/components/ResponsiveImage';
import { useRestaurantGuestPaths } from '@/shared/routing/restaurant-guest-path';
import type { SocialLink } from '@/shared/types/social-link';
import type { PublicRestaurant } from '@/features/restaurants/types/restaurant';
import { RestaurantSocialLinks } from './RestaurantSocialLinks';

export interface RestaurantFooterRestaurant
  extends Pick<
    PublicRestaurant,
    'id' | 'name' | 'address' | 'description' | 'logoUrl' | 'logoWebpUrl'
  > {}

export interface RestaurantFooterProps {
  restaurant: RestaurantFooterRestaurant;
  socialLinks?: SocialLink[];
  bookingEnabled?: boolean;
  favoritesEnabled?: boolean;
}

export function RestaurantFooter({
  restaurant,
  socialLinks = [],
  bookingEnabled = false,
  favoritesEnabled = true,
}: RestaurantFooterProps) {
  const paths = useRestaurantGuestPaths(restaurant.id);
  const legalPath = paths.tenantMode ? '/legal' : `/restaurants/${restaurant.id}/legal`;

  return (
    <footer className="restaurant-public__footer" data-testid="restaurant-footer">
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
        <span className="restaurant-public__footer-credit">
          Работает на{' '}
          <Link
            href="/"
            className="restaurant-public__footer-credit-link"
            aria-label="Svels — главная"
            data-testid="restaurant-footer-svels-home"
          >
            Svels
          </Link>
        </span>
      </div>
    </footer>
  );
}

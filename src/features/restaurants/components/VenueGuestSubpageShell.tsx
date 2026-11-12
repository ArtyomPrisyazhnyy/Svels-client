'use client';

import type { ReactNode } from 'react';
import type { SocialLink } from '@/shared/types/social-link';
import type { PublicRestaurant } from '@/features/restaurants/types/restaurant';
import { RestaurantFooter } from './RestaurantFooter';
import '../styles/restaurant-public.scss';

interface VenueGuestSubpageShellProps {
  restaurant: PublicRestaurant;
  socialLinks: SocialLink[];
  bookingEnabled: boolean;
  favoritesEnabled: boolean;
  pageClassName: string;
  children: ReactNode;
}

export function VenueGuestSubpageShell({
  restaurant,
  socialLinks,
  bookingEnabled,
  favoritesEnabled,
  pageClassName,
  children,
}: VenueGuestSubpageShellProps) {
  return (
    <div className={`venue-subpage venue-subpage--with-footer ${pageClassName}`}>
      {children}
      <RestaurantFooter
        restaurant={restaurant}
        socialLinks={socialLinks}
        bookingEnabled={bookingEnabled}
        favoritesEnabled={favoritesEnabled}
      />
    </div>
  );
}

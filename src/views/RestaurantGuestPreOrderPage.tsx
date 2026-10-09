'use client';

import Link from 'next/link';
import { useRestaurantGuestPaths } from '@/shared/routing/restaurant-guest-path';
import { RestaurantStylingShell } from '@/features/restaurants/context/RestaurantStylingContext';
import { GuestOrdersList } from '@/features/restaurants/components/GuestOrdersList';
import type { RestaurantStyling } from '@/shared/types/restaurant-styling';
import '@/features/restaurants/styles/guest-orders-page.scss';

interface RestaurantGuestPreOrderPageProps {
  restaurantId: string;
  restaurantName: string;
  styling: RestaurantStyling;
}

export function RestaurantGuestPreOrderPage({
  restaurantId,
  restaurantName,
  styling,
}: RestaurantGuestPreOrderPageProps) {
  const paths = useRestaurantGuestPaths(restaurantId);

  return (
    <RestaurantStylingShell styling={styling}>
      <div className="guest-orders-page" data-testid="preorder-page">
        <header className="glass-header glass-header--tenant guest-orders-page__header">
          <Link
            href={paths.home}
            className="glass-header__link glass-header__link--accent guest-orders-page__back"
          >
            ← {restaurantName}
          </Link>
          <h1 className="glass-header__title">Мои заказы</h1>
        </header>
        <main className="guest-orders-page__main">
          <GuestOrdersList restaurantId={restaurantId} />
        </main>
      </div>
    </RestaurantStylingShell>
  );
}

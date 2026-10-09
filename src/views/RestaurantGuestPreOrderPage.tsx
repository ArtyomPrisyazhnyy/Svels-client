'use client';

import Link from 'next/link';
import { useRestaurantGuestPaths } from '@/shared/routing/restaurant-guest-path';
import { GuestOrdersList } from '@/features/restaurants/components/GuestOrdersList';
import '@/features/restaurants/styles/guest-orders-page.scss';

interface RestaurantGuestPreOrderPageProps {
  restaurantId: string;
  restaurantName: string;
}

export function RestaurantGuestPreOrderPage({
  restaurantId,
  restaurantName,
}: RestaurantGuestPreOrderPageProps) {
  const paths = useRestaurantGuestPaths(restaurantId);

  return (
    <div className="guest-orders-page" data-testid="preorder-page">
      <header className="glass-header glass-header--stacked guest-orders-page__header">
        <Link
          href={paths.home}
          className="glass-header__link glass-header__link--accent guest-orders-page__back"
        >
          ← {restaurantName}
        </Link>
        <h1>Мои заказы</h1>
      </header>
      <main className="guest-orders-page__main">
        <GuestOrdersList restaurantId={restaurantId} />
      </main>
    </div>
  );
}

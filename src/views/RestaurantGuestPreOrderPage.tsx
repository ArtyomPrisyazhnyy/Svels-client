'use client';

import Link from 'next/link';
import { useRestaurantGuestPaths } from '@/shared/routing/restaurant-guest-path';
import { useAuthStore } from '@/store/auth.store';
import '@/views/placeholder.scss';

interface RestaurantGuestPreOrderPageProps {
  restaurantId: string;
  restaurantName: string;
}

export function RestaurantGuestPreOrderPage({
  restaurantId,
  restaurantName,
}: RestaurantGuestPreOrderPageProps) {
  const user = useAuthStore((s) => s.user);
  const paths = useRestaurantGuestPaths(restaurantId);

  return (
    <div className="placeholder-page">
      <header className="glass-header glass-header--stacked placeholder-page__header">
        <Link
          href={paths.home}
          className="glass-header__link glass-header__link--accent placeholder-page__back"
        >
          ← {restaurantName}
        </Link>
        <h1>Предзаказ</h1>
      </header>
      <main className="placeholder-page__main">
        <p>
          Здравствуйте, {user?.firstName}! Раздел предзаказа в «{restaurantName}» в разработке —
          выбор блюд и оплата появятся в следующих версиях.
        </p>
      </main>
    </div>
  );
}

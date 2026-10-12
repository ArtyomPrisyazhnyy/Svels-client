'use client';

import { PageTitle } from '@/shared/ui/PageTitle/PageTitle';
import { GuestOrdersList } from '@/features/restaurants/components/GuestOrdersList';
import '@/features/restaurants/styles/guest-orders-page.scss';

interface RestaurantGuestPreOrderPageProps {
  restaurantId: string;
  restaurantName: string;
}

export function RestaurantGuestPreOrderPage({
  restaurantId,
}: RestaurantGuestPreOrderPageProps) {
  return (
    <div className="venue-subpage guest-orders-page" data-testid="preorder-page">
      <main className="venue-subpage__main guest-orders-page__main">
        <PageTitle title="Мои заказы" testId="preorder-page-title" />
        <GuestOrdersList restaurantId={restaurantId} />
      </main>
    </div>
  );
}

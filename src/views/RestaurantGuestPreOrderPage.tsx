'use client';

import { PageTitle } from '@/shared/ui/PageTitle/PageTitle';
import { Stack } from '@/shared/ui/Stack/Stack';
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
        <Stack gap={4} className="venue-subpage__stack">
          <PageTitle
            title="Мои заказы"
            testId="preorder-page-title"
            className="ui-page-title--venue"
          />
          <GuestOrdersList restaurantId={restaurantId} />
        </Stack>
      </main>
    </div>
  );
}

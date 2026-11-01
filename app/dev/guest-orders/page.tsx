'use client';

import { notFound } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { RestaurantGuestPreOrderPage } from '@/views/RestaurantGuestPreOrderPage';
import { RestaurantStylingShell } from '@/features/restaurants/context/RestaurantStylingContext';
import { VenueOverlayProvider } from '@/features/restaurants/context/VenueOverlayContext';
import { VenueHeader } from '@/shared/ui/VenueHeader/VenueHeader';
import {
  DEFAULT_RESTAURANT_STYLING,
  RESTAURANT_COLOR_THEME_OPTIONS,
  type RestaurantColorTheme,
} from '@/shared/types/restaurant-styling';
import { DEFAULT_LOYALTY_SETTINGS } from '@/shared/types/loyalty-settings';
import type { RestaurantOrderSettings } from '@/shared/types/order-settings';
import '@/features/restaurants/styles/venue-layout.scss';

export const CAPTURE_RESTAURANT_ID = '00000000-0000-4000-8000-000000000001';

const CAPTURE_ORDER_SETTINGS: RestaurantOrderSettings = {
  restaurantId: CAPTURE_RESTAURANT_ID,
  fulfillmentDelivery: true,
  fulfillmentTakeaway: true,
  fulfillmentDineIn: true,
  paymentCash: true,
  paymentCardOnSite: true,
  paymentOnline: true,
  deliveryForSomeoneElse: false,
  updatedAt: '2026-01-01T00:00:00.000Z',
};

const CAPTURE_LOYALTY_SETTINGS = {
  ...DEFAULT_LOYALTY_SETTINGS,
  restaurantId: CAPTURE_RESTAURANT_ID,
  flameDisplayEnabled: true,
  flameRewardsEnabled: true,
  updatedAt: '2026-01-01T00:00:00.000Z',
};

function parseTheme(value: string | null): RestaurantColorTheme {
  const themes = RESTAURANT_COLOR_THEME_OPTIONS.map((option) => option.value);
  if (value && themes.includes(value as RestaurantColorTheme)) {
    return value as RestaurantColorTheme;
  }
  return 'classic';
}

export default function DevGuestOrdersCapturePage() {
  if (process.env.NODE_ENV !== 'development') {
    notFound();
  }

  const searchParams = useSearchParams();
  const theme = parseTheme(searchParams.get('theme'));

  const styling = useMemo(
    () => ({
      ...DEFAULT_RESTAURANT_STYLING,
      restaurantId: CAPTURE_RESTAURANT_ID,
      updatedAt: '2026-01-01T00:00:00.000Z',
      colorTheme: theme,
    }),
    [theme],
  );

  return (
    <RestaurantStylingShell styling={styling}>
      <VenueOverlayProvider
        restaurantId={CAPTURE_RESTAURANT_ID}
        restaurantName="E2E Cafe"
        orderSettings={CAPTURE_ORDER_SETTINGS}
        bookingEnabled={false}
        loyaltySettings={CAPTURE_LOYALTY_SETTINGS}
      >
        <div className="venue-layout" data-testid="guest-orders-capture-page">
          <VenueHeader
            restaurantId={CAPTURE_RESTAURANT_ID}
            restaurantName="E2E Cafe"
            flameDisplayEnabled
            favoritesEnabled
          />
          <div className="venue-layout__content">
            <RestaurantGuestPreOrderPage
              restaurantId={CAPTURE_RESTAURANT_ID}
              restaurantName="E2E Cafe"
            />
          </div>
        </div>
      </VenueOverlayProvider>
    </RestaurantStylingShell>
  );
}

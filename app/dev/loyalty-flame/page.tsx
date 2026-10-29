'use client';

import { notFound } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { LoyaltyFlameInfoModal } from '@/features/restaurants/components/LoyaltyFlameInfoModal';
import { LoyaltyFlameHeaderButton } from '@/features/restaurants/components/LoyaltyFlameHeaderButton';
import { RestaurantStylingShell } from '@/features/restaurants/context/RestaurantStylingContext';
import type { LoyaltyBalance } from '@/shared/types/loyalty-balance';
import type { LoyaltySettings } from '@/shared/types/loyalty-settings';
import {
  DEFAULT_RESTAURANT_STYLING,
  type RestaurantColorTheme,
} from '@/shared/types/restaurant-styling';
import '@/features/restaurants/styles/venue-layout.scss';
import '@/features/restaurants/styles/dev-loyalty-flame-capture.scss';
import '@/shared/ui/VenueHeader/VenueHeader.scss';

const CAPTURE_SETTINGS: LoyaltySettings = {
  restaurantId: '00000000-0000-4000-8000-000000000001',
  flameDisplayEnabled: true,
  flameRewardsEnabled: true,
  flameExpireDays: 14,
  flameLevels: [
    {
      id: 'level-1',
      name: 'Искра',
      requiredVisits: 3,
      rewards: [
        {
          id: 'reward-1',
          type: 'percent_discount',
          title: 'Скидка 5% на заказ',
          description: null,
          percentOff: 5,
          amountOff: null,
          menuItemId: null,
          minOrderAmount: null,
        },
      ],
    },
    {
      id: 'level-2',
      name: 'Пламя',
      requiredVisits: 7,
      rewards: [],
    },
  ],
  otherPrograms: [],
  updatedAt: '2026-01-01T00:00:00.000Z',
};

const ACTIVE_BALANCE: LoyaltyBalance = {
  restaurantId: CAPTURE_SETTINGS.restaurantId,
  userId: '00000000-0000-4000-8000-000000000099',
  enabled: true,
  rewardsEnabled: true,
  visits: 4,
  totalVisits: 12,
  lastVisitAt: '2026-10-20T12:00:00.000Z',
  expiresAt: '2026-11-03T12:00:00.000Z',
  currentLevel: { id: 'level-1', name: 'Искра', requiredVisits: 3 },
  nextLevel: {
    id: 'level-2',
    name: 'Пламя',
    requiredVisits: 7,
    visitsLeft: 3,
  },
  availableRewards: CAPTURE_SETTINGS.flameLevels[0]?.rewards ?? [],
};

const IDLE_BALANCE: LoyaltyBalance = {
  restaurantId: CAPTURE_SETTINGS.restaurantId,
  userId: '00000000-0000-4000-8000-000000000099',
  enabled: true,
  rewardsEnabled: true,
  visits: 0,
  totalVisits: 5,
  lastVisitAt: null,
  expiresAt: null,
  currentLevel: null,
  nextLevel: {
    id: 'level-1',
    name: 'Искра',
    requiredVisits: 3,
    visitsLeft: 3,
  },
  availableRewards: [],
};

function parseTheme(value: string | null): RestaurantColorTheme {
  if (value === 'midnight') {
    return 'midnight';
  }
  return 'classic';
}

function parseGuestState(value: string | null): 'active' | 'idle' {
  return value === 'idle' ? 'idle' : 'active';
}

export default function DevLoyaltyFlameCapturePage() {
  if (process.env.NODE_ENV !== 'development') {
    notFound();
  }

  const searchParams = useSearchParams();
  const theme = parseTheme(searchParams.get('theme'));
  const guestState = parseGuestState(searchParams.get('state'));
  const [flameOpen, setFlameOpen] = useState(false);

  const balance = guestState === 'active' ? ACTIVE_BALANCE : IDLE_BALANCE;
  const flameLit = balance.visits > 0;

  const styling = useMemo(
    () => ({
      ...DEFAULT_RESTAURANT_STYLING,
      restaurantId: CAPTURE_SETTINGS.restaurantId,
      updatedAt: CAPTURE_SETTINGS.updatedAt,
      colorTheme: theme,
    }),
    [theme],
  );

  return (
    <RestaurantStylingShell styling={styling} className="dev-loyalty-flame-capture">
      <div className="venue-layout" data-testid="loyalty-flame-capture-page">
        <header
          className="venue-header venue-header--tenant glass-header glass-header--tenant"
          data-testid="venue-header"
        >
          <span className="glass-header__brand-name">E2E Cafe</span>
          <div className="venue-header__actions" data-testid="venue-header-actions">
            <div className="venue-header__action-slot">
              <LoyaltyFlameHeaderButton lit={flameLit} onClick={() => setFlameOpen(true)} />
            </div>
          </div>
        </header>
        <div className="venue-layout__content">
          <main className="dev-loyalty-flame-capture__main">
            <h1 className="dev-loyalty-flame-capture__title">Меню</h1>
            <p className="dev-loyalty-flame-capture__hint">
              Демо-страница заведения для скриншотов модалки огонька.
            </p>
          </main>
        </div>
        {flameOpen ? (
          <LoyaltyFlameInfoModal
            open
            onClose={() => setFlameOpen(false)}
            loyaltySettings={CAPTURE_SETTINGS}
            balance={balance}
            balanceLoading={false}
            balanceError={null}
            isGuestOfRestaurant
          />
        ) : null}
      </div>
    </RestaurantStylingShell>
  );
}

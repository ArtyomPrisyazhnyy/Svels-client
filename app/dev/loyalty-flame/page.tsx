'use client';

import { notFound } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { LoyaltyFlameInfoModal } from '@/features/restaurants/components/LoyaltyFlameInfoModal';
import { LoyaltyFlameHeaderButton } from '@/features/restaurants/components/LoyaltyFlameHeaderButton';
import { RestaurantCartButton } from '@/features/restaurants/components/RestaurantCartButton';
import { RestaurantFavoritesHeaderButton } from '@/features/restaurants/components/RestaurantFavoritesHeaderButton';
import { RestaurantGuestProfileButton } from '@/features/restaurants/components/RestaurantGuestProfileButton';
import { RestaurantStylingShell } from '@/features/restaurants/context/RestaurantStylingContext';
import type { LoyaltyBalance } from '@/shared/types/loyalty-balance';
import type { LoyaltySettings } from '@/shared/types/loyalty-settings';
import {
  DEFAULT_RESTAURANT_STYLING,
  RESTAURANT_COLOR_THEME_OPTIONS,
  type RestaurantColorTheme,
  type RestaurantHeaderStyle,
} from '@/shared/types/restaurant-styling';
import type { LoyaltyFlameHeaderVisual } from '@/features/restaurants/utils/loyalty-flame-info.util';
import '@/features/restaurants/styles/venue-layout.scss';
import '@/features/restaurants/styles/dev-loyalty-flame-capture.scss';
import '@/shared/ui/VenueHeader/VenueHeader.scss';
import '@/shared/styles/glass-header.scss';

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
    {
      id: 'level-3',
      name: 'Жар',
      requiredVisits: 14,
      rewards: [],
    },
    {
      id: 'level-4',
      name: 'Пожар',
      requiredVisits: 21,
      rewards: [],
    },
    {
      id: 'level-5',
      name: 'Супернова',
      requiredVisits: 30,
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

const HEADER_STATE_SAMPLES: { label: string; visual: LoyaltyFlameHeaderVisual }[] = [
  { label: 'off', visual: 'off' },
  { label: 'base', visual: 'base' },
  { label: 'tier 1', visual: 1 },
  { label: 'tier 2', visual: 2 },
  { label: 'tier 3', visual: 3 },
  { label: 'tier 4', visual: 4 },
  { label: 'tier 5', visual: 5 },
];

const ALL_COLOR_THEMES = RESTAURANT_COLOR_THEME_OPTIONS.map((option) => option.value);

const HEADER_STYLES: RestaurantHeaderStyle[] = ['glass', 'solid', 'bordered'];

const MATRIX_THEME_PARTS: RestaurantColorTheme[][] = [
  ['classic', 'ocean', 'forest', 'warm', 'berry', 'lavender'],
  ['sand', 'citrus', 'graphite', 'monochrome', 'monochromeDark', 'midnight'],
  ['ember', 'obsidian', 'moss', 'wine', 'neon'],
];

type CaptureView = 'default' | 'states' | 'matrix' | 'header-bar';

function parseTheme(value: string | null): RestaurantColorTheme {
  if (value && ALL_COLOR_THEMES.includes(value as RestaurantColorTheme)) {
    return value as RestaurantColorTheme;
  }
  return 'classic';
}

function parseGuestState(value: string | null): 'active' | 'idle' {
  return value === 'idle' ? 'idle' : 'active';
}

function parseView(value: string | null): CaptureView {
  if (value === 'states' || value === 'matrix' || value === 'header-bar') {
    return value;
  }
  return 'default';
}

function parseMatrixPart(value: string | null): 1 | 2 | 3 {
  if (value === '2') {
    return 2;
  }
  if (value === '3') {
    return 3;
  }
  return 1;
}

function FlameStatesOnHeader({ testIdPrefix }: { testIdPrefix?: string }) {
  return (
    <header
      className="venue-header venue-header--tenant glass-header glass-header--tenant dev-loyalty-flame-capture__matrix-header"
      data-testid={testIdPrefix ? `${testIdPrefix}-header` : undefined}
    >
      <div className="dev-loyalty-flame-capture__matrix-states">
        {HEADER_STATE_SAMPLES.map((sample) => (
          <div key={sample.label} className="dev-loyalty-flame-capture__matrix-state">
            <LoyaltyFlameHeaderButton visual={sample.visual} onClick={() => {}} />
          </div>
        ))}
      </div>
    </header>
  );
}

function MatrixRow({
  colorTheme,
  headerStyle,
}: {
  colorTheme: RestaurantColorTheme;
  headerStyle: RestaurantHeaderStyle;
}) {
  const styling = useMemo(
    () => ({
      ...DEFAULT_RESTAURANT_STYLING,
      restaurantId: CAPTURE_SETTINGS.restaurantId,
      updatedAt: CAPTURE_SETTINGS.updatedAt,
      colorTheme,
      headerStyle,
    }),
    [colorTheme, headerStyle],
  );

  const themeLabel =
    RESTAURANT_COLOR_THEME_OPTIONS.find((option) => option.value === colorTheme)?.label ??
    colorTheme;

  return (
    <RestaurantStylingShell styling={styling} className="dev-loyalty-flame-capture__matrix-shell">
      <div
        className="dev-loyalty-flame-capture__matrix-row"
        data-testid={`loyalty-flame-matrix-row-${colorTheme}-${headerStyle}`}
      >
        <div className="dev-loyalty-flame-capture__matrix-label">
          <span>{themeLabel}</span>
          <span className="dev-loyalty-flame-capture__matrix-label-meta">{headerStyle}</span>
        </div>
        <FlameStatesOnHeader />
      </div>
    </RestaurantStylingShell>
  );
}

function VenueHeaderActionsDemo({ flameVisual }: { flameVisual: LoyaltyFlameHeaderVisual }) {
  return (
    <div className="venue-header__actions" data-testid="venue-header-actions">
      <div className="venue-header__action-slot">
        <LoyaltyFlameHeaderButton visual={flameVisual} onClick={() => {}} />
      </div>
      <div className="venue-header__action-slot">
        <RestaurantFavoritesHeaderButton href="#" />
      </div>
      <div className="venue-header__action-slot">
        <RestaurantGuestProfileButton authenticated onClick={() => {}} />
      </div>
      <div className="venue-header__action-slot">
        <RestaurantCartButton restaurantId={CAPTURE_SETTINGS.restaurantId} onOpen={() => {}} />
      </div>
    </div>
  );
}

export default function DevLoyaltyFlameCapturePage() {
  if (process.env.NODE_ENV !== 'development') {
    notFound();
  }

  const searchParams = useSearchParams();
  const theme = parseTheme(searchParams.get('theme'));
  const guestState = parseGuestState(searchParams.get('state'));
  const view = parseView(searchParams.get('view'));
  const matrixPart = parseMatrixPart(searchParams.get('part'));
  const [flameOpen, setFlameOpen] = useState(false);

  const balance = guestState === 'idle' ? IDLE_BALANCE : ACTIVE_BALANCE;

  const headerVisual: LoyaltyFlameHeaderVisual =
    balance.visits <= 0 ? 'off' : balance.currentLevel ? 1 : 'base';

  const styling = useMemo(
    () => ({
      ...DEFAULT_RESTAURANT_STYLING,
      restaurantId: CAPTURE_SETTINGS.restaurantId,
      updatedAt: CAPTURE_SETTINGS.updatedAt,
      colorTheme: theme,
    }),
    [theme],
  );

  if (view === 'matrix') {
    const themesForPart = MATRIX_THEME_PARTS[matrixPart - 1] ?? MATRIX_THEME_PARTS[0];

    return (
      <div className="dev-loyalty-flame-capture dev-loyalty-flame-capture--matrix-root">
        <div className="dev-loyalty-flame-capture__matrix-legend" data-testid="loyalty-flame-contrast-matrix">
          <h1 className="dev-loyalty-flame-capture__title">
            Огонёк — контраст на шапке (часть {matrixPart}/3)
          </h1>
          <ul className="dev-loyalty-flame-capture__matrix-columns">
            {HEADER_STATE_SAMPLES.map((sample) => (
              <li key={sample.label}>{sample.label}</li>
            ))}
          </ul>
        </div>
        {themesForPart.map((colorTheme) =>
          HEADER_STYLES.map((headerStyle) => (
            <MatrixRow key={`${colorTheme}-${headerStyle}`} colorTheme={colorTheme} headerStyle={headerStyle} />
          )),
        )}
      </div>
    );
  }

  return (
    <RestaurantStylingShell styling={styling} className="dev-loyalty-flame-capture">
      <div className="venue-layout" data-testid="loyalty-flame-capture-page">
        <header
          className="venue-header venue-header--tenant glass-header glass-header--tenant"
          data-testid="venue-header"
        >
          <span className="glass-header__brand-name">E2E Cafe</span>
          {view === 'header-bar' ? (
            <VenueHeaderActionsDemo flameVisual={headerVisual} />
          ) : (
            <div className="venue-header__actions" data-testid="venue-header-actions">
              <div className="venue-header__action-slot">
                <LoyaltyFlameHeaderButton
                  visual={view === 'states' ? 'off' : headerVisual}
                  onClick={() => setFlameOpen(true)}
                />
              </div>
            </div>
          )}
        </header>
        <div className="venue-layout__content">
          <main className="dev-loyalty-flame-capture__main">
            {view === 'states' ? (
              <section
                className="dev-loyalty-flame-capture__states"
                data-testid="loyalty-flame-states-showcase"
              >
                <h1 className="dev-loyalty-flame-capture__title">Огонёк — все состояния</h1>
                <ul className="dev-loyalty-flame-capture__states-grid">
                  {HEADER_STATE_SAMPLES.map((sample) => (
                    <li key={sample.label} className="dev-loyalty-flame-capture__states-item">
                      <LoyaltyFlameHeaderButton visual={sample.visual} onClick={() => {}} />
                      <span>{sample.label}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : (
              <>
                <h1 className="dev-loyalty-flame-capture__title">Меню</h1>
                <p className="dev-loyalty-flame-capture__hint">
                  Демо-страница заведения для скриншотов модалки огонька.
                </p>
              </>
            )}
          </main>
        </div>
        {flameOpen ? (
          <LoyaltyFlameInfoModal
            open
            onClose={() => setFlameOpen(false)}
            loyaltySettings={CAPTURE_SETTINGS}
            balance={view === 'states' ? ACTIVE_BALANCE : balance}
            balanceLoading={false}
            balanceError={null}
            isGuestOfRestaurant
          />
        ) : null}
      </div>
    </RestaurantStylingShell>
  );
}

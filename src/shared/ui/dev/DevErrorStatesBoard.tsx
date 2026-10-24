'use client';

import {
  DEFAULT_RESTAURANT_STYLING,
  type RestaurantColorTheme,
} from '@/shared/types/restaurant-styling';
import { RestaurantStylingShell } from '@/features/restaurants/context/RestaurantStylingContext';
import { FriendlyErrorPanel } from '@/shared/components/FriendlyErrorPanel';
import { GENERIC_ERROR_COPY, NETWORK_ERROR_COPY } from '@/lib/errors/messages';

import { ALL_RESTAURANT_COLOR_THEMES } from '@/shared/design-tokens/color-themes';

const PLAYGROUND_THEMES: RestaurantColorTheme[] = [...ALL_RESTAURANT_COLOR_THEMES];

function resolveTheme(theme: string): RestaurantColorTheme {
  if (PLAYGROUND_THEMES.includes(theme as RestaurantColorTheme)) {
    return theme as RestaurantColorTheme;
  }

  return 'classic';
}

interface DevErrorStatesBoardProps {
  theme: string;
  variant: 'network' | 'server';
}

export function DevErrorStatesBoard({ theme, variant }: DevErrorStatesBoardProps) {
  const colorTheme = resolveTheme(theme);
  const copy = variant === 'network' ? NETWORK_ERROR_COPY : GENERIC_ERROR_COPY;

  const styling = {
    restaurantId: 'dev-error-states',
    ...DEFAULT_RESTAURANT_STYLING,
    fontFamily: 'inter' as const,
    colorTheme,
    updatedAt: new Date(0).toISOString(),
  };

  return (
    <RestaurantStylingShell styling={styling} enableScrollToTop={false}>
      <FriendlyErrorPanel copy={copy} onRetry={() => undefined} testId={`dev-error-${variant}`} />
    </RestaurantStylingShell>
  );
}

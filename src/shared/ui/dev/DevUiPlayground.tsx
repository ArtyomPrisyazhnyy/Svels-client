'use client';

import {
  DEFAULT_RESTAURANT_STYLING,
  RESTAURANT_COLOR_THEME_OPTIONS,
  type RestaurantColorTheme,
} from '@/shared/types/restaurant-styling';
import { RestaurantStylingShell } from '@/features/restaurants/context/RestaurantStylingContext';
import { UiTokensBoard } from '@/shared/ui/dev/UiTokensBoard';
import { UiPrimitivesBoard } from '@/shared/ui/dev/UiPrimitivesBoard';
import { Stack } from '@/shared/ui/Stack/Stack';
import './dev-ui-playground.scss';

const PLAYGROUND_THEMES: RestaurantColorTheme[] = RESTAURANT_COLOR_THEME_OPTIONS.map(
  (option) => option.value,
);

function resolveTheme(theme: string): RestaurantColorTheme {
  if (PLAYGROUND_THEMES.includes(theme as RestaurantColorTheme)) {
    return theme as RestaurantColorTheme;
  }

  return 'classic';
}

interface DevUiPlaygroundProps {
  theme: string;
}

export function DevUiPlayground({ theme }: DevUiPlaygroundProps) {
  const colorTheme = resolveTheme(theme);

  const styling = {
    restaurantId: 'dev-ui-playground',
    ...DEFAULT_RESTAURANT_STYLING,
    fontFamily: 'inter' as const,
    colorTheme,
    updatedAt: new Date(0).toISOString(),
  };

  return (
    <RestaurantStylingShell styling={styling} enableScrollToTop={false}>
      <Stack gap={8} className="dev-ui-playground__stack">
        <UiTokensBoard />
        <UiPrimitivesBoard />
      </Stack>
    </RestaurantStylingShell>
  );
}

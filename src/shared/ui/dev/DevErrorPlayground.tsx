import {
  DEFAULT_RESTAURANT_STYLING,
  type RestaurantColorTheme,
} from '@/shared/types/restaurant-styling';
import { ALL_RESTAURANT_COLOR_THEMES } from '@/shared/design-tokens/color-themes';
import {
  buildRestaurantStylingVars,
  getRestaurantStylingDomProps,
} from '@/features/restaurants/utils/restaurant-styling.util';
import { RESTAURANT_FONT_CLASSES } from '@/features/restaurants/fonts/restaurant-fonts';
import { FriendlyErrorPanel } from '@/shared/components/FriendlyErrorPanel';
import { GENERIC_ERROR_COPY, NETWORK_ERROR_COPY } from '@/lib/errors/messages';
import { ThemeDocumentVars } from '@/shared/ui/dev/ThemeDocumentVars';
import '@/features/restaurants/styles/restaurant-styling-fonts.scss';
import '@/features/restaurants/styles/restaurant-styling-theme.scss';
import '@/shared/ui/dev/dev-error-playground.scss';

const PLAYGROUND_THEMES = new Set<string>(ALL_RESTAURANT_COLOR_THEMES);

function resolveTheme(theme: string): RestaurantColorTheme {
  if (PLAYGROUND_THEMES.has(theme)) {
    return theme as RestaurantColorTheme;
  }
  return 'classic';
}

interface DevErrorPlaygroundProps {
  theme: string;
  variant: 'network' | 'server';
}

export function DevErrorPlayground({ theme, variant }: DevErrorPlaygroundProps) {
  const colorTheme = resolveTheme(theme);
  const copy = variant === 'network' ? NETWORK_ERROR_COPY : GENERIC_ERROR_COPY;

  const styling = {
    restaurantId: 'dev-error-states',
    ...DEFAULT_RESTAURANT_STYLING,
    fontFamily: 'inter' as const,
    colorTheme,
    updatedAt: new Date(0).toISOString(),
  };

  const cssVars = buildRestaurantStylingVars(styling);
  const domProps = getRestaurantStylingDomProps(styling);
  const cssVarEntries = Object.entries(cssVars).map(
    ([name, value]) => [name, String(value)] as const,
  );

  const rootClassName = ['restaurant-styled', 'dev-error-playground', RESTAURANT_FONT_CLASSES]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <ThemeDocumentVars theme={colorTheme} cssVarEntries={cssVarEntries} />
      <div
        className={rootClassName}
        style={cssVars}
        data-rs-theme={colorTheme}
        data-testid="dev-error-playground-root"
        {...domProps}
      >
        <FriendlyErrorPanel copy={copy} testId={`dev-error-${variant}`} />
      </div>
    </>
  );
}

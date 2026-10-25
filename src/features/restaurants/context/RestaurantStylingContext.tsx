'use client';

import { createContext, useContext, type CSSProperties, type ReactNode } from 'react';
import {
  DEFAULT_RESTAURANT_STYLING,
  type RestaurantCurrencyDisplay,
  type RestaurantStyling,
} from '@/shared/types/restaurant-styling';
import {
  buildRestaurantStylingVars,
  getRestaurantStylingDomProps,
} from '@/features/restaurants/utils/restaurant-styling.util';
import { RESTAURANT_FONT_CLASSES } from '@/features/restaurants/fonts/restaurant-fonts';
import { RestaurantStylingScrollToTop } from '@/features/restaurants/components/RestaurantStylingScrollToTop';
import '@/features/restaurants/styles/restaurant-styling-fonts.scss';
import '@/features/restaurants/styles/restaurant-styling-theme.scss';

interface RestaurantStylingContextValue {
  styling: RestaurantStyling;
  currencyDisplay: RestaurantCurrencyDisplay;
}

const RestaurantStylingContext = createContext<RestaurantStylingContextValue | null>(null);

interface RestaurantStylingShellProps {
  styling: RestaurantStyling;
  children: ReactNode;
  className?: string;
  /** Один класс next/font для активного шрифта (публичные страницы). */
  fontVariableClass?: string;
  /** true — подключить все паки шрифтов (превью в админке). */
  loadAllRestaurantFonts?: boolean;
  /** false — для встроенного превью в админке (кнопка не уходит в body). */
  enableScrollToTop?: boolean;
}

function RestaurantStylingRoot({
  styling,
  className,
  children,
  fontVariableClass,
  loadAllRestaurantFonts,
}: {
  styling: RestaurantStyling;
  className?: string;
  children: ReactNode;
  fontVariableClass?: string;
  loadAllRestaurantFonts?: boolean;
}) {
  const cssVars = buildRestaurantStylingVars(styling) as CSSProperties;
  const domProps = getRestaurantStylingDomProps(styling);
  const fontClasses = loadAllRestaurantFonts
    ? RESTAURANT_FONT_CLASSES
    : (fontVariableClass ?? '');
  const rootClassName = ['restaurant-styled', fontClasses, className].filter(Boolean).join(' ');

  return (
    <div
      className={rootClassName}
      style={cssVars}
      data-rs-theme={styling.colorTheme}
      {...domProps}
    >
      {children}
    </div>
  );
}

export function RestaurantStylingShell({
  styling,
  children,
  className,
  fontVariableClass,
  loadAllRestaurantFonts = false,
  enableScrollToTop = true,
}: RestaurantStylingShellProps) {
  return (
    <RestaurantStylingContext.Provider
      value={{
        styling,
        currencyDisplay: styling.currencyDisplay,
      }}
    >
      <RestaurantStylingRoot
        styling={styling}
        className={className}
        fontVariableClass={fontVariableClass}
        loadAllRestaurantFonts={loadAllRestaurantFonts}
      >
        {children}
        {enableScrollToTop ? <RestaurantStylingScrollToTop /> : null}
      </RestaurantStylingRoot>
    </RestaurantStylingContext.Provider>
  );
}

export function RestaurantStylingPortalRoot({ children }: { children: ReactNode }) {
  const context = useContext(RestaurantStylingContext);

  if (!context) {
    return <>{children}</>;
  }

  return (
    <RestaurantStylingRoot styling={context.styling} className="restaurant-styled--portal">
      {children}
    </RestaurantStylingRoot>
  );
}

export function useRestaurantStylingOptional(): RestaurantStylingContextValue {
  const context = useContext(RestaurantStylingContext);

  return (
    context ?? {
      styling: {
        restaurantId: '',
        ...DEFAULT_RESTAURANT_STYLING,
        updatedAt: '',
      },
      currencyDisplay: DEFAULT_RESTAURANT_STYLING.currencyDisplay,
    }
  );
}

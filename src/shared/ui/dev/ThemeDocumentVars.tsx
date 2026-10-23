'use client';

import { useLayoutEffect } from 'react';
import type { RestaurantColorTheme } from '@/shared/types/restaurant-styling';

interface ThemeDocumentVarsProps {
  theme: RestaurantColorTheme;
  cssVarEntries: ReadonlyArray<readonly [string, string]>;
}

export function ThemeDocumentVars({ theme, cssVarEntries }: ThemeDocumentVarsProps) {
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-rs-theme', theme);
    for (const [name, value] of cssVarEntries) {
      root.style.setProperty(name, value);
    }

    return () => {
      root.removeAttribute('data-rs-theme');
      for (const [name] of cssVarEntries) {
        root.style.removeProperty(name);
      }
    };
  }, [theme, cssVarEntries]);

  return null;
}

'use client';

import { useLayoutEffect } from 'react';

const VENUE_NAV_SELECTOR = '[data-testid="venue-home-category-nav"]';

function syncVenueNavHeight(): void {
  const nav = document.querySelector(VENUE_NAV_SELECTOR);
  if (!(nav instanceof HTMLElement)) {
    return;
  }

  document.documentElement.style.setProperty(
    '--venue-nav-h',
    `${nav.getBoundingClientRect().height}px`,
  );
}

/** Writes the sticky category nav's border box into `--venue-nav-h` for scroll-margin. */
export function VenueNavHeightSync() {
  useLayoutEffect(() => {
    syncVenueNavHeight();

    const nav = document.querySelector(VENUE_NAV_SELECTOR);
    if (!(nav instanceof HTMLElement)) {
      return;
    }

    const observer = new ResizeObserver(() => {
      syncVenueNavHeight();
    });
    observer.observe(nav);
    window.addEventListener('resize', syncVenueNavHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', syncVenueNavHeight);
    };
  }, []);

  return null;
}

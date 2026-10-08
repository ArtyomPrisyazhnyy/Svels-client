'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ScrollToTopButton } from '@/shared/components/ScrollToTopButton';
import { RestaurantStylingPortalRoot } from '../context/RestaurantStylingContext';

/**
 * Кнопка «наверх» в портале с CSS-переменными текущего заведения.
 */
export function RestaurantStylingScrollToTop() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <RestaurantStylingPortalRoot>
      <ScrollToTopButton forRestaurantTheme />
    </RestaurantStylingPortalRoot>,
    document.body,
  );
}

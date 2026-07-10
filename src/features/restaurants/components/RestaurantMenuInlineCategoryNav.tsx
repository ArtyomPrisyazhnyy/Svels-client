'use client';

import { MenuCategoryNav } from './MenuCategoryNav';
import { useMenuCategoryNavOptional } from '../context/MenuCategoryNavContext';

export function RestaurantMenuInlineCategoryNav() {
  const navContext = useMenuCategoryNavOptional();

  if (!navContext || navContext.mode === 'always_in_header') {
    return null;
  }

  const hiddenWhenDocked = navContext.mode === 'dock_in_header' && navContext.docked;

  return (
    <div
      ref={navContext.inlineAnchorRef}
      className={`restaurant-menu__category-nav-anchor${
        hiddenWhenDocked ? ' restaurant-menu__category-nav-anchor--docked' : ''
      }`}
    >
      <MenuCategoryNav placement="inline" />
    </div>
  );
}

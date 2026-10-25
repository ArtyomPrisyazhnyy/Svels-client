'use client';

import type { MenuItem } from '@/shared/types/menu';
import { MenuProductCard } from './MenuProductCard';
import '../styles/restaurant-menu.scss';

interface MenuProductGridProps {
  restaurantId?: string;
  items: MenuItem[];
  onSelect: (item: MenuItem) => void;
  onPreload?: () => void;
  imageLoading?: 'eager' | 'lazy';
  testId?: string;
}

/** Same product grid the venue home catalog uses. */
export function MenuProductGrid({
  restaurantId,
  items,
  onSelect,
  onPreload,
  imageLoading,
  testId = 'menu-product-grid',
}: MenuProductGridProps) {
  return (
    <div className="restaurant-menu__grid" data-testid={testId}>
      {items.map((item) => (
        <MenuProductCard
          key={item.id}
          restaurantId={restaurantId}
          item={item}
          onSelect={onSelect}
          onPreload={onPreload}
          imageLoading={imageLoading}
        />
      ))}
    </div>
  );
}

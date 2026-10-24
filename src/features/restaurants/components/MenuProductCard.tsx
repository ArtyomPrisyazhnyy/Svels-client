'use client';

import type { MouseEvent } from 'react';
import { MenuItemPriceDisplay } from '@/shared/components/MenuItemPriceDisplay';
import { ResponsiveImage } from '@/shared/components/ResponsiveImage';
import type { MenuItem } from '@/shared/types/menu';
import { useFavoritesStore } from '@/store/favorites.store';
import { useRestaurantStylingOptional } from '../context/RestaurantStylingContext';
import { hasPriceAffectingModifiers } from '../utils/menu-modifiers.util';
import { FavoriteHeartButton } from './FavoriteHeartButton';
import '../styles/menu-product-card.scss';

interface MenuProductCardProps {
  restaurantId?: string;
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
  onPreload?: () => void;
  imageLoading?: 'eager' | 'lazy';
}

export function MenuProductCard({
  restaurantId,
  item,
  onSelect,
  onPreload,
  imageLoading = 'lazy',
}: MenuProductCardProps) {
  const showFromPrice = hasPriceAffectingModifiers(item.modifierGroups);
  const { styling } = useRestaurantStylingOptional();
  const favoritesEnabled = styling.favoritesEnabled !== false;
  const isMagazine = styling.cardStyle === 'magazine';
  const isFavorite = useFavoritesStore((s) =>
    favoritesEnabled ? s.menuItemIds.includes(item.id) : false,
  );
  const toggle = useFavoritesStore((s) => s.toggle);

  const titleId = `menu-item-title-${item.id}`;

  function handleFavoriteClick(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (restaurantId) {
      void toggle(restaurantId, item.id);
    }
  }

  const favoriteButton =
    favoritesEnabled && restaurantId ? (
      <FavoriteHeartButton
        active={isFavorite}
        variant={isMagazine ? 'plain' : 'overlay'}
        className={
          isMagazine
            ? 'menu-product-card__favorite menu-product-card__favorite--magazine'
            : 'menu-product-card__favorite'
        }
        onClick={handleFavoriteClick}
      />
    ) : null;

  return (
    <article
      className="menu-product-card"
      onPointerEnter={onPreload}
      onFocus={onPreload}
      onTouchStart={onPreload}
    >
      <button
        type="button"
        className="menu-product-card__open"
        aria-labelledby={titleId}
        onClick={() => onSelect(item)}
        data-testid={`menu-item-${item.id}`}
      >
        <div className="menu-product-card__media">
          <ResponsiveImage
            src={item.imageUrl}
            webpSrc={item.imageWebpUrl}
            alt=""
            loading={imageLoading}
          />
        </div>

        <div className="menu-product-card__body">
          <span id={titleId} className="menu-product-card__title">
            {item.name}
            {item.variantLabel && (
              <span className="menu-product-card__variant"> {item.variantLabel}</span>
            )}
          </span>

          {item.description && (
            <p className="menu-product-card__description">{item.description}</p>
          )}

          <p className="menu-product-card__price">
            <MenuItemPriceDisplay
              price={item.price}
              oldPrice={item.oldPrice}
              showFromPrefix={showFromPrice}
            />
          </p>
        </div>
      </button>

      {favoriteButton}
    </article>
  );
}

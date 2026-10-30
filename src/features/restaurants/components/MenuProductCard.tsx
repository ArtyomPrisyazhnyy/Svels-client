'use client';

import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { FillImage } from '@/shared/components/FillImage';
import { MenuItemPriceDisplay } from '@/shared/components/MenuItemPriceDisplay';
import {
  MENU_CARD_IMAGE_SIZES,
  MENU_MAGAZINE_IMAGE_SIZES,
} from '@/shared/images/menu-image-loading';
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
  imageFetchPriority?: 'high' | 'low' | 'auto';
}

export function MenuProductCard({
  restaurantId,
  item,
  onSelect,
  onPreload,
  imageLoading = 'lazy',
  imageFetchPriority = 'low',
}: MenuProductCardProps) {
  const showFromPrice = hasPriceAffectingModifiers(item.modifierGroups);
  const { styling } = useRestaurantStylingOptional();
  const favoritesEnabled = styling.favoritesEnabled !== false;
  const isMagazine = styling.cardStyle === 'magazine';
  const isFavorite = useFavoritesStore((s) =>
    favoritesEnabled ? s.menuItemIds.includes(item.id) : false,
  );
  const toggle = useFavoritesStore((s) => s.toggle);
  const mediaRef = useRef<HTMLDivElement>(null);
  // Below-fold photos stay out of the initial HTML so they don't compete with the LCP banner.
  const [renderImage, setRenderImage] = useState(imageLoading !== 'lazy');

  useEffect(() => {
    if (renderImage) {
      return;
    }
    const node = mediaRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setRenderImage(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setRenderImage(true);
          observer.disconnect();
        }
      },
      { rootMargin: '240px 0px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [renderImage]);

  function handleCardClick(event: MouseEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest('[data-favorite-heart]')) {
      return;
    }
    onSelect(item);
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
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          void toggle(restaurantId, item.id);
        }}
      />
    ) : null;

  return (
    <div
      role="button"
      tabIndex={0}
      className="menu-product-card"
      onPointerEnter={onPreload}
      onFocus={onPreload}
      onTouchStart={onPreload}
      onClick={handleCardClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect(item);
        }
      }}
      data-testid={`menu-item-${item.id}`}
    >
      <div className="menu-product-card__media" ref={mediaRef}>
        {renderImage ? (
          <FillImage
            src={item.imageUrl}
            webpSrc={item.imageWebpUrl}
            alt={item.name}
            sizes={isMagazine ? MENU_MAGAZINE_IMAGE_SIZES : MENU_CARD_IMAGE_SIZES}
            loading={imageLoading}
            fetchPriority={imageFetchPriority}
          />
        ) : null}
        {!isMagazine ? favoriteButton : null}
      </div>

      <div className="menu-product-card__body">
        {isMagazine ? favoriteButton : null}
        <span className="menu-product-card__title">
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
    </div>
  );
}

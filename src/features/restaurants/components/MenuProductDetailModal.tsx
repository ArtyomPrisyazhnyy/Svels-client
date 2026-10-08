'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { NutritionBadges } from '@/features/restaurant-admin/components/NutritionBadges';
import { MenuItemPriceDisplay } from '@/shared/components/MenuItemPriceDisplay';
import { Carousel } from '@/shared/components/Carousel';
import { useModalPresence } from '@/hooks/useModalPresence';
import { ResponsiveImage } from '@/shared/components/ResponsiveImage';
import { getMenuItemImages, type MenuItem } from '@/shared/types/menu';
import { MenuProductModifiers } from './MenuProductModifiers';
import {
  calculateModifierUnitPrice,
  createEmptyModifierSelections,
  getValidModifierGroups,
  isModifierSelectionComplete,
  type ModifierSelections,
} from '../utils/menu-modifiers.util';
import { buildCartLineItem } from '../utils/cart.util';
import {
  RestaurantStylingPortalRoot,
  useRestaurantStylingOptional,
} from '../context/RestaurantStylingContext';
import { useCartStore } from '@/store/cart.store';
import { useFavoritesStore } from '@/store/favorites.store';
import { FavoriteHeartButton } from './FavoriteHeartButton';
import '../styles/menu-product-modal.scss';

const MODAL_ANIMATION_MS = 200;

interface MenuProductDetailModalProps {
  item: MenuItem;
  restaurantId: string;
  onClose: () => void;
}

export function MenuProductDetailModal({
  item,
  restaurantId,
  onClose,
}: MenuProductDetailModalProps) {
  const { mounted, isActive, handleClose } = useModalPresence(onClose, MODAL_ANIMATION_MS);
  const [quantity, setQuantity] = useState(1);
  const [modifierSelections, setModifierSelections] = useState<ModifierSelections>({});
  const addLine = useCartStore((s) => s.addLine);
  const { styling } = useRestaurantStylingOptional();
  const favoritesEnabled = styling.favoritesEnabled !== false;
  const isFavorite = useFavoritesStore((s) =>
    favoritesEnabled ? s.menuItemIds.includes(item.id) : false,
  );
  const toggleFavorite = useFavoritesStore((s) => s.toggle);

  const modifierGroups = useMemo(
    () => getValidModifierGroups(item.modifierGroups ?? []),
    [item.modifierGroups],
  );

  const images = useMemo(() => getMenuItemImages(item), [item]);
  const hasGallery = images.length > 1;

  const unitPrice = useMemo(
    () => calculateModifierUnitPrice(item.price, modifierGroups, modifierSelections),
    [item.price, modifierGroups, modifierSelections],
  );

  const oldUnitPrice = useMemo(() => {
    if (item.oldPrice == null) {
      return null;
    }

    const modifierExtra = unitPrice - Number(item.price);
    return Number(item.oldPrice) + modifierExtra;
  }, [item.oldPrice, item.price, unitPrice]);

  const canAdd = useMemo(
    () => isModifierSelectionComplete(modifierGroups, modifierSelections),
    [modifierGroups, modifierSelections],
  );

  useEffect(() => {
    setQuantity(1);
    setModifierSelections(
      createEmptyModifierSelections(getValidModifierGroups(item.modifierGroups ?? [])),
    );
  }, [item.id, item.modifierGroups]);

  const handleAdd = useCallback(() => {
    if (!canAdd) {
      return;
    }

    addLine(
      restaurantId,
      buildCartLineItem(item, quantity, modifierGroups, modifierSelections),
    );
    handleClose();
  }, [
    addLine,
    canAdd,
    handleClose,
    item,
    modifierGroups,
    modifierSelections,
    quantity,
    restaurantId,
  ]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleClose]);

  if (!mounted) {
    return null;
  }

  const title = item.variantLabel ? `${item.name} ${item.variantLabel}` : item.name;
  const activeClass = isActive ? ' menu-product-modal--active' : '';

  return createPortal(
    <RestaurantStylingPortalRoot>
      <>
        <button
        type="button"
        className={`menu-product-modal__backdrop${activeClass}`}
        onClick={handleClose}
        aria-label="Закрыть"
      />

      <div
        className={`menu-product-modal${activeClass}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="menu-product-modal-title"
      >
        <div className={`menu-product-modal__panel${activeClass}`}>
          <button type="button" className="menu-product-modal__close" onClick={handleClose} aria-label="Закрыть">
            ×
          </button>

          <div className="menu-product-modal__media">
            {images.length > 0 ? (
              hasGallery ? (
                <Carousel
                  className="menu-product-modal__carousel"
                  slides={images.map((image, index) => (
                    <ResponsiveImage
                      key={`${image.url}-${index}`}
                      src={image.url}
                      webpSrc={image.webpUrl}
                      alt={`${item.name}${index > 0 ? ` — фото ${index + 1}` : ''}`}
                      loading={index === 0 ? 'eager' : 'lazy'}
                    />
                  ))}
                  options={{ loop: true }}
                  showArrows
                  showDots
                />
              ) : (
                <ResponsiveImage
                  src={images[0].url}
                  webpSrc={images[0].webpUrl}
                  alt={item.name}
                />
              )
            ) : null}
            {favoritesEnabled ? (
              <FavoriteHeartButton
                active={isFavorite}
                variant="overlay"
                className="menu-product-modal__favorite"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  void toggleFavorite(restaurantId, item.id);
                }}
              />
            ) : null}
          </div>

          <div className="menu-product-modal__body">
            <h2 id="menu-product-modal-title" className="menu-product-modal__title">
              {title}
            </h2>

            {item.description && (
              <p className="menu-product-modal__description">{item.description}</p>
            )}

            {modifierGroups.length > 0 && (
              <MenuProductModifiers
                groups={modifierGroups}
                selections={modifierSelections}
                onChange={setModifierSelections}
              />
            )}

            {item.ingredients && (
              <div className="menu-product-modal__section">
                <h3 className="menu-product-modal__section-title">Состав</h3>
                <p className="menu-product-modal__ingredients">{item.ingredients}</p>
              </div>
            )}

            {item.nutrition && (
              <div className="menu-product-modal__section">
                <h3 className="menu-product-modal__section-title">КБЖУ (на 100 грамм)</h3>
                <NutritionBadges nutrition={item.nutrition} />
              </div>
            )}
          </div>

          <footer className="menu-product-modal__footer">
            <p className="menu-product-modal__price">
              <MenuItemPriceDisplay
                price={unitPrice}
                oldPrice={oldUnitPrice}
                quantity={quantity}
              />
            </p>

            <div className="menu-product-modal__actions">
              <div className="menu-product-modal__counter" aria-label="Количество">
                <button
                  type="button"
                  className="menu-product-modal__counter-btn"
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  disabled={quantity <= 1}
                  aria-label="Уменьшить количество"
                >
                  −
                </button>
                <span className="menu-product-modal__counter-value" aria-live="polite">
                  {quantity}
                </span>
                <button
                  type="button"
                  className="menu-product-modal__counter-btn"
                  onClick={() => setQuantity((value) => value + 1)}
                  aria-label="Увеличить количество"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                className="menu-product-modal__add"
                disabled={!canAdd}
                onClick={handleAdd}
                data-testid="menu-add-to-cart"
              >
                Добавить
              </button>
            </div>
          </footer>
        </div>
      </div>
      </>
    </RestaurantStylingPortalRoot>,
    document.body,
  );
}

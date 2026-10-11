'use client';

import { useCallback, useMemo, useState } from 'react';
import { NutritionBadges } from '@/features/restaurant-admin/components/NutritionBadges';
import { MenuItemPriceDisplay } from '@/shared/components/MenuItemPriceDisplay';
import { Carousel } from '@/shared/components/Carousel';
import { ResponsiveImage } from '@/shared/components/ResponsiveImage';
import { Button } from '@/shared/ui/Button/Button';
import { Modal } from '@/shared/ui/Modal/Modal';
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
  const [quantity, setQuantity] = useState(1);
  const [modifierSelections, setModifierSelections] = useState<ModifierSelections>(() =>
    createEmptyModifierSelections(getValidModifierGroups(item.modifierGroups ?? [])),
  );
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

  const modifierResetKey = `${item.id}:${modifierGroups.map((group) => group.id).join(',')}`;
  const [appliedResetKey, setAppliedResetKey] = useState(modifierResetKey);
  if (appliedResetKey !== modifierResetKey) {
    setAppliedResetKey(modifierResetKey);
    setQuantity(1);
    setModifierSelections(createEmptyModifierSelections(modifierGroups));
  }

  const handleAdd = useCallback(() => {
    if (!canAdd) {
      return;
    }

    addLine(
      restaurantId,
      buildCartLineItem(item, quantity, modifierGroups, modifierSelections),
    );
    onClose();
  }, [
    addLine,
    canAdd,
    onClose,
    item,
    modifierGroups,
    modifierSelections,
    quantity,
    restaurantId,
  ]);

  const title = item.variantLabel ? `${item.name} ${item.variantLabel}` : item.name;

  return (
    <Modal
      open
      onClose={onClose}
      title={title}
      titleId="menu-product-modal-title"
      titleTestId="menu-product-modal-title"
      rootTestId="menu-product-modal"
      testId="menu-product-modal-panel"
      closeTestId="menu-product-modal-close"
      panelClassName="menu-product-modal__panel"
      size="md"
      wrap={(node) => <RestaurantStylingPortalRoot>{node}</RestaurantStylingPortalRoot>}
      footer={
        <div className="menu-product-modal__footer">
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
            <Button
              type="button"
              variant="primary"
              disabled={!canAdd}
              onClick={handleAdd}
              testId="menu-add-to-cart"
              className="menu-product-modal__add"
            >
              Добавить
            </Button>
          </div>
        </div>
      }
    >
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
    </Modal>
  );
}

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError } from '../../../shared/api/api-client';
import type { MenuCategory, MenuItem } from '../../../shared/types/menu';
import { PriceDelta } from '../../../shared/components/CurrencyAmount';
import { MenuItemPriceDisplay } from '../../../shared/components/MenuItemPriceDisplay';
import { ResponsiveImage } from '@/shared/components/ResponsiveImage';
import { useAuthStore } from '../../../store/auth.store';
import {
  createCategory,
  deleteCategory,
  deleteMenuItem,
  fetchMenu,
  reorderCategories,
  updateCategory,
} from '../api/menu.api';
import { revalidateRestaurantPublicPage } from '@/features/restaurants/actions/revalidate-restaurant-public-page.action';
import { MenuItemForm } from '../components/MenuItemForm';
import { NutritionBadges } from '../components/NutritionBadges';
import '../styles/menu-admin.scss';

export default function MenuAdminPage() {
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const restaurantId = user?.restaurantId;
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [categoryBusyId, setCategoryBusyId] = useState<string | null>(null);
  const formPanelRef = useRef<HTMLElement>(null);

  const sortedCategories = [...categories].sort((a, b) => a.sortOrder - b.sortOrder);

  const loadMenu = useCallback(async () => {
    if (!restaurantId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const menu = await fetchMenu(restaurantId);
      setCategories(menu.categories);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось загрузить меню');
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch on mount
    void loadMenu();
  }, [loadMenu]);

  async function handleCreateCategory(name: string): Promise<string> {
    if (!restaurantId || !accessToken) {
      throw new Error('Нет доступа');
    }
    const category = await createCategory(restaurantId, accessToken, name);
    await loadMenu();
    await revalidateRestaurantPublicPage(restaurantId);
    return category.id;
  }

  async function handleDeleteItem(itemId: string) {
    if (!restaurantId || !accessToken) return;
    if (!window.confirm('Удалить позицию из меню?')) return;

    try {
      await deleteMenuItem(restaurantId, accessToken, itemId);
      if (editingItem?.id === itemId) {
        setEditingItem(null);
      }
      await loadMenu();
      await revalidateRestaurantPublicPage(restaurantId);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось удалить позицию');
    }
  }

  function handleEditItem(item: MenuItem) {
    setEditingItem(item);
    formPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function categoryDeleteErrorMessage(err: unknown): string {
    if (err instanceof ApiError && err.code === 'CATEGORY_NOT_EMPTY') {
      return 'Нельзя удалить категорию с позициями меню. Сначала удалите или перенесите блюда.';
    }
    return err instanceof ApiError ? err.message : 'Не удалось удалить категорию';
  }

  async function handleRenameCategory(category: MenuCategory) {
    if (!restaurantId || !accessToken) return;
    const nextName = window.prompt('Новое название категории', category.name);
    if (nextName === null) return;
    const trimmed = nextName.trim();
    if (!trimmed || trimmed === category.name) return;

    setCategoryBusyId(category.id);
    setError(null);
    try {
      await updateCategory(restaurantId, accessToken, category.id, { name: trimmed });
      await loadMenu();
      await revalidateRestaurantPublicPage(restaurantId);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось переименовать категорию');
    } finally {
      setCategoryBusyId(null);
    }
  }

  async function handleDeleteCategory(category: MenuCategory) {
    if (!restaurantId || !accessToken) return;
    if (!window.confirm(`Удалить категорию «${category.name}»?`)) return;

    setCategoryBusyId(category.id);
    setError(null);
    try {
      await deleteCategory(restaurantId, accessToken, category.id);
      await loadMenu();
      await revalidateRestaurantPublicPage(restaurantId);
    } catch (err) {
      setError(categoryDeleteErrorMessage(err));
    } finally {
      setCategoryBusyId(null);
    }
  }

  async function handleMoveCategory(categoryId: string, direction: 'up' | 'down') {
    if (!restaurantId || !accessToken) return;

    const ids = sortedCategories.map((c) => c.id);
    const index = ids.indexOf(categoryId);
    if (index < 0) return;
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= ids.length) return;

    const nextIds = [...ids];
    [nextIds[index], nextIds[swapIndex]] = [nextIds[swapIndex], nextIds[index]];

    setCategoryBusyId(categoryId);
    setError(null);
    try {
      await reorderCategories(restaurantId, accessToken, nextIds);
      await loadMenu();
      await revalidateRestaurantPublicPage(restaurantId);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось изменить порядок категорий');
    } finally {
      setCategoryBusyId(null);
    }
  }

  if (!restaurantId) {
    return (
      <p className="menu-admin__notice">
        Заявка ещё на модерации или ресторан не привязан к аккаунту.
      </p>
    );
  }

  return (
    <div className="menu-admin">
      {error && <p className="menu-admin__error">{error}</p>}

      <div className="menu-admin__grid">
        <section className="menu-admin__form-panel" ref={formPanelRef}>
          {accessToken && (
            <MenuItemForm
              restaurantId={restaurantId}
              token={accessToken}
              categories={categories}
              onCategoryCreate={handleCreateCategory}
              onSuccess={async () => {
                await loadMenu();
                await revalidateRestaurantPublicPage(restaurantId);
              }}
              editingItem={editingItem}
              onCancelEdit={() => setEditingItem(null)}
            />
          )}
        </section>

        <section className="menu-admin__list-panel">
          <h2>Текущее меню</h2>
          {loading ? (
            <p className="menu-admin__empty">Загрузка…</p>
          ) : sortedCategories.length === 0 ? (
            <p className="menu-admin__empty">Пока нет категорий и позиций.</p>
          ) : (
            sortedCategories.map((category, categoryIndex) => (
              <div key={category.id} className="menu-admin__category" data-testid={`menu-category-${category.id}`}>
                <div className="menu-admin__category-header">
                  <h3>{category.name}</h3>
                  <div className="menu-admin__category-actions">
                    <button
                      type="button"
                      className="menu-admin__category-btn"
                      disabled={categoryBusyId === category.id || categoryIndex === 0}
                      onClick={() => void handleMoveCategory(category.id, 'up')}
                      aria-label="Выше"
                      data-testid={`category-move-up-${category.id}`}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="menu-admin__category-btn"
                      disabled={
                        categoryBusyId === category.id ||
                        categoryIndex === sortedCategories.length - 1
                      }
                      onClick={() => void handleMoveCategory(category.id, 'down')}
                      aria-label="Ниже"
                      data-testid={`category-move-down-${category.id}`}
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="menu-admin__category-btn"
                      disabled={categoryBusyId === category.id}
                      onClick={() => void handleRenameCategory(category)}
                      data-testid={`category-rename-${category.id}`}
                    >
                      Переименовать
                    </button>
                    <button
                      type="button"
                      className="menu-admin__category-btn menu-admin__category-btn--danger"
                      disabled={categoryBusyId === category.id}
                      onClick={() => void handleDeleteCategory(category)}
                      data-testid={`category-delete-${category.id}`}
                    >
                      Удалить
                    </button>
                  </div>
                </div>
                {category.items.length === 0 ? (
                  <p className="menu-admin__empty">Нет позиций</p>
                ) : (
                  <ul className="menu-admin__items">
                    {category.items.map((item) => (
                      <li
                        key={item.id}
                        className={`menu-admin__item${editingItem?.id === item.id ? ' menu-admin__item--editing' : ''}`}
                      >
                        <ResponsiveImage
                          src={item.imageUrl}
                          webpSrc={item.imageWebpUrl}
                          alt={item.name}
                        />
                        <div className="menu-admin__item-body">
                          <strong>
                            {item.name}
                            {item.variantLabel && (
                              <span className="menu-admin__item-variant"> {item.variantLabel}</span>
                            )}
                          </strong>
                          <span>
                            <MenuItemPriceDisplay
                              price={item.price}
                              oldPrice={item.oldPrice}
                              fractionDigits={2}
                            />
                          </span>
                          {item.nutrition && <NutritionBadges nutrition={item.nutrition} />}
                          {item.modifierGroups?.length > 0 && (
                            <ul className="menu-admin__modifiers">
                              {item.modifierGroups.map((group) => (
                                <li key={group.id}>
                                  {group.name}:{' '}
                                  {group.options.map((o, index) => (
                                    <span key={o.id ?? o.name}>
                                      {index > 0 ? ', ' : ''}
                                      {o.name}
                                      <PriceDelta delta={o.priceDelta} />
                                    </span>
                                  ))}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                        <div className="menu-admin__item-actions">
                          <button
                            type="button"
                            className="menu-admin__edit"
                            onClick={() => handleEditItem(item)}
                          >
                            Редактировать
                          </button>
                          <button
                            type="button"
                            className="menu-admin__delete"
                            onClick={() => void handleDeleteItem(item.id)}
                          >
                            Удалить
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
}

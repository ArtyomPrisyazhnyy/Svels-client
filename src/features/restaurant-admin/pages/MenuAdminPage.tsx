'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError } from '../../../shared/api/api-client';
import type { MenuCategory, MenuItem } from '../../../shared/types/menu';
import { CurrencyAmount, PriceDelta } from '../../../shared/components/CurrencyAmount';
import { resolveImageUrl } from '../../../shared/types/menu';
import { useAuthStore } from '../../../store/auth.store';
import {
  createCategory,
  deleteMenuItem,
  fetchMenu,
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
  const formPanelRef = useRef<HTMLElement>(null);

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
          ) : categories.length === 0 ? (
            <p className="menu-admin__empty">Пока нет категорий и позиций.</p>
          ) : (
            categories.map((category) => (
              <div key={category.id} className="menu-admin__category">
                <h3>{category.name}</h3>
                {category.items.length === 0 ? (
                  <p className="menu-admin__empty">Нет позиций</p>
                ) : (
                  <ul className="menu-admin__items">
                    {category.items.map((item) => (
                      <li
                        key={item.id}
                        className={`menu-admin__item${editingItem?.id === item.id ? ' menu-admin__item--editing' : ''}`}
                      >
                        <img src={resolveImageUrl(item.imageUrl)} alt={item.name} />
                        <div className="menu-admin__item-body">
                          <strong>
                            {item.name}
                            {item.variantLabel && (
                              <span className="menu-admin__item-variant"> {item.variantLabel}</span>
                            )}
                          </strong>
                          <span><CurrencyAmount amount={item.price} fractionDigits={2} /></span>
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

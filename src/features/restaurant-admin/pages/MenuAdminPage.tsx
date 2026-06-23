import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '../../../shared/api/api-client';
import type { MenuCategory } from '../../../shared/types/menu';
import { formatPriceDelta, resolveImageUrl } from '../../../shared/types/menu';
import { useAuthStore } from '../../../store/auth.store';
import {
  createCategory,
  deleteMenuItem,
  fetchMenu,
} from '../api/menu.api';
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
    return category.id;
  }

  async function handleDeleteItem(itemId: string) {
    if (!restaurantId || !accessToken) return;
    if (!window.confirm('Удалить позицию из меню?')) return;

    try {
      await deleteMenuItem(restaurantId, accessToken, itemId);
      await loadMenu();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось удалить позицию');
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
        <section className="menu-admin__form-panel">
          {accessToken && (
            <MenuItemForm
              restaurantId={restaurantId}
              token={accessToken}
              categories={categories}
              onCategoryCreate={handleCreateCategory}
              onSuccess={() => void loadMenu()}
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
                      <li key={item.id} className="menu-admin__item">
                        <img src={resolveImageUrl(item.imageUrl)} alt={item.name} />
                        <div className="menu-admin__item-body">
                          <strong>{item.name}</strong>
                          <span>{Number(item.price).toFixed(2)} ₽</span>
                          {item.nutrition && <NutritionBadges nutrition={item.nutrition} />}
                          {item.modifierGroups?.length > 0 && (
                            <ul className="menu-admin__modifiers">
                              {item.modifierGroups.map((group) => (
                                <li key={group.id}>
                                  {group.name}:{' '}
                                  {group.options
                                    .map((o) => `${o.name}${formatPriceDelta(o.priceDelta)}`)
                                    .join(', ')}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                        <button
                          type="button"
                          className="menu-admin__delete"
                          onClick={() => void handleDeleteItem(item.id)}
                        >
                          Удалить
                        </button>
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

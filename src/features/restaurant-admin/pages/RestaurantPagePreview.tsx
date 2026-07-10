'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { RestaurantPublicPage } from '../../restaurants/components/RestaurantPublicPage';
import type { MenuResponse } from '../../../shared/types/menu';
import type { RestaurantOrderSettings } from '../../../shared/types/order-settings';
import type { RestaurantStyling } from '../../../shared/types/restaurant-styling';
import type { PublicRestaurant } from '../../restaurants/types/restaurant';
import { ApiError } from '../../../shared/api/api-client';
import type { SocialLink } from '../../../shared/types/social-link';
import { useAuthStore } from '../../../store/auth.store';
import { fetchRestaurantPreview } from '../api/restaurant-preview.api';
import '../styles/restaurant-page-preview.scss';

export default function RestaurantPagePreview() {
  const restaurantId = useAuthStore((s) => s.user?.restaurantId);
  const [restaurant, setRestaurant] = useState<PublicRestaurant | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [menu, setMenu] = useState<MenuResponse>({ categories: [] });
  const [orderSettings, setOrderSettings] = useState<RestaurantOrderSettings | null>(null);
  const [styling, setStyling] = useState<RestaurantStyling | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPreview = useCallback(async () => {
    if (!restaurantId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchRestaurantPreview(restaurantId);
      setRestaurant(data.restaurant);
      setSocialLinks(data.socialLinks);
      setMenu(data.menu);
      setOrderSettings(data.orderSettings);
      setStyling(data.styling);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось загрузить страницу заведения');
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);

  useEffect(() => {
    void loadPreview();
  }, [loadPreview]);

  if (!restaurantId) {
    return (
      <p className="restaurant-page-preview__notice">
        Заявка ещё на модерации или ресторан не привязан к аккаунту.
      </p>
    );
  }

  return (
    <div className="restaurant-page-preview">
      <div className="restaurant-page-preview__toolbar">
        <div>
          <h2 className="restaurant-page-preview__title">Страница заведения</h2>
          <p className="restaurant-page-preview__hint">
            Так вашу страницу видят гости — без доступа к админ-панели.
          </p>
        </div>
        {restaurant && (
          <Link
            href={`/restaurants/${restaurant.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="restaurant-page-preview__open"
          >
            Открыть в новой вкладке
          </Link>
        )}
      </div>

      {error && <p className="restaurant-page-preview__error">{error}</p>}

      {loading ? (
        <p className="restaurant-page-preview__empty">Загрузка…</p>
      ) : restaurant && orderSettings && styling ? (
        <div className="restaurant-page-preview__frame">
          <RestaurantPublicPage
            restaurant={restaurant}
            menu={menu}
            orderSettings={orderSettings}
            styling={styling}
            socialLinks={socialLinks}
            embedded
          />
        </div>
      ) : null}
    </div>
  );
}

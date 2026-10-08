'use client';

import { useCallback, useEffect, useState } from 'react';
import { revalidateRestaurantPublicPage } from '@/features/restaurants/actions/revalidate-restaurant-public-page.action';
import { ApiError } from '@/shared/api/api-client';
import { ResponsiveImage } from '@/shared/components/ResponsiveImage';
import { useAuthStore } from '@/store/auth.store';
import {
  fetchRestaurant,
  updateRestaurant,
  uploadRestaurantLogo,
} from '../api/restaurant.api';
import '../styles/branding-admin.scss';

export default function BrandingAdminPage() {
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const restaurantId = user?.restaurantId;

  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoWebpUrl, setLogoWebpUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadRestaurant = useCallback(async () => {
    if (!restaurantId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const restaurant = await fetchRestaurant(restaurantId);
      setLogoUrl(restaurant.logoUrl ?? null);
      setLogoWebpUrl(restaurant.logoWebpUrl ?? null);
      setPreviewUrl('');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось загрузить данные заведения');
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);

  useEffect(() => {
    void loadRestaurant();
  }, [loadRestaurant]);

  async function handleFileChange(file: File | undefined) {
    if (!file || !restaurantId || !accessToken) return;

    setError(null);
    setSuccess(null);
    setUploading(true);
    setPreviewUrl(URL.createObjectURL(file));

    try {
      const result = await uploadRestaurantLogo(restaurantId, accessToken, file);
      await updateRestaurant(restaurantId, accessToken, {
        logoUrl: result.logoUrl,
        logoWebpUrl: result.logoWebpUrl,
      });
      setLogoUrl(result.logoUrl);
      setLogoWebpUrl(result.logoWebpUrl);
      await revalidateRestaurantPublicPage(restaurantId);
      setSuccess('Логотип сохранён');
    } catch (err) {
      setPreviewUrl('');
      setError(err instanceof Error ? err.message : 'Не удалось загрузить логотип');
    } finally {
      setUploading(false);
    }
  }

  async function handleRemoveLogo() {
    if (!restaurantId || !accessToken || !logoUrl) return;
    if (!window.confirm('Удалить логотип?')) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await updateRestaurant(restaurantId, accessToken, {
        logoUrl: null,
        logoWebpUrl: null,
      });
      setLogoUrl(null);
      setLogoWebpUrl(null);
      setPreviewUrl('');
      await revalidateRestaurantPublicPage(restaurantId);
      setSuccess('Логотип удалён');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось удалить логотип');
    } finally {
      setSaving(false);
    }
  }

  if (!restaurantId) {
    return (
      <p className="branding-admin__notice">
        Заявка ещё на модерации или ресторан не привязан к аккаунту.
      </p>
    );
  }

  return (
    <div className="branding-admin">
      <section className="branding-admin__panel">
        <h2>Логотип заведения</h2>
        <p className="branding-admin__hint">
          Загрузите квадратное или горизонтальное изображение в формате JPG, PNG или WebP до 5 МБ.
          Логотип отображается в шапке страницы заведения для гостей. На сервере автоматически
          создаётся WebP и оптимизированный JPEG/PNG.
        </p>

        {error && <p className="branding-admin__error">{error}</p>}
        {success && <p className="branding-admin__success">{success}</p>}

        {loading ? (
          <p className="branding-admin__empty">Загрузка…</p>
        ) : (
          <>
            <div className="branding-admin__preview-wrap">
              {previewUrl ? (
                <img
                  className="branding-admin__preview"
                  src={previewUrl}
                  alt="Логотип заведения"
                />
              ) : logoUrl ? (
                <ResponsiveImage
                  className="branding-admin__preview"
                  src={logoUrl}
                  webpSrc={logoWebpUrl}
                  alt="Логотип заведения"
                />
              ) : (
                <div className="branding-admin__placeholder">Логотип не загружен</div>
              )}
            </div>

            <div className="branding-admin__actions">
              <label className="branding-admin__upload-btn">
                {uploading ? 'Загрузка…' : logoUrl ? 'Заменить логотип' : 'Загрузить логотип'}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  disabled={uploading || saving}
                  hidden
                  onChange={(e) => void handleFileChange(e.target.files?.[0])}
                />
              </label>

              {logoUrl && (
                <button
                  type="button"
                  className="branding-admin__remove"
                  disabled={uploading || saving}
                  onClick={() => void handleRemoveLogo()}
                >
                  {saving ? 'Удаление…' : 'Удалить'}
                </button>
              )}
            </div>

          </>
        )}
      </section>
    </div>
  );
}

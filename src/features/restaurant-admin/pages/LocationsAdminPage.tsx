'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { ApiError } from '../../../shared/api/api-client';
import { LocationMap } from '../../../shared/components/LocationMap';
import type { RestaurantLocation } from '../../../shared/types/restaurant-location';
import { formatRestaurantLocationLine } from '../../../shared/types/restaurant-location';
import { useAuthStore } from '../../../store/auth.store';
import { revalidateRestaurantPublicPage } from '@/features/restaurants/actions/revalidate-restaurant-public-page.action';
import {
  createRestaurantLocation,
  deleteRestaurantLocation,
  fetchRestaurantLocations,
  geocodeRestaurantLocation,
  updateRestaurantLocation,
} from '../api/locations.api';
import '../styles/locations-admin.scss';

const DEFAULT_POINT = { lat: 53.9023, lng: 27.5619 };

export default function LocationsAdminPage() {
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const restaurantId = user?.restaurantId;

  const [locations, setLocations] = useState<RestaurantLocation[]>([]);
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [label, setLabel] = useState('');
  const [point, setPoint] = useState(DEFAULT_POINT);
  const [editing, setEditing] = useState<RestaurantLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadLocations = useCallback(async () => {
    if (!restaurantId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await fetchRestaurantLocations(restaurantId);
      setLocations(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось загрузить точки');
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);

  useEffect(() => {
    void loadLocations();
  }, [loadLocations]);

  function resetForm() {
    setCity('');
    setAddress('');
    setLabel('');
    setPoint(DEFAULT_POINT);
    setEditing(null);
    setError(null);
  }

  function handleEdit(location: RestaurantLocation) {
    setEditing(location);
    setCity(location.city);
    setAddress(location.address);
    setLabel(location.label ?? '');
    setPoint({ lat: location.lat, lng: location.lng });
    setError(null);
  }

  async function handleFindOnMap() {
    if (!restaurantId || !accessToken) {
      return;
    }
    const query = [city.trim(), address.trim()].filter(Boolean).join(', ');
    if (query.length < 3) {
      setError('Сначала укажите город и адрес');
      return;
    }

    setGeocoding(true);
    setError(null);
    try {
      const found = await geocodeRestaurantLocation(restaurantId, accessToken, query);
      setPoint(found);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Адрес не найден. Поставьте метку на карте вручную.',
      );
    } finally {
      setGeocoding(false);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!restaurantId || !accessToken) {
      return;
    }
    if (city.trim().length < 2 || address.trim().length < 5) {
      setError('Укажите город и полный адрес точки');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const payload = {
        city: city.trim(),
        address: address.trim(),
        label: label.trim() || undefined,
        lat: point.lat,
        lng: point.lng,
      };
      if (editing) {
        await updateRestaurantLocation(restaurantId, accessToken, editing.id, payload);
      } else {
        await createRestaurantLocation(restaurantId, accessToken, payload);
      }
      resetForm();
      await loadLocations();
      await revalidateRestaurantPublicPage(restaurantId);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось сохранить точку');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(locationId: string) {
    if (!restaurantId || !accessToken) {
      return;
    }
    if (!window.confirm('Удалить эту точку?')) {
      return;
    }

    setError(null);
    try {
      await deleteRestaurantLocation(restaurantId, accessToken, locationId);
      if (editing?.id === locationId) {
        resetForm();
      }
      await loadLocations();
      await revalidateRestaurantPublicPage(restaurantId);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось удалить точку');
    }
  }

  if (!restaurantId) {
    return (
      <p className="locations-admin__notice">
        Заявка ещё на модерации или ресторан не привязан к аккаунту.
      </p>
    );
  }

  const formMarkerId = editing?.id ?? 'draft';

  return (
    <div className="locations-admin" data-testid="locations-admin">
      <h1 className="locations-admin__title">Точки и адреса</h1>
      <section className="locations-admin__panel">
        <h2>{editing ? 'Редактирование точки' : 'Новая точка'}</h2>
        <p className="locations-admin__hint">
          Нужна хотя бы одна точка. Укажите город, адрес и поставьте метку на карте — гости
          выберут её при заказе на месте или навынос.
        </p>

        {error ? <p className="locations-admin__error">{error}</p> : null}

        <form className="locations-admin__form" onSubmit={(event) => void handleSubmit(event)}>
          <div className="locations-admin__field">
            <label htmlFor="location-city">Город *</label>
            <input
              id="location-city"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              placeholder="Минск"
              required
              minLength={2}
            />
          </div>
          <div className="locations-admin__field">
            <label htmlFor="location-address">Адрес *</label>
            <input
              id="location-address"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="пр. Независимости 1"
              required
              minLength={5}
            />
          </div>
          <div className="locations-admin__field">
            <label htmlFor="location-label">Название точки</label>
            <input
              id="location-label"
              value={label}
              onChange={(event) => setLabel(event.target.value)}
              placeholder="ТЦ Галерея"
            />
          </div>

          <div className="locations-admin__map-actions">
            <button
              type="button"
              onClick={() => void handleFindOnMap()}
              disabled={geocoding}
            >
              {geocoding ? 'Ищем…' : 'Найти на карте'}
            </button>
            <span>или кликните по карте, чтобы поставить метку</span>
          </div>

          <LocationMap
            height={300}
            selectedId={formMarkerId}
            markers={[{ id: formMarkerId, lat: point.lat, lng: point.lng, title: address || city }]}
            onPick={setPoint}
          />

          <div className="locations-admin__actions">
            <button type="submit" disabled={saving} data-testid="location-save">
              {saving ? 'Сохранение…' : editing ? 'Сохранить' : 'Добавить точку'}
            </button>
            {editing ? (
              <button type="button" onClick={resetForm} disabled={saving}>
                Отмена
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <section className="locations-admin__list-panel">
        <h2>Точки заведения</h2>
        {loading ? <p className="locations-admin__hint">Загрузка…</p> : null}
        {!loading && locations.length === 0 ? (
          <p className="locations-admin__empty">Пока нет точек — добавьте первую.</p>
        ) : null}
        <ul className="locations-admin__list">
          {locations.map((location) => (
            <li key={location.id} className="locations-admin__item">
              <div>
                <strong>{location.label || location.city}</strong>
                <p>{formatRestaurantLocationLine(location)}</p>
              </div>
              <div className="locations-admin__item-actions">
                <button type="button" onClick={() => handleEdit(location)}>
                  Изменить
                </button>
                <button type="button" onClick={() => void handleDelete(location.id)}>
                  Удалить
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

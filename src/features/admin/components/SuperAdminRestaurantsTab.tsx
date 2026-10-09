'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { ClientFormattedDate } from '@/components/ClientFormattedDate';
import {
  createOwnerInvite,
  createRestaurantByAdmin,
  deleteRestaurantByAdmin,
  fetchAllRestaurants,
} from '../api/admin.api';
import type { AdminRestaurantListItem } from '@/shared/types/admin-restaurants';
import { ApiError } from '@/shared/api/api-client';
import { InviteLinkCard } from './InviteLinkCard';

interface SuperAdminRestaurantsTabProps {
  accessToken: string;
}

interface InviteState {
  restaurantId: string;
  restaurantName: string;
  setPasswordUrl: string;
  expiresAt: string;
}

export function SuperAdminRestaurantsTab({ accessToken }: SuperAdminRestaurantsTabProps) {
  const [restaurants, setRestaurants] = useState<AdminRestaurantListItem[]>([]);
  const [search, setSearch] = useState('');
  const [searchDebounced, setSearchDebounced] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [inviteLoadingId, setInviteLoadingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [invite, setInvite] = useState<InviteState | null>(null);

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [unp, setUnp] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerFirstName, setOwnerFirstName] = useState('');
  const [ownerLastName, setOwnerLastName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');

  useEffect(() => {
    const timer = window.setTimeout(() => setSearchDebounced(search.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  const loadRestaurants = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllRestaurants(accessToken, searchDebounced || undefined);
      setRestaurants(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось загрузить заведения');
    } finally {
      setLoading(false);
    }
  }, [accessToken, searchDebounced]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch on mount / search change
    void loadRestaurants();
  }, [loadRestaurants]);

  async function handleCreateSubmit(event: FormEvent) {
    event.preventDefault();
    setCreating(true);
    setError(null);

    try {
      const response = await createRestaurantByAdmin(accessToken, {
        name: name.trim(),
        address: address.trim(),
        unp: unp.trim() || undefined,
        customDomain: customDomain.trim() || undefined,
        owner: {
          email: ownerEmail.trim(),
          firstName: ownerFirstName.trim(),
          lastName: ownerLastName.trim() || undefined,
          phone: ownerPhone.trim() || undefined,
        },
      });
      setInvite({
        restaurantId: response.restaurant.id,
        restaurantName: response.restaurant.name,
        setPasswordUrl: response.setPasswordUrl,
        expiresAt: response.expiresAt,
      });
      setShowCreateForm(false);
      setName('');
      setAddress('');
      setUnp('');
      setCustomDomain('');
      setOwnerEmail('');
      setOwnerFirstName('');
      setOwnerLastName('');
      setOwnerPhone('');
      await loadRestaurants();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось создать заведение');
    } finally {
      setCreating(false);
    }
  }

  async function handleOwnerInvite(restaurant: AdminRestaurantListItem) {
    setInviteLoadingId(restaurant.id);
    setError(null);
    try {
      const response = await createOwnerInvite(accessToken, restaurant.id);
      setInvite({
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        setPasswordUrl: response.setPasswordUrl,
        expiresAt: response.expiresAt,
      });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось создать ссылку для владельца');
    } finally {
      setInviteLoadingId(null);
    }
  }

  async function handleDeleteRestaurant(restaurant: AdminRestaurantListItem) {
    const confirmed = window.confirm(
      `Удалить заведение «${restaurant.name}»? Это действие необратимо.`,
    );
    if (!confirmed) return;

    setDeletingId(restaurant.id);
    setError(null);
    try {
      await deleteRestaurantByAdmin(accessToken, restaurant.id);
      if (invite?.restaurantId === restaurant.id) {
        setInvite(null);
      }
      await loadRestaurants();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось удалить заведение');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div data-testid="super-admin-restaurants-tab">
      {error && <p className="admin__error">{error}</p>}

      <div className="admin__toolbar">
        <input
          type="search"
          className="admin__search"
          placeholder="Поиск по названию или email владельца"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          data-testid="restaurants-search"
        />
        <button
          type="button"
          className="admin__btn admin__btn--primary"
          onClick={() => setShowCreateForm((v) => !v)}
          data-testid="restaurants-create-toggle"
        >
          {showCreateForm ? 'Скрыть форму' : 'Создать заведение'}
        </button>
      </div>

      {invite && (
        <div className="admin__invite-wrap">
          <p className="admin__meta">
            Заведение: <strong>{invite.restaurantName}</strong>
          </p>
          <InviteLinkCard
            setPasswordUrl={invite.setPasswordUrl}
            expiresAt={invite.expiresAt}
            onClose={() => setInvite(null)}
          />
        </div>
      )}

      {showCreateForm && (
        <form
          className="admin__create-form"
          onSubmit={(e) => void handleCreateSubmit(e)}
          data-testid="create-restaurant-form"
        >
          <h2 className="admin__section-title">Новое заведение</h2>
          <div className="admin__form-grid">
            <label className="admin__field">
              <span>Название</span>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                data-testid="create-restaurant-name"
              />
            </label>
            <label className="admin__field">
              <span>Адрес</span>
              <input
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                data-testid="create-restaurant-address"
              />
            </label>
            <label className="admin__field">
              <span>УНП (необязательно)</span>
              <input value={unp} onChange={(e) => setUnp(e.target.value)} />
            </label>
            <label className="admin__field">
              <span>Свой домен (необязательно)</span>
              <input value={customDomain} onChange={(e) => setCustomDomain(e.target.value)} />
            </label>
            <label className="admin__field">
              <span>Email владельца</span>
              <input
                type="email"
                required
                value={ownerEmail}
                onChange={(e) => setOwnerEmail(e.target.value)}
                data-testid="create-restaurant-owner-email"
              />
            </label>
            <label className="admin__field">
              <span>Имя владельца</span>
              <input
                required
                value={ownerFirstName}
                onChange={(e) => setOwnerFirstName(e.target.value)}
                data-testid="create-restaurant-owner-first-name"
              />
            </label>
            <label className="admin__field">
              <span>Фамилия владельца</span>
              <input value={ownerLastName} onChange={(e) => setOwnerLastName(e.target.value)} />
            </label>
            <label className="admin__field">
              <span>Телефон владельца</span>
              <input value={ownerPhone} onChange={(e) => setOwnerPhone(e.target.value)} />
            </label>
          </div>
          <button
            type="submit"
            className="admin__btn admin__btn--approve"
            disabled={creating}
            data-testid="create-restaurant-submit"
          >
            {creating ? 'Создание…' : 'Создать'}
          </button>
        </form>
      )}

      {loading ? (
        <p className="admin__empty">Загрузка заведений…</p>
      ) : restaurants.length === 0 ? (
        <p className="admin__empty">Заведения не найдены.</p>
      ) : (
        <div className="admin__list">
          {restaurants.map((restaurant) => (
            <article
              key={restaurant.id}
              className="admin__card"
              data-testid={`restaurant-row-${restaurant.id}`}
            >
              <h2 className="admin__card-title">{restaurant.name}</h2>
              <p className="admin__meta">
                Статус: {restaurant.status}
                <br />
                Владелец: {restaurant.ownerEmail ?? '—'}
                {restaurant.customDomain && (
                  <>
                    <br />
                    Домен: {restaurant.customDomain}
                  </>
                )}
                <br />
                Создано: <ClientFormattedDate iso={restaurant.createdAt} />
              </p>
              <div className="admin__actions">
                <button
                  type="button"
                  className="admin__btn admin__btn--secondary"
                  disabled={inviteLoadingId === restaurant.id}
                  onClick={() => void handleOwnerInvite(restaurant)}
                  data-testid={`restaurant-invite-${restaurant.id}`}
                >
                  {inviteLoadingId === restaurant.id ? 'Ссылка…' : 'Новая ссылка владельцу'}
                </button>
                <button
                  type="button"
                  className="admin__btn admin__btn--reject"
                  disabled={deletingId === restaurant.id}
                  onClick={() => void handleDeleteRestaurant(restaurant)}
                  data-testid={`restaurant-delete-${restaurant.id}`}
                >
                  {deletingId === restaurant.id ? 'Удаление…' : 'Удалить'}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

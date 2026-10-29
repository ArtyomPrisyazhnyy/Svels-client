'use client';

import { useCallback, useEffect, useState } from 'react';
import { revalidateRestaurantPublicPage } from '@/features/restaurants/actions/revalidate-restaurant-public-page.action';
import { ApiError } from '@/shared/api/api-client';
import type { RestaurantStyling, UpdateRestaurantStylingPayload } from '@/shared/types/restaurant-styling';
import { Skeleton } from '@/shared/ui';
import { useAuthStore } from '@/store/auth.store';
import { fetchRestaurantStyling, updateRestaurantStyling } from '../api/styling.api';
import { StylingWorkspace, type StylingStatus } from '../styling/StylingWorkspace';
import { normalizeStyling, stylingEquals, toStylingPayload } from '../styling/styling-model';
import '../styles/styling-admin.scss';

export default function StylingAdminPage() {
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const restaurantId = user?.restaurantId;

  const [saved, setSaved] = useState<RestaurantStyling | null>(null);
  const [draft, setDraft] = useState<RestaurantStyling | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<StylingStatus | null>(null);

  const loadSettings = useCallback(async () => {
    if (!restaurantId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const data = normalizeStyling(await fetchRestaurantStyling(restaurantId));
      setSaved(data);
      setDraft(data);
    } catch (err) {
      setStatus({
        tone: 'error',
        message: err instanceof ApiError ? err.message : 'Не удалось загрузить стилизацию',
      });
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch on mount
    void loadSettings();
  }, [loadSettings]);

  function updateDraft(patch: UpdateRestaurantStylingPayload) {
    setStatus(null);
    setDraft((prev) => (prev ? { ...prev, ...patch } : prev));
  }

  async function handleSave() {
    if (!restaurantId || !accessToken || !draft) {
      return;
    }

    setSaving(true);
    setStatus(null);

    try {
      const updated = normalizeStyling(
        await updateRestaurantStyling(restaurantId, accessToken, toStylingPayload(draft)),
      );
      setSaved(updated);
      setDraft(updated);
      setStatus({ tone: 'success', message: 'Стилизация сохранена' });
      await revalidateRestaurantPublicPage(restaurantId);
    } catch (err) {
      setStatus({
        tone: 'error',
        message: err instanceof ApiError ? err.message : 'Не удалось сохранить стилизацию',
      });
    } finally {
      setSaving(false);
    }
  }

  if (!restaurantId) {
    return <p className="styling-notice">Заявка ещё на модерации или ресторан не привязан к аккаунту.</p>;
  }

  if (loading) {
    return (
      <div className="styling-skeleton" data-testid="styling-admin-loading" aria-busy="true">
        <Skeleton variant="rect" height={88} radius="var(--radius-lg)" />
        <Skeleton variant="rect" height={220} radius="var(--radius-lg)" />
        <Skeleton variant="rect" height={180} radius="var(--radius-lg)" />
        <Skeleton variant="rect" height={160} radius="var(--radius-lg)" />
      </div>
    );
  }

  if (!draft) {
    return status ? (
      <p className={`styling-status styling-status--${status.tone}`} role="alert">
        {status.message}
      </p>
    ) : null;
  }

  return (
    <StylingWorkspace
      layout="studio"
      value={draft}
      onChange={updateDraft}
      onSave={() => void handleSave()}
      saving={saving}
      saveDisabled={saving || !saved || stylingEquals(saved, draft)}
      status={status}
    />
  );
}

'use client';

import { useEffect, useState } from 'react';
import { ApiError } from '../../../shared/api/api-client';
import { useAuthStore } from '../../../store/auth.store';
import { useLayoutStore } from '../../../store/layout-store';
import { fetchFloorPlans } from '../api/floor-plans.api';
import { FloorPlanEditor } from '@/features/floor-plan/components/FloorPlanEditor';
import { fetchBookingSettings } from '../api/booking-settings.api';

export default function FloorPlanAdminPage() {
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const restaurantId = user?.restaurantId;

  const loadLayout = useLayoutStore((s) => s.loadLayout);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!restaurantId || !accessToken) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    Promise.all([
      fetchFloorPlans(restaurantId, accessToken),
      fetchBookingSettings(restaurantId),
    ])
      .then(([layout, settings]) => {
        if (cancelled) return;
        loadLayout(layout.zones);
        if (settings) {
          useLayoutStore.setState({
            depositScheme: settings.depositScheme,
            globalDepositAmount: settings.depositAmount,
            bookingDurationMinutes: settings.bookingDurationMinutes,
          });
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : 'Не удалось загрузить планировку');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [restaurantId, accessToken, loadLayout]);

  if (!restaurantId) {
    return (
      <p className="floor-plan-admin__notice">
        Заявка ещё на модерации или ресторан не привязан к аккаунту.
      </p>
    );
  }

  if (loading) {
    return <p className="floor-plan-admin__notice">Загрузка конструктора планировки…</p>;
  }

  if (error) {
    return <p className="floor-plan-admin__notice floor-plan-admin__notice--error">{error}</p>;
  }

  if (!accessToken) {
    return <p className="floor-plan-admin__notice">Требуется авторизация.</p>;
  }

  return <FloorPlanEditor restaurantId={restaurantId} token={accessToken} />;
}

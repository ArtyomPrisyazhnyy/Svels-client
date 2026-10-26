'use client';

import { useCallback, useEffect, useState } from 'react';
import { fetchOrderSettings, setOrdersPaused } from '../api/order-settings.api';
import { Checkbox } from '@/shared/ui/Checkbox/Checkbox';
import { formatOrderApiError } from './orderErrors';

interface OrdersPauseToggleProps {
  restaurantId: string;
  token: string;
  onError: (message: string) => void;
}

export function OrdersPauseToggle({ restaurantId, token, onError }: OrdersPauseToggleProps) {
  const [paused, setPaused] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const settings = await fetchOrderSettings(restaurantId);
      setPaused(Boolean(settings.ordersPaused));
    } catch (err) {
      onError(formatOrderApiError(err, 'Не удалось загрузить настройки приёма заказов'));
    } finally {
      setLoading(false);
    }
  }, [restaurantId, onError]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      void load();
    });
    return () => cancelAnimationFrame(frame);
  }, [load]);

  async function handleToggle(next: boolean) {
    setSaving(true);
    try {
      const updated = await setOrdersPaused(restaurantId, token, { ordersPaused: next });
      setPaused(Boolean(updated.ordersPaused));
    } catch (err) {
      onError(formatOrderApiError(err, 'Не удалось изменить паузу приёма'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Checkbox
      className="orders-admin__pause"
      checked={paused}
      disabled={loading || saving}
      onChange={(e) => void handleToggle(e.target.checked)}
      testId="orders-pause-toggle"
      label={
        <span className="orders-admin__pause-copy">
          <strong>Пауза приёма заказов</strong>
          <span>
            {loading
              ? 'Загрузка…'
              : paused
                ? 'Новые заказы от гостей временно не принимаются'
                : 'Гости могут оформлять предзаказы'}
          </span>
        </span>
      }
    />
  );
}

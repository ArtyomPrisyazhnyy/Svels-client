'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { fetchRestaurantLocations } from '../api/locations.api';
import { updateOrderStatus } from '../api/orders.api';
import type { RestaurantLocation } from '@/shared/types/restaurant-location';
import type { OrderDto } from '@/shared/types/pre-order';
import { CancelOrderModal } from '../orders/CancelOrderModal';
import { OrderList } from '../orders/OrderList';
import { OrdersPauseToggle } from '../orders/OrdersPauseToggle';
import { TelegramConnectPanel } from '../orders/TelegramConnectPanel';
import { formatDateMinsk } from '../orders/dateMinsk';
import { formatOrderApiError } from '../orders/orderErrors';
import { ORDERS_TABS, TAB_STATUSES, type OrdersTabId } from '../orders/orderLabels';
import { useNewOrderSound } from '../orders/useNewOrderSound';
import { useOrdersPolling } from '../orders/useOrdersPolling';
import '../styles/orders-admin.scss';

function canManageTelegram(role: string | undefined): boolean {
  return role === 'restaurant_admin' || role === 'restaurant_manager';
}

export default function OrdersAdminPage() {
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const restaurantId = user?.restaurantId;
  const role = user?.role;

  const [tab, setTab] = useState<OrdersTabId>('new');
  const [date, setDate] = useState(() => formatDateMinsk());
  const [locations, setLocations] = useState<RestaurantLocation[]>([]);
  const [bannerError, setBannerError] = useState<string | null>(null);
  const [busyOrderId, setBusyOrderId] = useState<string | null>(null);
  const [cancelTarget, setCancelTarget] = useState<OrderDto | null>(null);
  const [cancelBusy, setCancelBusy] = useState(false);

  const { soundEnabled, soundArmed, armSound, disableSound, playNewOrderSound } =
    useNewOrderSound();

  const onNewOrdersDetected = useCallback(() => {
    playNewOrderSound();
  }, [playNewOrderSound]);

  const {
    orders,
    loading,
    error,
    setError,
    newCount,
    reload,
    patchOrder,
    removeOrder,
  } = useOrdersPolling(restaurantId, accessToken, tab, date, onNewOrdersDetected);

  useEffect(() => {
    if (!restaurantId) {
      return;
    }
    void fetchRestaurantLocations(restaurantId)
      .then(setLocations)
      .catch(() => {
        // точки не критичны для списка
      });
  }, [restaurantId]);

  async function handleStatusChange(orderId: string, status: OrderDto['status']) {
    if (!restaurantId || !accessToken) {
      return;
    }
    setBusyOrderId(orderId);
    setBannerError(null);
    setError(null);
    try {
      const updated = await updateOrderStatus(restaurantId, orderId, accessToken, { status });
      if (!TAB_STATUSES[tab].includes(updated.status)) {
        removeOrder(orderId);
      } else {
        patchOrder(updated);
      }
    } catch (err) {
      const message = formatOrderApiError(err, 'Не удалось обновить статус');
      setBannerError(message);
    } finally {
      setBusyOrderId(null);
    }
  }

  async function handleCancelConfirm(reason: string) {
    if (!restaurantId || !accessToken || !cancelTarget) {
      return;
    }
    setCancelBusy(true);
    setBannerError(null);
    try {
      const updated = await updateOrderStatus(restaurantId, cancelTarget.id, accessToken, {
        status: 'cancelled',
        cancelReason: reason,
      });
      setCancelTarget(null);
      if (!TAB_STATUSES[tab].includes(updated.status)) {
        removeOrder(updated.id);
      } else {
        patchOrder(updated);
      }
    } catch (err) {
      setBannerError(formatOrderApiError(err, 'Не удалось отменить заказ'));
    } finally {
      setCancelBusy(false);
    }
  }

  if (!restaurantId) {
    return (
      <p className="orders-admin__notice" data-testid="orders-admin-page">
        Заявка ещё на модерации или ресторан не привязан к аккаунту.
      </p>
    );
  }

  const displayError = bannerError ?? error;

  return (
    <div className="orders-admin" data-testid="orders-admin-page">
      <header className="orders-admin__header">
        <div>
          <h2>Заказы</h2>
          <p className="orders-admin__intro">Очередь предзаказов на выбранный день.</p>
        </div>
        <label className="orders-admin__date-field">
          <span>Дата</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            data-testid="orders-date-picker"
          />
        </label>
      </header>

      {restaurantId && accessToken && (
        <OrdersPauseToggle
          restaurantId={restaurantId}
          token={accessToken}
          onError={setBannerError}
        />
      )}

      <div className="orders-admin__toolbar">
        <div className="orders-admin__tabs" role="tablist">
          {ORDERS_TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              className={`orders-admin__tab${tab === item.id ? ' orders-admin__tab--active' : ''}`}
              onClick={() => setTab(item.id)}
              data-testid={`orders-tab-${item.id}`}
            >
              {item.label}
              {item.id === 'new' && newCount > 0 && (
                <span className="orders-admin__tab-badge" data-testid="orders-new-badge">
                  {newCount}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="orders-admin__sound">
          {soundEnabled && soundArmed ? (
            <button
              type="button"
              className="orders-admin__btn orders-admin__btn--ghost orders-admin__btn--small"
              onClick={disableSound}
            >
              Звук вкл.
            </button>
          ) : (
            <button
              type="button"
              className="orders-admin__btn orders-admin__btn--secondary orders-admin__btn--small"
              onClick={() => void armSound()}
              data-testid="orders-enable-sound"
            >
              Включить звук
            </button>
          )}
          <button
            type="button"
            className="orders-admin__btn orders-admin__btn--ghost orders-admin__btn--small"
            onClick={() => void reload()}
          >
            Обновить
          </button>
        </div>
      </div>

      {displayError && <p className="orders-admin__error">{displayError}</p>}

      <OrderList
        orders={orders}
        loading={loading}
        role={role}
        locations={locations}
        busyOrderId={busyOrderId}
        onStatusChange={(id, status) => void handleStatusChange(id, status)}
        onCancelClick={setCancelTarget}
      />

      {accessToken && canManageTelegram(role) && (
        <TelegramConnectPanel restaurantId={restaurantId} token={accessToken} />
      )}

      <CancelOrderModal
        open={cancelTarget != null}
        orderNumber={cancelTarget?.orderNumber ?? null}
        busy={cancelBusy}
        onClose={() => setCancelTarget(null)}
        onConfirm={(reason) => void handleCancelConfirm(reason)}
      />
    </div>
  );
}

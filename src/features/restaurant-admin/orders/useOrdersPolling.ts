'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { OrderDto } from '@/shared/types/pre-order';
import { fetchRestaurantOrders } from '../api/orders.api';
import { formatOrderApiError } from './orderErrors';
import type { OrdersTabId } from './orderLabels';
import { TAB_STATUSES, tabStatusQuery } from './orderLabels';

const POLL_INTERVAL_MS = 10_000;

export function useOrdersPolling(
  restaurantId: string | undefined,
  token: string | null,
  tab: OrdersTabId,
  date: string,
  onNewOrdersDetected?: (newOrderIds: string[]) => void,
) {
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newCount, setNewCount] = useState(0);
  const serverTimeRef = useRef<string | null>(null);
  const knownIdsRef = useRef<Set<string>>(new Set());
  const knownNewIdsRef = useRef<Set<string>>(new Set());
  const newServerTimeRef = useRef<string | null>(null);
  const openNewOrdersRef = useRef<Map<string, OrderDto>>(new Map());
  const tabRef = useRef(tab);
  const dateRef = useRef(date);

  const syncNewCount = useCallback(() => {
    setNewCount(openNewOrdersRef.current.size);
  }, []);

  const applyNewOrderSnapshots = useCallback(
    (items: OrderDto[]) => {
      const map = openNewOrdersRef.current;
      for (const item of items) {
        if (item.status === 'new') {
          map.set(item.id, item);
        } else if (map.has(item.id)) {
          map.delete(item.id);
        }
      }
      syncNewCount();
    },
    [syncNewCount],
  );

  const mergeItems = useCallback(
    (incoming: OrderDto[], replace: boolean) => {
      const allowed = new Set(TAB_STATUSES[tabRef.current]);
      setOrders((prev) => {
        const map = new Map<string, OrderDto>();
        if (!replace) {
          for (const o of prev) {
            map.set(o.id, o);
          }
        }
        for (const o of incoming) {
          if (allowed.has(o.status)) {
            map.set(o.id, o);
          } else {
            map.delete(o.id);
          }
        }
        if (!replace) {
          for (const o of prev) {
            if (!allowed.has(o.status)) {
              map.delete(o.id);
            }
          }
        }
        const next = Array.from(map.values()).sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        return next;
      });
      applyNewOrderSnapshots(incoming);
    },
    [applyNewOrderSnapshots],
  );

  const loadFull = useCallback(async () => {
    if (!restaurantId || !token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    serverTimeRef.current = null;
    knownIdsRef.current = new Set();
    knownNewIdsRef.current = new Set();
    newServerTimeRef.current = null;

    try {
      const res = await fetchRestaurantOrders(restaurantId, token, {
        status: tabStatusQuery(tab),
        date,
        limit: 50,
      });
      serverTimeRef.current = res.serverTime;
      mergeItems(res.items, true);
      for (const item of res.items) {
        knownIdsRef.current.add(item.id);
      }
    } catch (err) {
      setError(formatOrderApiError(err, 'Не удалось загрузить заказы'));
    } finally {
      setLoading(false);
    }
  }, [restaurantId, token, tab, date, mergeItems]);

  const pollIncremental = useCallback(async () => {
    if (!restaurantId || !token || !serverTimeRef.current) {
      return;
    }
    try {
      const res = await fetchRestaurantOrders(restaurantId, token, {
        status: tabStatusQuery(tabRef.current),
        date: dateRef.current,
        updatedSince: serverTimeRef.current,
        limit: 50,
      });
      serverTimeRef.current = res.serverTime;

      const freshNewIds: string[] = [];
      for (const item of res.items) {
        if (item.status === 'new' && !knownIdsRef.current.has(item.id)) {
          freshNewIds.push(item.id);
        }
        knownIdsRef.current.add(item.id);
      }
      if (freshNewIds.length > 0 && onNewOrdersDetected) {
        onNewOrdersDetected(freshNewIds);
      }

      if (res.items.length > 0) {
        mergeItems(res.items, false);
      }
    } catch {
      // тихий polling — не затираем экран ошибкой
    }
  }, [restaurantId, token, mergeItems, onNewOrdersDetected]);

  const pollNewOrders = useCallback(async () => {
    if (!restaurantId || !token) {
      return;
    }
    try {
      const params: Parameters<typeof fetchRestaurantOrders>[2] = {
        status: 'new',
        date: dateRef.current,
        limit: 50,
      };
      if (newServerTimeRef.current) {
        params.updatedSince = newServerTimeRef.current;
      }
      const res = await fetchRestaurantOrders(restaurantId, token, params);
      newServerTimeRef.current = res.serverTime;

      const freshNewIds: string[] = [];
      for (const item of res.items) {
        if (!knownNewIdsRef.current.has(item.id)) {
          if (knownNewIdsRef.current.size > 0) {
            freshNewIds.push(item.id);
          }
          knownNewIdsRef.current.add(item.id);
        }
      }
      if (freshNewIds.length > 0 && onNewOrdersDetected) {
        onNewOrdersDetected(freshNewIds);
      }

      if (!params.updatedSince) {
        const next = new Map<string, OrderDto>();
        for (const item of res.items) {
          if (item.status === 'new') {
            next.set(item.id, item);
          }
        }
        openNewOrdersRef.current = next;
        syncNewCount();
      } else {
        applyNewOrderSnapshots(res.items);
      }
    } catch {
      // ignore
    }
  }, [restaurantId, token, onNewOrdersDetected, applyNewOrderSnapshots, syncNewCount]);

  useEffect(() => {
    tabRef.current = tab;
    dateRef.current = date;
    openNewOrdersRef.current = new Map();
    syncNewCount();
    const frame = requestAnimationFrame(() => {
      void loadFull();
      void pollNewOrders();
    });
    return () => cancelAnimationFrame(frame);
  }, [tab, date, loadFull, pollNewOrders, syncNewCount]);

  useEffect(() => {
    if (!restaurantId || !token) {
      return undefined;
    }

    let timer: ReturnType<typeof setInterval> | null = null;

    const tick = () => {
      if (document.hidden) {
        return;
      }
      void pollIncremental();
      void pollNewOrders();
    };

    const frame = requestAnimationFrame(() => {
      timer = setInterval(tick, POLL_INTERVAL_MS);
    });

    const onVisibility = () => {
      if (!document.hidden) {
        void pollIncremental();
        void pollNewOrders();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(frame);
      if (timer) {
        clearInterval(timer);
      }
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [restaurantId, token, pollIncremental, pollNewOrders]);

  const patchOrder = useCallback(
    (updated: OrderDto) => {
      mergeItems([updated], false);
      void pollNewOrders();
    },
    [mergeItems, pollNewOrders],
  );

  const removeOrder = useCallback(
    (orderId: string) => {
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      if (openNewOrdersRef.current.delete(orderId)) {
        syncNewCount();
      }
      void pollNewOrders();
    },
    [pollNewOrders, syncNewCount],
  );

  return {
    orders,
    loading,
    error,
    setError,
    newCount,
    reload: loadFull,
    patchOrder,
    removeOrder,
  };
}

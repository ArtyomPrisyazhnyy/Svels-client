'use client';

import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import { useActiveItems, useLayoutStore, resolveTableDeposit } from '@/store/layout-store';
import { fetchPublicLayout, fetchTablesAvailability } from '@/features/restaurant-admin/api/floor-plans.api';
import type { PublicFloorPlanLayoutResponse, PublicFloorPlanTable, TablesAvailabilityResponse } from '@/shared/types/floor-plan';
import { STAGE_HEIGHT, STAGE_WIDTH, todayIso } from './constants';
import '../styles/floor-plan-viewer.scss';

// Konva требует `window` — отключаем SSR для Stage.
const KonvaStage = dynamic(
  () => import('./KonvaStage').then((m) => m.KonvaStage),
  { ssr: false, loading: () => <div className="fp-viewer__status">Загрузка холста…</div> },
);

interface FloorPlanViewerProps {
  restaurantId: string;
  /** Колбэк выбора стола гостем (передаётся tableId + рассчитанный депозит). */
  onTableSelect?: (table: PublicFloorPlanTable, depositAmount: number) => void;
  /** Колбэк изменения даты/времени — чтобы родительская страница знала выбранный слот для брони. */
  onDateTimeChange?: (date: string, time: string) => void;
  initialDate?: string;
  initialTime?: string;
}

export function FloorPlanViewer({
  restaurantId,
  onTableSelect,
  onDateTimeChange,
  initialDate,
  initialTime,
}: FloorPlanViewerProps) {
  const [date, setDate] = useState(initialDate ?? todayIso());
  const [time, setTime] = useState(initialTime ?? '19:00');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPublicLayout = useLayoutStore((s) => s.loadPublicLayout);
  const setAvailability = useLayoutStore((s) => s.setAvailability);
  const selectTableForBooking = useLayoutStore((s) => s.selectTableForBooking);
  const selectedTableIdForBooking = useLayoutStore((s) => s.selectedTableIdForBooking);
  const depositScheme = useLayoutStore((s) => s.depositScheme);
  const globalDepositAmount = useLayoutStore((s) => s.globalDepositAmount);
  const zones = useLayoutStore((s) => s.zones);
  const activeZoneId = useLayoutStore((s) => s.activeZoneId);
  const setActiveZone = useLayoutStore((s) => s.setActiveZone);
  const availability = useLayoutStore((s) => s.availability);
  const items = useActiveItems();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchPublicLayout(restaurantId)
      .then((layout: PublicFloorPlanLayoutResponse) => {
        if (cancelled) return;
        loadPublicLayout(layout);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Не удалось загрузить планировку');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [restaurantId, loadPublicLayout]);

  // Загрузка занятости столов при изменении date/time
  useEffect(() => {
    if (zones.length === 0) return;
    let cancelled = false;
    fetchTablesAvailability(restaurantId, date, time)
      .then((res: TablesAvailabilityResponse) => {
        if (!cancelled) setAvailability(res.busy);
      })
      .catch(() => {
        if (!cancelled) setAvailability([]);
      });
    return () => {
      cancelled = true;
    };
  }, [restaurantId, date, time, zones.length, setAvailability]);

  // Уведомляем родителя об изменении даты/времени (чтобы он знал слот для брони)
  useEffect(() => {
    onDateTimeChange?.(date, time);
  }, [date, time, onDateTimeChange]);

  const selectedTable = useMemo(() => {
    if (!selectedTableIdForBooking || !activeZoneId) return null;
    const zone = zones.find((z) => z.id === activeZoneId);
    return zone?.tables.find((t) => t.id === selectedTableIdForBooking) ?? null;
  }, [selectedTableIdForBooking, activeZoneId, zones]);

  const selectedDeposit = useMemo(() => {
    if (!selectedTable) return 0;
    const zone = zones.find((z) => z.id === activeZoneId) ?? null;
    return resolveTableDeposit(depositScheme, globalDepositAmount, zone, selectedTable);
  }, [selectedTable, zones, activeZoneId, depositScheme, globalDepositAmount]);

  function handleConfirm() {
    if (!selectedTable) return;
    onTableSelect?.(selectedTable, selectedDeposit);
  }

  const busyCount = items.filter((i) => i.kind === 'table' && availability.has(i.data.id)).length;
  const freeCount = items.filter((i) => i.kind === 'table' && !availability.has(i.data.id)).length;

  return (
    <div className="fp-viewer">
      <div className="fp-viewer__controls">
        <label className="fp-viewer__field">
          <span>Дата</span>
          <input type="date" value={date} min={todayIso()} onChange={(e) => setDate(e.target.value)} />
        </label>
        <label className="fp-viewer__field">
          <span>Время</span>
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        </label>
        <div className="fp-viewer__zones">
          {zones.map((z) => (
            <button
              key={z.id}
              type="button"
              className={z.id === activeZoneId ? 'fp-viewer__zone fp-viewer__zone--active' : 'fp-viewer__zone'}
              onClick={() => setActiveZone(z.id)}
            >
              {z.name}
            </button>
          ))}
        </div>
      </div>

      <div className="fp-viewer__legend">
        <span><i className="fp-viewer__dot fp-viewer__dot--free" /> Свободно ({freeCount})</span>
        <span><i className="fp-viewer__dot fp-viewer__dot--busy" /> Занято ({busyCount})</span>
        {selectedTable && (
          <span><i className="fp-viewer__dot fp-viewer__dot--selected" /> Выбран: {selectedTable.label}</span>
        )}
      </div>

      {loading && <p className="fp-viewer__status">Загрузка планировки…</p>}
      {error && <p className="fp-viewer__error">{error}</p>}

      {!loading && !error && (
        <div className="fp-viewer__canvas-wrap">
          <KonvaStage width={STAGE_WIDTH} height={STAGE_HEIGHT} />
        </div>
      )}

      {selectedTable && (
        <div className="fp-viewer__confirm">
          <div className="fp-viewer__confirm-info">
            <strong>Стол {selectedTable.label}</strong>
            <span>{selectedTable.capacity} мест · депозит {selectedDeposit} BYN</span>
          </div>
          <button type="button" className="fp-viewer__confirm-btn" onClick={handleConfirm}>
            Забронировать
          </button>
        </div>
      )}
    </div>
  );
}

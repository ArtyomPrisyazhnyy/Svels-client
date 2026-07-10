'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLayoutStore, createNewTable } from '@/store/layout-store';
import {
  createFloorPlan,
  deleteFloorPlan,
  saveLayout,
  setDepositScheme,
  updateFloorPlan,
} from '@/features/restaurant-admin/api/floor-plans.api';
import { revalidateRestaurantPublicPage } from '@/features/restaurants/actions/revalidate-restaurant-public-page.action';
import type { DepositScheme, FloorPlan, FloorPlanZone, LayoutTablePayload, SaveLayoutPayload, TableShape } from '@/shared/types/floor-plan';
import { DepositSettingsPanel } from './DepositSettingsPanel';
import { RightInspectorPanel } from './RightInspectorPanel';
import { LayersPanel } from './LayersPanel';
import { STAGE_HEIGHT, STAGE_WIDTH } from './constants';
import { Toolbar } from './Toolbar';
import { useHotkeys } from './useHotkeys';
import '../styles/floor-plan-editor.scss';

// Konva требует `window` — отключаем SSR для Stage.
const KonvaStage = dynamic(
  () => import('./KonvaStage').then((m) => m.KonvaStage),
  { ssr: false, loading: () => <div className="fp-editor__canvas-loading">Загрузка холста…</div> },
);

interface FloorPlanEditorProps {
  restaurantId: string;
  token: string;
}

export function FloorPlanEditor({ restaurantId, token }: FloorPlanEditorProps) {
  const zones = useLayoutStore((s) => s.zones);
  const activeZoneId = useLayoutStore((s) => s.activeZoneId);
  const depositScheme = useLayoutStore((s) => s.depositScheme);
  const loadLayout = useLayoutStore((s) => s.loadLayout);
  const addZone = useLayoutStore((s) => s.addZone);
  const updateZone = useLayoutStore((s) => s.updateZone);
  const removeZone = useLayoutStore((s) => s.removeZone);
  const addTable = useLayoutStore((s) => s.addTable);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dirtyRef = useRef(false);

  // Подписка на изменения зон для auto-save
  const zonesJson = JSON.stringify(zones);
  useEffect(() => {
    if (!activeZoneId || zones.length === 0) return;
    dirtyRef.current = true;
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      void saveActiveZone();
      dirtyRef.current = false;
    }, 1500);
    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zonesJson, activeZoneId]);

  const saveActiveZone = useCallback(async () => {
    if (!activeZoneId) return;
    const zone = zones.find((z) => z.id === activeZoneId);
    if (!zone) return;
    setSaving(true);
    setError(null);
    try {
      const tables: LayoutTablePayload[] = zone.tables.map((t) => ({
        id: t.id,
        label: t.label,
        objectType: t.objectType,
        shape: t.shape,
        capacity: t.capacity,
        minCapacity: t.minCapacity,
        positionX: t.positionX ?? 0,
        positionY: t.positionY ?? 0,
        width: t.width,
        height: t.height,
        points: t.points ?? undefined,
        seats: t.seats ?? undefined,
        rotation: t.rotation,
        cornerRadius: t.cornerRadius,
        depositAmount: t.depositAmount,
        isActive: t.isActive,
        visibleToGuests: t.visibleToGuests,
        description: t.description ?? undefined,
      }));
      const payload: SaveLayoutPayload = {
        decorData: zone.decorData ?? { grid: { size: 20, visible: true, color: '#e5e7eb' }, objects: [] },
        tables,
      };
      await saveLayout(restaurantId, token, activeZoneId, payload);
      await revalidateRestaurantPublicPage(restaurantId);
      setLastSavedAt(Date.now());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось сохранить планировку');
    } finally {
      setSaving(false);
    }
  }, [activeZoneId, zones, restaurantId, token]);

  useHotkeys({ onSave: () => void saveActiveZone(), canSave: true });

  async function handleAddZone() {
    const name = prompt('Название нового зала:', `Зал ${zones.length + 1}`);
    if (!name) return;
    try {
      const created: FloorPlan = await createFloorPlan(restaurantId, token, {
        name,
        sortOrder: zones.length,
      });
      const zone: FloorPlanZone = {
        ...created,
        tables: [],
      };
      addZone(zone);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось создать зал');
    }
  }

  async function handleRenameZone() {
    if (!activeZoneId) return;
    const zone = zones.find((z) => z.id === activeZoneId);
    if (!zone) return;
    const name = prompt('Новое название зала:', zone.name);
    if (!name || name === zone.name) return;
    try {
      await updateFloorPlan(restaurantId, token, activeZoneId, { name });
      updateZone(activeZoneId, { name });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось переименовать зал');
    }
  }

  async function handleDeleteZone() {
    if (!activeZoneId) return;
    const zone = zones.find((z) => z.id === activeZoneId);
    if (!zone) return;
    if (zone.tables.length > 0) {
      setError('Нельзя удалить зал со столами. Сначала удалите столы.');
      return;
    }
    if (!confirm(`Удалить зал «${zone.name}»?`)) return;
    try {
      await deleteFloorPlan(restaurantId, token, activeZoneId);
      removeZone(activeZoneId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось удалить зал');
    }
  }

  function handleAddTable(shape: TableShape) {
    if (!activeZoneId) return;
    const zone = zones.find((z) => z.id === activeZoneId);
    if (!zone) return;
    const index = zone.tables.length + 1;
    const isRound = shape === 'round' || shape === 'oval';
    const isSquare = shape === 'square';
    const isPolygon = shape === 'polygon';
    // Полигон по умолчанию — шестиугольник 96×96, точки в локальных координатах стола.
    const polygonPoints = isPolygon
      ? [48, 0, 96, 24, 96, 72, 48, 96, 0, 72, 0, 24]
      : undefined;
    const table = createNewTable(activeZoneId, restaurantId, index, {
      shape,
      width: isRound ? 96 : isSquare ? 80 : isPolygon ? 96 : 96,
      height: isRound ? 96 : isSquare ? 80 : isPolygon ? 96 : 80,
      points: polygonPoints,
    });
    addTable(activeZoneId, table);
  }

  function handleDepositSet(restId: string, tok: string, payload: { scheme: DepositScheme; amount: number }) {
    return setDepositScheme(restId, tok, payload);
  }

  return (
    <div className="fp-editor">
      <Toolbar
        onSave={() => void saveActiveZone()}
        saving={saving}
        onAddZone={handleAddZone}
        onRenameZone={handleRenameZone}
        onDeleteZone={handleDeleteZone}
        onAddTable={handleAddTable}
      />

      {error && <p className="fp-editor__error">{error}</p>}

      <div className="fp-editor__body">
        <div className="fp-editor__left">
          <LayersPanel />
        </div>

        <div className="fp-editor__canvas-wrap">
          <KonvaStage width={STAGE_WIDTH} height={STAGE_HEIGHT} />
        </div>

        <div className="fp-editor__right">
          <RightInspectorPanel restaurantId={restaurantId} depositScheme={depositScheme} />
          <DepositSettingsPanel
            restaurantId={restaurantId}
            token={token}
            onSetDeposit={handleDepositSet}
          />
        </div>
      </div>

      <footer className="fp-editor__footer">
        {saving && <span>Сохранение…</span>}
        {!saving && lastSavedAt && <span>✓ Сохранено {new Date(lastSavedAt).toLocaleTimeString()}</span>}
        {!saving && !lastSavedAt && dirtyRef.current && <span>• Есть несохранённые изменения</span>}
      </footer>
    </div>
  );
}

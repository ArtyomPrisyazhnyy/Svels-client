import { create } from 'zustand';
import { useMemo } from 'react';
import { v7 as uuidv7 } from 'uuid';
import type {
  DecorLayoutData,
  DecorObject,
  DepositScheme,
  FloorPlanTable,
  FloorPlanZone,
  PublicFloorPlanLayoutResponse,
  PublicFloorPlanTable,
  TableBusyEntry,
  TableObjectType,
  TableShape,
} from '@/shared/types/floor-plan';

export type EditorMode = 'edit' | 'guest';
export type Tool =
  | 'select'
  | 'line'
  | 'polyline'
  | 'zone'
  | 'rect'
  | 'circle'
  | 'text'
  | 'decor-icon';

export type AlignKind =
  | 'left'
  | 'right'
  | 'top'
  | 'bottom'
  | 'center-h'
  | 'center-v'
  | 'distribute-h'
  | 'distribute-v';

/** Унифицированный объект на холсте: стол (бронируемый) или decor (не-бронируемый). */
export type CanvasItem =
  | { kind: 'table'; data: FloorPlanTable | PublicFloorPlanTable }
  | { kind: 'decor'; data: DecorObject };

interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface LayoutSnapshot {
  zones: FloorPlanZone[];
  activeZoneId: string | null;
}

interface LayoutState {
  // ── данные ──
  zones: FloorPlanZone[];
  activeZoneId: string | null;
  depositScheme: DepositScheme;
  globalDepositAmount: number;
  bookingDurationMinutes: number;

  // ── UI-состояние ──
  mode: EditorMode;
  tool: Tool;
  selectedIds: string[];
  /** Под-выделение посадочного места внутри выбранного стола. */
  selectedSeatId: string | null;
  zoom: number;
  pan: { x: number; y: number };
  gridVisible: boolean;

  // ── undo/redo ──
  history: LayoutSnapshot[];
  future: LayoutSnapshot[];

  // ── clipboard (только decor) ──
  clipboard: DecorObject[];

  // ── guest-режим: занятость столов ──
  availability: Map<string, string>; // tableId -> busyUntil ISO
  selectedTableIdForBooking: string | null;

  // ── actions: load ──
  loadLayout: (zones: FloorPlanZone[]) => void;
  loadPublicLayout: (layout: PublicFloorPlanLayoutResponse) => void;
  setMode: (mode: EditorMode) => void;

  // ── actions: zones ──
  setActiveZone: (zoneId: string) => void;
  addZone: (zone: FloorPlanZone) => void;
  updateZone: (zoneId: string, patch: Partial<FloorPlanZone>) => void;
  removeZone: (zoneId: string) => void;

  // ── actions: tool/selection ──
  setTool: (tool: Tool) => void;
  select: (id: string | null) => void;
  toggleSelection: (id: string) => void;
  selectAll: () => void;
  clearSelection: () => void;
  setSelectedSeatId: (seatId: string | null) => void;

  // ── actions: tables ──
  addTable: (zoneId: string, table: FloorPlanTable) => void;
  updateTable: (tableId: string, patch: Partial<FloorPlanTable>) => void;
  removeTable: (tableId: string) => void;

  // ── actions: decor ──
  addDecor: (zoneId: string, decor: DecorObject) => void;
  updateDecor: (zoneId: string, decorId: string, patch: Partial<DecorObject>) => void;
  removeDecor: (zoneId: string, decorId: string) => void;

  // ── actions: transform (multiselect) ──
  moveSelected: (dx: number, dy: number) => void;
  rotateSelected: (deg: number) => void;
  alignSelected: (kind: AlignKind) => void;
  bringForward: (id: string) => void;
  sendBackward: (id: string) => void;
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;

  // ── actions: clipboard ──
  copySelection: () => void;
  pasteSelection: () => void;
  duplicateSelection: () => void;
  deleteSelection: () => void;

  // ── actions: undo/redo ──
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;

  // ── actions: view ──
  setZoom: (zoom: number) => void;
  setPan: (pan: { x: number; y: number }) => void;
  toggleGrid: () => void;

  // ── actions: guest availability ──
  setAvailability: (busy: TableBusyEntry[]) => void;
  selectTableForBooking: (tableId: string | null) => void;

  // ── selectors helpers ──
  getActiveZone: () => FloorPlanZone | null;
  getActiveItems: () => CanvasItem[];
}

const HISTORY_LIMIT = 50;

/**
 * Атомарно добавить снимок текущего состояния в history и очистить future.
 * Используется внутри мутаций в одном `set`-вызове, чтобы история и изменение
 * применялись вместе (без гонок между двумя раздельными set).
 */
function recordHistory(s: LayoutState): { history: LayoutSnapshot[]; future: LayoutSnapshot[] } {
  const snapshot: LayoutSnapshot = {
    zones: cloneZones(s.zones),
    activeZoneId: s.activeZoneId,
  };
  return { history: [...s.history, snapshot].slice(-HISTORY_LIMIT), future: [] };
}

function itemBounds(item: CanvasItem): Bounds {
  if (item.kind === 'table') {
    const t = item.data;
    return {
      x: t.positionX ?? 0,
      y: t.positionY ?? 0,
      width: t.width,
      height: t.height,
    };
  }
  const d = item.data;
  if (d.type === 'line' || d.type === 'polyline' || d.type === 'zone') {
    const xs = d.points.filter((_, i) => i % 2 === 0);
    const ys = d.points.filter((_, i) => i % 2 === 1);
    const minX = Math.min(...xs);
    const minY = Math.min(...ys);
    const maxX = Math.max(...xs);
    const maxY = Math.max(...ys);
    return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
  }
  if (d.type === 'text') {
    const approxWidth = d.text.length * d.fontSize * 0.6;
    return { x: d.x, y: d.y, width: approxWidth, height: d.fontSize };
  }
  return { x: d.x, y: d.y, width: d.width, height: d.height };
}

function moveBounds(item: CanvasItem, dx: number, dy: number): CanvasItem {
  if (item.kind === 'table') {
    const t = item.data;
    return {
      kind: 'table',
      data: {
        ...t,
        positionX: (t.positionX ?? 0) + dx,
        positionY: (t.positionY ?? 0) + dy,
      },
    };
  }
  const d = item.data;
  if (d.type === 'line' || d.type === 'polyline' || d.type === 'zone') {
    const points = d.points.map((p, i) => (i % 2 === 0 ? p + dx : p + dy));
    return { kind: 'decor', data: { ...d, points } as DecorObject };
  }
  return {
    kind: 'decor',
    data: { ...d, x: d.x + dx, y: d.y + dy } as DecorObject,
  };
}

function cloneZone(zone: FloorPlanZone): FloorPlanZone {
  return {
    ...zone,
    decorData: zone.decorData
      ? { grid: { ...zone.decorData.grid }, objects: zone.decorData.objects.map((o) => ({ ...o })) }
      : null,
    tables: zone.tables.map((t) => ({ ...t })),
  };
}

function cloneZones(zones: FloorPlanZone[]): FloorPlanZone[] {
  return zones.map(cloneZone);
}

/** Селектор активной зоны (использовать вне рендера через getState). */
export const selectActiveZone = (s: LayoutState): FloorPlanZone | null =>
  s.zones.find((z) => z.id === s.activeZoneId) ?? null;

/** Селектор унифицированных объектов активной зоны для рендера на холсте. */
export const selectActiveItems = (s: LayoutState): CanvasItem[] => {
  const zone = selectActiveZone(s);
  if (!zone) return [];
  const decor: CanvasItem[] = (zone.decorData?.objects ?? []).map((d) => ({ kind: 'decor', data: d }));
  const tables: CanvasItem[] = zone.tables.map((t) => ({ kind: 'table', data: t }));
  // Столы поверх decor (decor = фон/стены), порядок внутри — по индексу.
  return [...decor, ...tables];
};

/**
 * React-хук для рендера объектов активной зоны на холсте.
 * Не использует `selectActiveItems` как селектор Zustand, т.к. тот возвращает
 * новый массив каждый вызов → `useSyncExternalStore` падает в бесконечный цикл.
 * Здесь массив пересоздаётся только когда меняется ссылка активной зоны.
 */
export function useActiveItems(): CanvasItem[] {
  const zone = useLayoutStore(selectActiveZone);
  return useMemo<CanvasItem[]>(() => {
    if (!zone) return [];
    const decor: CanvasItem[] = (zone.decorData?.objects ?? []).map((d) => ({ kind: 'decor', data: d }));
    const tables: CanvasItem[] = zone.tables.map((t) => ({ kind: 'table', data: t }));
    return [...decor, ...tables];
  }, [zone]);
}

export const useLayoutStore = create<LayoutState>((set, get) => ({
  zones: [],
  activeZoneId: null,
  depositScheme: 'no_deposit',
  globalDepositAmount: 0,
  bookingDurationMinutes: 120,

  mode: 'edit',
  tool: 'select',
  selectedIds: [],
  selectedSeatId: null,
  zoom: 1,
  pan: { x: 0, y: 0 },
  gridVisible: true,

  history: [],
  future: [],
  clipboard: [],

  availability: new Map(),
  selectedTableIdForBooking: null,

  loadLayout: (zones) =>
    set({
      zones: cloneZones(zones),
      activeZoneId: zones[0]?.id ?? null,
      history: [],
      future: [],
      selectedIds: [],
      mode: 'edit',
    }),

  loadPublicLayout: (layout) => {
    // В guest-режиме зоны содержат только публичные столы; приводим к FloorPlanZone-форме.
    const zones: FloorPlanZone[] = layout.zones.map((z) => ({
      id: z.id,
      restaurantId: '',
      name: z.name,
      sortOrder: z.sortOrder,
      depositAmount: z.depositAmount,
      decorData: z.decorData,
      createdAt: '',
      updatedAt: '',
      tables: z.tables.map((t) => ({
        ...t,
        restaurantId: '',
        isActive: true,
        visibleToGuests: true,
        createdAt: '',
        updatedAt: '',
      })),
    }));
    set({
      zones,
      activeZoneId: zones[0]?.id ?? null,
      depositScheme: layout.depositScheme,
      globalDepositAmount: layout.globalDepositAmount,
      bookingDurationMinutes: layout.bookingDurationMinutes,
      mode: 'guest',
      selectedIds: [],
      availability: new Map(),
      selectedTableIdForBooking: null,
      history: [],
      future: [],
    });
  },

  setMode: (mode) => set({ mode }),

  setActiveZone: (zoneId) => set({ activeZoneId: zoneId, selectedIds: [] }),

  addZone: (zone) =>
    set((s) => ({
      ...recordHistory(s),
      zones: [...s.zones, cloneZone(zone)],
      activeZoneId: zone.id,
    })),

  updateZone: (zoneId, patch) =>
    set((s) => ({
      ...recordHistory(s),
      zones: s.zones.map((z) => (z.id === zoneId ? { ...z, ...patch } : z)),
    })),

  removeZone: (zoneId) =>
    set((s) => ({
      ...recordHistory(s),
      zones: s.zones.filter((z) => z.id !== zoneId),
      activeZoneId: s.activeZoneId === zoneId ? (s.zones[0]?.id ?? null) : s.activeZoneId,
    })),

  setTool: (tool) => set({ tool }),

  select: (id) => set({ selectedIds: id ? [id] : [], selectedSeatId: null }),

  toggleSelection: (id) =>
    set((s) => ({
      selectedIds: s.selectedIds.includes(id)
        ? s.selectedIds.filter((x) => x !== id)
        : [...s.selectedIds, id],
      selectedSeatId: null,
    })),

  selectAll: () => {
    const items = selectActiveItems(get());
    set({ selectedIds: items.map((i) => i.data.id), selectedSeatId: null });
  },

  clearSelection: () => set({ selectedIds: [], selectedSeatId: null }),

  setSelectedSeatId: (seatId) => set({ selectedSeatId: seatId }),

  addTable: (zoneId, table) =>
    set((s) => ({
      ...recordHistory(s),
      zones: s.zones.map((z) =>
        z.id === zoneId ? { ...z, tables: [...z.tables, { ...table }] } : z,
      ),
      selectedIds: [table.id],
    })),

  updateTable: (tableId, patch) =>
    set((s) => ({
      ...recordHistory(s),
      zones: s.zones.map((z) => ({
        ...z,
        tables: z.tables.map((t) => (t.id === tableId ? { ...t, ...patch } : t)),
      })),
    })),

  removeTable: (tableId) =>
    set((s) => ({
      ...recordHistory(s),
      zones: s.zones.map((z) => ({
        ...z,
        tables: z.tables.filter((t) => t.id !== tableId),
      })),
      selectedIds: s.selectedIds.filter((id) => id !== tableId),
    })),

  addDecor: (zoneId, decor) =>
    set((s) => ({
      ...recordHistory(s),
      zones: s.zones.map((z) =>
        z.id === zoneId
          ? {
              ...z,
              decorData: {
                grid: z.decorData?.grid ?? { size: 20, visible: true, color: '#e5e7eb' },
                objects: [...(z.decorData?.objects ?? []), { ...decor }],
              },
            }
          : z,
      ),
      selectedIds: [decor.id],
    })),

  updateDecor: (zoneId, decorId, patch) =>
    set((s) => ({
      ...recordHistory(s),
      zones: s.zones.map((z) =>
        z.id === zoneId
          ? {
              ...z,
              decorData: z.decorData
                ? {
                    grid: z.decorData.grid,
                    objects: z.decorData.objects.map((o) =>
                      o.id === decorId ? ({ ...o, ...patch } as DecorObject) : o,
                    ),
                  }
                : z.decorData,
            }
          : z,
      ),
    })),

  removeDecor: (zoneId, decorId) =>
    set((s) => ({
      ...recordHistory(s),
      zones: s.zones.map((z) =>
        z.id === zoneId
          ? {
              ...z,
              decorData: z.decorData
                ? {
                    grid: z.decorData.grid,
                    objects: z.decorData.objects.filter((o) => o.id !== decorId),
                  }
                : null,
            }
          : z,
      ),
      selectedIds: s.selectedIds.filter((id) => id !== decorId),
    })),

  moveSelected: (dx, dy) => {
    if (dx === 0 && dy === 0) return;
    const { selectedIds } = get();
    if (selectedIds.length === 0) return;
    set((s) => {
      const zones = s.zones.map((z) => {
        const tables = z.tables.map((t) =>
          selectedIds.includes(t.id)
            ? { ...t, positionX: (t.positionX ?? 0) + dx, positionY: (t.positionY ?? 0) + dy }
            : t,
        );
        const decorData = z.decorData
          ? {
              grid: z.decorData.grid,
              objects: z.decorData.objects.map((o) => {
                if (!selectedIds.includes(o.id)) return o;
                if (o.type === 'line' || o.type === 'polyline' || o.type === 'zone') {
                  const points = o.points.map((p, i) => (i % 2 === 0 ? p + dx : p + dy));
                  return { ...o, points } as DecorObject;
                }
                return { ...o, x: o.x + dx, y: o.y + dy } as DecorObject;
              }),
            }
          : null;
        return { ...z, tables, decorData };
      });
      return { ...recordHistory(s), zones };
    });
  },

  rotateSelected: (deg) => {
    const { selectedIds } = get();
    if (selectedIds.length === 0) return;
    set((s) => ({
      ...recordHistory(s),
      zones: s.zones.map((z) => ({
        ...z,
        tables: z.tables.map((t) =>
          selectedIds.includes(t.id)
            ? { ...t, rotation: ((t.rotation + deg) % 360 + 360) % 360 }
            : t,
        ),
        decorData: z.decorData
          ? {
              grid: z.decorData.grid,
              objects: z.decorData.objects.map((o) =>
                selectedIds.includes(o.id) && (o.type === 'shape' || o.type === 'text' || o.type === 'decor-icon')
                  ? ({ ...o, rotation: ((o.rotation + deg) % 360 + 360) % 360 } as DecorObject)
                  : o,
              ),
            }
          : z.decorData,
      })),
    }));
  },

  alignSelected: (kind) => {
    const state = get();
    const items = selectActiveItems(state).filter((i) => state.selectedIds.includes(i.data.id));
    if (items.length < 2) return;

    const bounds = items.map((i) => ({ id: i.data.id, b: itemBounds(i) }));
    const deltas = new Map<string, { dx: number; dy: number }>();

    if (kind === 'distribute-h' || kind === 'distribute-v') {
      if (items.length < 3) return;
      const sorted = [...bounds].sort((a, b) =>
        kind === 'distribute-h' ? a.b.x - b.b.x : a.b.y - b.b.y,
      );
      const first = sorted[0].b;
      const last = sorted[sorted.length - 1].b;
      const span = kind === 'distribute-h' ? last.x - first.x : last.y - first.y;
      const step = span / (sorted.length - 1);
      sorted.forEach((entry, idx) => {
        const target = first.x + step * idx;
        const dx = kind === 'distribute-h' ? target - entry.b.x : 0;
        const dy = kind === 'distribute-v' ? (first.y + step * idx) - entry.b.y : 0;
        if (dx !== 0 || dy !== 0) deltas.set(entry.id, { dx, dy });
      });
    } else {
      const ref = bounds[0].b;
      bounds.forEach((entry) => {
        let dx = 0;
        let dy = 0;
        switch (kind) {
          case 'left': dx = ref.x - entry.b.x; break;
          case 'right': dx = ref.x + ref.width - (entry.b.x + entry.b.width); break;
          case 'top': dy = ref.y - entry.b.y; break;
          case 'bottom': dy = ref.y + ref.height - (entry.b.y + entry.b.height); break;
          case 'center-h': dx = ref.x + ref.width / 2 - (entry.b.x + entry.b.width / 2); break;
          case 'center-v': dy = ref.y + ref.height / 2 - (entry.b.y + entry.b.height / 2); break;
        }
        if (dx !== 0 || dy !== 0) deltas.set(entry.id, { dx, dy });
      });
    }

    if (deltas.size === 0) return;

    set((s) => ({
      ...recordHistory(s),
      zones: s.zones.map((z) => {
        const tables = z.tables.map((t) => {
          const d = deltas.get(t.id);
          if (!d) return t;
          return { ...t, positionX: (t.positionX ?? 0) + d.dx, positionY: (t.positionY ?? 0) + d.dy };
        });
        const decorData = z.decorData
          ? {
              grid: z.decorData.grid,
              objects: z.decorData.objects.map((o) => {
            const d = deltas.get(o.id);
            if (!d) return o;
            if (o.type === 'line' || o.type === 'polyline' || o.type === 'zone') {
              const points = o.points.map((p, i) => (i % 2 === 0 ? p + d.dx : p + d.dy));
              return { ...o, points } as DecorObject;
            }
            return { ...o, x: o.x + d.dx, y: o.y + d.dy } as DecorObject;
          }),
            }
          : z.decorData;
        return { ...z, tables, decorData };
      }),
    }));
  },

  bringForward: (id) => reorderObject(set, get, id, 1),
  sendBackward: (id) => reorderObject(set, get, id, -1),
  bringToFront: (id) => reorderObject(set, get, id, 'front'),
  sendToBack: (id) => reorderObject(set, get, id, 'back'),

  copySelection: () => {
    const state = get();
    const decor = selectActiveItems(state)
      .filter((i) => i.kind === 'decor' && state.selectedIds.includes(i.data.id))
      .map((i) => ({ ...(i.data as DecorObject) }));
    set({ clipboard: decor });
  },

  pasteSelection: () => {
    const state = get();
    if (state.clipboard.length === 0 || !state.activeZoneId) return;
    const newIds: string[] = [];
    const pasted = state.clipboard.map((d) => {
      const id = uuidv7();
      newIds.push(id);
      return {
        ...d,
        id,
        x: (d.type === 'shape' || d.type === 'text' || d.type === 'decor-icon') ? d.x + 20 : (d as { x?: number }).x,
        y: (d.type === 'shape' || d.type === 'text' || d.type === 'decor-icon') ? d.y + 20 : (d as { y?: number }).y,
      } as DecorObject;
    });
    set((s) => ({
      ...recordHistory(s),
      zones: s.zones.map((z) =>
        z.id === s.activeZoneId
          ? {
              ...z,
              decorData: {
                grid: z.decorData?.grid ?? { size: 20, visible: true, color: '#e5e7eb' },
                objects: [...(z.decorData?.objects ?? []), ...pasted],
              },
            }
          : z,
      ),
      selectedIds: newIds,
    }));
  },

  duplicateSelection: () => {
    get().copySelection();
    get().pasteSelection();
  },

  deleteSelection: () => {
    const state = get();
    if (state.selectedIds.length === 0) return;
    const ids = new Set(state.selectedIds);
    set((s) => ({
      ...recordHistory(s),
      zones: s.zones.map((z) => ({
        ...z,
        tables: z.tables.filter((t) => !ids.has(t.id)),
        decorData: z.decorData
          ? { grid: z.decorData.grid, objects: z.decorData.objects.filter((o) => !ids.has(o.id)) }
          : null,
      })),
      selectedIds: [],
    }));
  },

  pushHistory: () =>
    set((s) => {
      const snapshot: LayoutSnapshot = {
        zones: cloneZones(s.zones),
        activeZoneId: s.activeZoneId,
      };
      const history = [...s.history, snapshot].slice(-HISTORY_LIMIT);
      return { history, future: [] };
    }),

  undo: () =>
    set((s) => {
      if (s.history.length === 0) return s;
      const previous = s.history[s.history.length - 1];
      const future: LayoutSnapshot = {
        zones: cloneZones(s.zones),
        activeZoneId: s.activeZoneId,
      };
      return {
        zones: previous.zones,
        activeZoneId: previous.activeZoneId,
        history: s.history.slice(0, -1),
        future: [future, ...s.future].slice(0, HISTORY_LIMIT),
        selectedIds: [],
      };
    }),

  redo: () =>
    set((s) => {
      if (s.future.length === 0) return s;
      const next = s.future[0];
      const history: LayoutSnapshot = {
        zones: cloneZones(s.zones),
        activeZoneId: s.activeZoneId,
      };
      return {
        zones: next.zones,
        activeZoneId: next.activeZoneId,
        history: [...s.history, history].slice(-HISTORY_LIMIT),
        future: s.future.slice(1),
        selectedIds: [],
      };
    }),

  setZoom: (zoom) => set({ zoom: Math.max(0.2, Math.min(3, zoom)) }),
  setPan: (pan) => set({ pan }),
  toggleGrid: () => set((s) => ({ gridVisible: !s.gridVisible })),

  setAvailability: (busy) =>
    set({ availability: new Map(busy.map((b) => [b.tableId, b.busyUntil])) }),

  selectTableForBooking: (tableId) => set({ selectedTableIdForBooking: tableId }),

  getActiveZone: () => selectActiveZone(get()),
  getActiveItems: () => selectActiveItems(get()),
}));

function reorderObject(
  set: (fn: (s: LayoutState) => Partial<LayoutState>) => void,
  get: () => LayoutState,
  id: string,
  direction: 1 | -1 | 'front' | 'back',
): void {
  const state = get();
  if (!state.activeZoneId) return;
  set((s) => ({
    ...recordHistory(s),
    zones: s.zones.map((z) => {
      if (z.id !== s.activeZoneId || !z.decorData) return z;
      const objs = [...z.decorData.objects];
      const idx = objs.findIndex((o) => o.id === id);
      if (idx === -1) return z;
      const [item] = objs.splice(idx, 1);
      if (direction === 'front') objs.push(item);
      else if (direction === 'back') objs.unshift(item);
      else {
        const newIdx = Math.max(0, Math.min(objs.length, idx + direction));
        objs.splice(newIdx, 0, item);
      }
      return { ...z, decorData: { grid: z.decorData.grid, objects: objs } };
    }),
  }));
}

// ── Хелперы для создания новых объектов (используются из UI) ──────────────

export function createDecorObject(
  type: DecorObject['type'],
  x: number,
  y: number,
): DecorObject {
  const id = uuidv7();
  switch (type) {
    case 'line':
      return { id, type: 'line', points: [x, y, x + 100, y], strokeWidth: 3, color: '#374151' };
    case 'polyline':
      return { id, type: 'polyline', points: [x, y, x + 100, y, x + 100, y + 80], strokeWidth: 3, color: '#374151', closed: false };
    case 'zone':
      return { id, type: 'zone', points: [x, y, x + 160, y, x + 160, y + 100, x, y + 100], fill: '#dbeafe', stroke: '#3b82f6', strokeWidth: 2 };
    case 'shape':
      return { id, type: 'shape', shape: 'rect', x, y, width: 120, height: 80, rotation: 0, fill: '#f3f4f6', stroke: '#9ca3af', strokeWidth: 2 };
    case 'text':
      return { id, type: 'text', x, y, rotation: 0, text: 'Текст', fontSize: 24, color: '#111827' };
    case 'decor-icon':
      return { id, type: 'decor-icon', x, y, rotation: 0, icon: 'plant', width: 48, height: 48, color: '#16a34a' };
    default:
      throw new Error(`Unknown decor type: ${type}`);
  }
}

export function createNewTable(
  zoneId: string,
  restaurantId: string,
  index: number,
  defaults?: Partial<FloorPlanTable>,
): FloorPlanTable {
  const now = new Date().toISOString();
  return {
    id: uuidv7(),
    restaurantId,
    floorPlanId: zoneId,
    label: `Стол ${index}`,
    objectType: 'table',
    capacity: 4,
    minCapacity: 1,
    positionX: 40 + ((index - 1) % 6) * 24,
    positionY: 40 + Math.floor((index - 1) / 6) * 24,
    width: 96,
    height: 80,
    rotation: 0,
    shape: 'rectangle',
    points: null,
    seats: null,
    cornerRadius: 6,
    depositAmount: 0,
    isActive: true,
    visibleToGuests: true,
    description: null,
    createdAt: now,
    updatedAt: now,
    ...defaults,
  };
}

export function decorLayoutOf(zone: FloorPlanZone): DecorLayoutData {
  return (
    zone.decorData ?? {
      grid: { size: 20, visible: true, color: '#e5e7eb' },
      objects: [],
    }
  );
}

export function resolveTableDeposit(
  scheme: DepositScheme,
  globalAmount: number,
  zone: FloorPlanZone | null,
  table: { depositAmount: number },
): number {
  if (scheme === 'no_deposit') return 0;
  if (scheme === 'global_deposit') return globalAmount;
  const zoneAmount = zone?.depositAmount ?? 0;
  if (scheme === 'per_zone') return zoneAmount || globalAmount;
  // per_table
  return table.depositAmount || zoneAmount || globalAmount;
}

export type { TableObjectType, TableShape, FloorPlanTable, FloorPlanZone, DecorObject };

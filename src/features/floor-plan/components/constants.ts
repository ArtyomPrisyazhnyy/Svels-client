export const STAGE_WIDTH = 1100;
export const STAGE_HEIGHT = 620;
export const DEFAULT_GRID_SIZE = 20;
export const MIN_ZOOM = 0.2;
export const MAX_ZOOM = 3;
export const ZOOM_STEP = 1.1;

export const TABLE_COLORS = {
  active: '#22c55e',
  inactive: '#9ca3af',
  selected: '#2563eb',
  busy: '#ef4444',
  booked: '#f97316',
  fill: '#ffffff',
  label: '#111827',
  capacity: '#6b7280',
} as const;

export const SEAT_COLORS = {
  fill: '#f9fafb',
  stroke: '#9ca3af',
  back: '#e5e7eb',
  selected: '#2563eb',
} as const;

/** Ширина одного посадочного места на диване/скамейке (px). */
export const SEAT_SLOT_WIDTH = 26;

export const SEAT_DEFAULT_SLOTS: Record<'chair' | 'stool' | 'couch' | 'bench', number> = {
  chair: 1,
  stool: 1,
  couch: 2,
  bench: 2,
};

export const DECOR_DEFAULTS = {
  stroke: '#374151',
  fill: '#f3f4f6',
  zoneFill: '#dbeafe',
  zoneStroke: '#3b82f6',
  textColor: '#111827',
} as const;

export const TABLE_SHAPES: Array<{ value: 'rectangle' | 'round' | 'square' | 'oval' | 'polygon'; label: string }> = [
  { value: 'rectangle', label: 'Прямоугольный' },
  { value: 'round', label: 'Круглый' },
  { value: 'square', label: 'Квадратный' },
  { value: 'oval', label: 'Овальный' },
  { value: 'polygon', label: 'Произвольный' },
];

export const TABLE_OBJECT_TYPES: Array<{ value: import('@/shared/types/floor-plan').TableObjectType; label: string }> = [
  { value: 'table', label: 'Стол' },
  { value: 'bar', label: 'Бар' },
  { value: 'billiard', label: 'Бильярд' },
  { value: 'cabana', label: 'Беседка' },
  { value: 'room', label: 'Комната' },
  { value: 'lounger', label: 'Лежак' },
];

export const DEPOSIT_SCHEMES: Array<{ value: import('@/shared/types/floor-plan').DepositScheme; label: string }> = [
  { value: 'no_deposit', label: 'Без депозита' },
  { value: 'global_deposit', label: 'Глобальный депозит' },
  { value: 'per_zone', label: 'По зонам' },
  { value: 'per_table', label: 'По столам' },
];

export const TOOLS: Array<{ value: import('@/store/layout-store').Tool; label: string; icon: string }> = [
  { value: 'select', label: 'Выделить', icon: '↖' },
  { value: 'line', label: 'Линия', icon: '╱' },
  { value: 'polyline', label: 'Ломаная', icon: '⌐' },
  { value: 'zone', label: 'Зона', icon: '▱' },
  { value: 'rect', label: 'Прямоуг.', icon: '▭' },
  { value: 'circle', label: 'Круг', icon: '○' },
  { value: 'text', label: 'Текст', icon: 'T' },
  { value: 'decor-icon', label: 'Декор', icon: '✦' },
];

export const DECOR_ICONS: Array<{ value: import('@/shared/types/floor-plan').DecorIconKind; label: string; emoji: string }> = [
  { value: 'plant', label: 'Растение', emoji: '🪴' },
  { value: 'tv', label: 'ТВ', emoji: '📺' },
  { value: 'lamp', label: 'Светильник', emoji: '💡' },
  { value: 'curtain', label: 'Шторы', emoji: '🪟' },
  { value: 'stairs', label: 'Лестница', emoji: '🪜' },
  { value: 'entrance', label: 'Вход', emoji: '🚪' },
  { value: 'wc', label: 'Туалет', emoji: '🚻' },
  { value: 'stage', label: 'Сцена', emoji: '🎤' },
  { value: 'bar', label: 'Бар', emoji: '🍹' },
  { value: 'kitchen', label: 'Кухня', emoji: '🍽' },
];

export function formatBusyUntil(iso: string): string {
  try {
    const d = new Date(iso);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  } catch {
    return '';
  }
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

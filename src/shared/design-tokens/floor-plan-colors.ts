/** Canvas/Konva colors — literals allowed only in design-tokens. */
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

export const GRID_COLOR = '#e5e7eb';

export const CANVAS_SHADOW = 'rgba(0,0,0,0.15)';

export const SELECTION_HIGHLIGHT_FILL = 'rgba(37, 99, 235, 0.08)';

export const DECOR_DEFAULTS = {
  stroke: '#374151',
  fill: '#f3f4f6',
  zoneFill: '#dbeafe',
  zoneStroke: '#3b82f6',
  textColor: '#111827',
} as const;

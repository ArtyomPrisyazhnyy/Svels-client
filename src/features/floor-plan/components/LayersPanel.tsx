'use client';

import { useActiveItems, useLayoutStore } from '@/store/layout-store';
import type { DecorObject } from '@/shared/types/floor-plan';

interface LayersPanelProps {
  collapsed?: boolean;
}

type LayerEntry = {
  id: string;
  label: string;
  type: 'table' | 'decor';
  decorType?: DecorObject['type'];
};

export function LayersPanel({ collapsed }: LayersPanelProps) {
  const items = useActiveItems();
  const selectedIds = useLayoutStore((s) => s.selectedIds);
  const select = useLayoutStore((s) => s.select);
  const bringToFront = useLayoutStore((s) => s.bringToFront);
  const sendToBack = useLayoutStore((s) => s.sendToBack);

  const tables: LayerEntry[] = items
    .filter((i) => i.kind === 'table')
    .map((i) => ({ id: i.data.id, label: i.data.label, type: 'table' as const }));
  const decor: LayerEntry[] = items
    .filter((i) => i.kind === 'decor')
    .map((i) => ({ id: i.data.id, label: decorLabel(i.data as DecorObject), type: 'decor' as const, decorType: (i.data as DecorObject).type }));

  if (collapsed) return null;

  return (
    <div className="fp-layers">
      <h3 className="fp-layers__title">Слои</h3>
      <LayerGroup title="Столы" entries={tables} selectedIds={selectedIds} onSelect={select} />
      <LayerGroup title="Декор" entries={decor} selectedIds={selectedIds} onSelect={select} />
      <div className="fp-layers__hint">
        <p>Ctrl+] — выше слоем</p>
        <p>Ctrl+[ — ниже слоем</p>
        <p>] — наверх · [ — вниз</p>
      </div>
      {selectedIds.length === 1 && (
        <div className="fp-layers__reorder">
          <button type="button" onClick={() => bringToFront(selectedIds[0])}>Наверх</button>
          <button type="button" onClick={() => sendToBack(selectedIds[0])}>Вниз</button>
        </div>
      )}
    </div>
  );
}

function LayerGroup({
  title,
  entries,
  selectedIds,
  onSelect,
}: {
  title: string;
  entries: LayerEntry[];
  selectedIds: string[];
  onSelect: (id: string) => void;
}) {
  return (
    <div className="fp-layers__group">
      <p className="fp-layers__group-title">{title} ({entries.length})</p>
      {entries.length === 0 && <p className="fp-layers__empty">— пусто —</p>}
      {entries.map((e) => (
        <button
          key={e.id}
          type="button"
          className={selectedIds.includes(e.id) ? 'fp-layers__item fp-layers__item--active' : 'fp-layers__item'}
          onClick={() => onSelect(e.id)}
        >
          <span className="fp-layers__item-icon">{iconFor(e)}</span>
          <span className="fp-layers__item-label">{e.label}</span>
        </button>
      ))}
    </div>
  );
}

function decorLabel(d: DecorObject): string {
  switch (d.type) {
    case 'line': return 'Линия';
    case 'polyline': return 'Ломаная';
    case 'zone': return 'Зона';
    case 'shape': return `Фигура (${d.shape})`;
    case 'text': return `Текст: ${d.text.slice(0, 16)}`;
    case 'decor-icon': return `Декор: ${d.icon}`;
  }
}

function iconFor(e: LayerEntry): string {
  if (e.type === 'table') return '🪑';
  switch (e.decorType) {
    case 'line': return '╱';
    case 'polyline': return '⌐';
    case 'zone': return '▱';
    case 'shape': return '▭';
    case 'text': return 'T';
    case 'decor-icon': return '✦';
    default: return '•';
  }
}

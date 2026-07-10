'use client';

import { useLayoutStore } from '@/store/layout-store';
import { DecorInspector } from './DecorInspector';
import { TableInspector } from './TableInspector';

interface RightInspectorPanelProps {
  restaurantId: string;
  depositScheme: 'no_deposit' | 'global_deposit' | 'per_zone' | 'per_table';
}

/** Показывает инспектор стола или декора в зависимости от выделения. */
export function RightInspectorPanel({ restaurantId, depositScheme }: RightInspectorPanelProps) {
  const selectedIds = useLayoutStore((s) => s.selectedIds);
  const activeZoneId = useLayoutStore((s) => s.activeZoneId);
  const zones = useLayoutStore((s) => s.zones);

  if (selectedIds.length !== 1 || !activeZoneId) {
    return (
      <aside className="fp-inspector fp-inspector--empty">
        <p>Выберите объект на холсте или в панели «Слои».</p>
        <div className="fp-inspector__help">
          <p><strong>Скругления</strong></p>
          <ul>
            <li><strong>Стены</strong> — инструмент «Ломаная», затем в инспекторе: «Скругление углов»</li>
            <li><strong>Зоны</strong> — инструмент «Зона», затем «Скругление углов» или «Сглаживание»</li>
            <li><strong>Столы</strong> — выделить стол → «Скругление углов» (прямоугольные)</li>
            <li><strong>Круглый стол</strong> — форма «Круглый» при добавлении</li>
          </ul>
          <p><strong>Места (стулья/диваны)</strong></p>
          <ul>
            <li>Выделить стол → «+ Диван» → кликнуть по дивану на столе</li>
            <li>Поворот — якорь над рамкой или поле «Поворот»</li>
            <li>3 места на диване — ползунок «Кол-во мест» или боковые якоря</li>
          </ul>
        </div>
      </aside>
    );
  }

  const id = selectedIds[0];
  const zone = zones.find((z) => z.id === activeZoneId);
  const isTable = zone?.tables.some((t) => t.id === id) ?? false;
  const isDecor = zone?.decorData?.objects.some((d) => d.id === id) ?? false;

  if (isTable) {
    return <TableInspector restaurantId={restaurantId} depositScheme={depositScheme} />;
  }
  if (isDecor) {
    return <DecorInspector />;
  }

  return (
    <aside className="fp-inspector fp-inspector--empty">
      <p>Объект не найден в активном зале.</p>
    </aside>
  );
}

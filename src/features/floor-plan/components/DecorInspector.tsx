'use client';

import { useLayoutStore } from '@/store/layout-store';
import type {
  DecorObject,
  PolylineDecorObject,
  ZoneDecorObject,
} from '@/shared/types/floor-plan';

type PointBasedProps = {
  points: number[];
  strokeWidth: number;
  tension?: number;
  cornerRadius?: number;
};

/**
 * Панель свойств выбранного decor-объекта (линия/ломаная/зона/фигура/текст/иконка).
 * Показывается, когда выделен ровно один decor-объект.
 */
export function DecorInspector() {
  const selectedIds = useLayoutStore((s) => s.selectedIds);
  const activeZoneId = useLayoutStore((s) => s.activeZoneId);
  const updateDecor = useLayoutStore((s) => s.updateDecor);
  const removeDecor = useLayoutStore((s) => s.removeDecor);

  const decor = useLayoutStore((s) => {
    if (selectedIds.length !== 1 || !s.activeZoneId) return null;
    const zone = s.zones.find((z) => z.id === s.activeZoneId);
    return zone?.decorData?.objects.find((o) => o.id === selectedIds[0]) ?? null;
  });

  if (!decor || !activeZoneId) {
    return (
      <aside className="fp-inspector fp-inspector--empty">
        <p>Выберите элемент декора, чтобы изменить его свойства.</p>
      </aside>
    );
  }

  function patch(p: Partial<DecorObject>) {
    updateDecor(activeZoneId!, decor!.id, p);
  }

  const isPolyline = decor.type === 'polyline';
  const isZone = decor.type === 'zone';
  const isPointBased = isPolyline || isZone || decor.type === 'line';
  const pointBased = decor as unknown as PointBasedProps;

  return (
    <aside className="fp-inspector">
      <h3 className="fp-inspector__title">
        {decor.type === 'line' && 'Линия (стена)'}
        {decor.type === 'polyline' && 'Ломаная (стена)'}
        {decor.type === 'zone' && 'Зона'}
        {decor.type === 'shape' && 'Фигура'}
        {decor.type === 'text' && 'Текст'}
        {decor.type === 'decor-icon' && 'Иконка'}
      </h3>

      {(isPolyline || isZone) && (
        <div className="fp-inspector__help">
          <strong>Скругление:</strong> «Скругление углов» — закруглённые углы стен и барных стоек.
          «Сглаживание» — плавная дуга через точки (полукруглые перегородки).
        </div>
      )}

      {isPolyline && (
        <p className="fp-inspector__hint">Для стен используйте «Ломаная» с 3+ точками, затем скруглите углы.</p>
      )}

      {isPointBased && (
        <>
          <label className="fp-inspector__field">
            <span>Цвет контура</span>
            <input
              type="color"
              value={isZone ? (decor as ZoneDecorObject).stroke : (decor as PolylineDecorObject).color}
              onChange={(e) =>
                patch(
                  isZone
                    ? { stroke: e.target.value }
                    : { color: e.target.value },
                )
              }
            />
          </label>

          <label className="fp-inspector__field">
            <span>Толщина ({decor.strokeWidth}px)</span>
            <input
              type="range"
              min={1}
              max={20}
              step={1}
              value={decor.strokeWidth}
              onChange={(e) => patch({ strokeWidth: Number(e.target.value) })}
            />
          </label>

          {(isPolyline || isZone) && (
            <>
              <label className="fp-inspector__field">
                <span>Сглаживание (сплайн): {(pointBased.tension ?? 0).toFixed(2)}</span>
                <input
                  type="range"
                  min={0}
                  max={0.6}
                  step={0.05}
                  value={pointBased.tension ?? 0}
                  onChange={(e) => patch({ tension: Number(e.target.value) })}
                />
                <small className="fp-inspector__hint">0 — прямые сегменты, &gt;0 — плавная кривая через точки</small>
              </label>

              <label className="fp-inspector__field">
                <span>Скругление углов: {pointBased.cornerRadius ?? 0}px</span>
                <input
                  type="range"
                  min={0}
                  max={80}
                  step={1}
                  value={pointBased.cornerRadius ?? 0}
                  onChange={(e) => patch({ cornerRadius: Number(e.target.value) })}
                />
                <small className="fp-inspector__hint">Закруглённые стены, барные стойки с поворотами</small>
              </label>
            </>
          )}

          {isZone && (
            <label className="fp-inspector__field">
              <span>Заливка</span>
              <input
                type="color"
                value={(decor as ZoneDecorObject).fill}
                onChange={(e) => patch({ fill: e.target.value })}
              />
            </label>
          )}

          {isPolyline && (
            <label className="fp-inspector__field fp-inspector__field--row">
              <span>Замкнуть</span>
              <input
                type="checkbox"
                checked={(decor as PolylineDecorObject).closed}
                onChange={(e) => patch({ closed: e.target.checked })}
              />
            </label>
          )}
        </>
      )}

      {decor.type === 'text' && (
        <>
          <label className="fp-inspector__field">
            <span>Текст</span>
            <input
              type="text"
              value={decor.text}
              maxLength={120}
              onChange={(e) => patch({ text: e.target.value })}
            />
          </label>
          <label className="fp-inspector__field">
            <span>Размер шрифта ({decor.fontSize}px)</span>
            <input
              type="range"
              min={8}
              max={96}
              step={1}
              value={decor.fontSize}
              onChange={(e) => patch({ fontSize: Number(e.target.value) })}
            />
          </label>
          <label className="fp-inspector__field">
            <span>Цвет</span>
            <input type="color" value={decor.color} onChange={(e) => patch({ color: e.target.value })} />
          </label>
        </>
      )}

      {decor.type === 'shape' && (
        <>
          <label className="fp-inspector__field">
            <span>Заливка</span>
            <input type="color" value={decor.fill} onChange={(e) => patch({ fill: e.target.value })} />
          </label>
          <label className="fp-inspector__field">
            <span>Контур</span>
            <input type="color" value={decor.stroke} onChange={(e) => patch({ stroke: e.target.value })} />
          </label>
          <label className="fp-inspector__field">
            <span>Толщина ({decor.strokeWidth}px)</span>
            <input
              type="range"
              min={1}
              max={20}
              step={1}
              value={decor.strokeWidth}
              onChange={(e) => patch({ strokeWidth: Number(e.target.value) })}
            />
          </label>
        </>
      )}

      {decor.type === 'decor-icon' && (
        <label className="fp-inspector__field">
          <span>Фон</span>
          <input type="color" value={decor.color ?? '#f3f4f6'} onChange={(e) => patch({ color: e.target.value })} />
        </label>
      )}

      <button
        type="button"
        className="fp-inspector__delete"
        onClick={() => removeDecor(activeZoneId, decor.id)}
      >
        Удалить элемент
      </button>

      <p className="fp-inspector__id">ID: {decor.id.slice(0, 8)}…</p>
    </aside>
  );
}

'use client';

import { v7 as uuidv7 } from 'uuid';
import { useLayoutStore } from '@/store/layout-store';
import { SEAT_KINDS } from '@/shared/types/floor-plan';
import type { FloorPlanTable, SeatKind, TableSeat } from '@/shared/types/floor-plan';
import { SEAT_DEFAULT_SLOTS, SEAT_SLOT_WIDTH, TABLE_OBJECT_TYPES, TABLE_SHAPES } from './constants';

interface TableInspectorProps {
  restaurantId: string;
  depositScheme: 'no_deposit' | 'global_deposit' | 'per_zone' | 'per_table';
}

export function TableInspector({ restaurantId, depositScheme }: TableInspectorProps) {
  const selectedIds = useLayoutStore((s) => s.selectedIds);
  const zones = useLayoutStore((s) => s.zones);
  const activeZoneId = useLayoutStore((s) => s.activeZoneId);
  const updateTable = useLayoutStore((s) => s.updateTable);
  const removeTable = useLayoutStore((s) => s.removeTable);
  const selectedSeatId = useLayoutStore((s) => s.selectedSeatId);
  const setSelectedSeatId = useLayoutStore((s) => s.setSelectedSeatId);

  const table = useLayoutStore((s) => {
    if (selectedIds.length !== 1) return null;
    const zone = s.zones.find((z) => z.id === s.activeZoneId);
    return zone?.tables.find((t) => t.id === selectedIds[0]) ?? null;
  });

  if (!table || !activeZoneId) {
    return (
      <aside className="fp-inspector fp-inspector--empty">
        <p>Выберите стол, чтобы редактировать его свойства.</p>
      </aside>
    );
  }

  function patch(p: Partial<FloorPlanTable>) {
    updateTable(table!.id, p);
  }

  function addSeat(kind: SeatKind) {
    const seats = [...(table!.seats ?? [])];
    const w = table!.width;
    const h = table!.height;
    const idx = seats.length;
    const cx = w / 2 + ((idx % 6) - 2.5) * 28;
    const cy = h + 28 + Math.floor(idx / 6) * 28;
    const slots = SEAT_DEFAULT_SLOTS[kind];
    const seat: TableSeat = {
      id: uuidv7(),
      kind,
      x: Math.round(cx),
      y: Math.round(cy),
      rotation: 0,
      slots,
      width: kind === 'couch' || kind === 'bench' ? slots * SEAT_SLOT_WIDTH : undefined,
    };
    seats.push(seat);
    patch({ seats });
    setSelectedSeatId(seat.id);
  }

  function updateSeat(seatId: string, p: Partial<TableSeat>) {
    const seats = (table!.seats ?? []).map((s) => (s.id === seatId ? { ...s, ...p } : s));
    patch({ seats });
  }

  function removeSeat(seatId: string) {
    const seats = (table!.seats ?? []).filter((s) => s.id !== seatId);
    patch({ seats });
  }

  const zone = zones.find((z) => z.id === activeZoneId);
  const showDepositField = depositScheme === 'per_table';
  const showCornerRadius = table.shape === 'rectangle' || table.shape === 'square';
  const activeSeat = table.seats?.find((s) => s.id === selectedSeatId) ?? null;

  return (
    <aside className="fp-inspector">
      <h3 className="fp-inspector__title">Стол {table.label}</h3>

      <label className="fp-inspector__field">
        <span>Название / номер</span>
        <input
          type="text"
          value={table.label}
          maxLength={60}
          onChange={(e) => patch({ label: e.target.value })}
        />
      </label>

      <label className="fp-inspector__field">
        <span>Тип объекта</span>
        <select
          value={table.objectType}
          onChange={(e) => patch({ objectType: e.target.value as FloorPlanTable['objectType'] })}
        >
          {TABLE_OBJECT_TYPES.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </label>

      <label className="fp-inspector__field">
        <span>Форма</span>
        <select
          value={table.shape}
          onChange={(e) => patch({ shape: e.target.value as FloorPlanTable['shape'] })}
        >
          {TABLE_SHAPES.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </label>

      <div className="fp-inspector__row">
        <label className="fp-inspector__field">
          <span>Мин. мест</span>
          <input
            type="number"
            min={1}
            max={50}
            value={table.minCapacity}
            onChange={(e) => patch({ minCapacity: Number(e.target.value) })}
          />
        </label>
        <label className="fp-inspector__field">
          <span>Макс. мест</span>
          <input
            type="number"
            min={1}
            max={50}
            value={table.capacity}
            onChange={(e) => patch({ capacity: Number(e.target.value) })}
          />
        </label>
      </div>

      <label className="fp-inspector__field">
        <span>Поворот (°)</span>
        <input
          type="number"
          min={0}
          max={359}
          value={Math.round(table.rotation)}
          onChange={(e) => patch({ rotation: Number(e.target.value) })}
        />
      </label>

      {showCornerRadius && (
        <label className="fp-inspector__field">
          <span>Скругление углов: {table.cornerRadius}px</span>
          <input
            type="range"
            min={0}
            max={40}
            step={1}
            value={table.cornerRadius}
            onChange={(e) => patch({ cornerRadius: Number(e.target.value) })}
          />
        </label>
      )}

      {showDepositField && (
        <label className="fp-inspector__field">
          <span>Депозит за стол (BYN)</span>
          <input
            type="number"
            min={0}
            step={0.5}
            value={table.depositAmount}
            onChange={(e) => patch({ depositAmount: Number(e.target.value) })}
          />
          <small className="fp-inspector__hint">0 = наследует зону ({zone?.depositAmount ?? 0} BYN)</small>
        </label>
      )}

      <label className="fp-inspector__field">
        <span>Описание (необязательно)</span>
        <textarea
          value={table.description ?? ''}
          maxLength={500}
          onChange={(e) => patch({ description: e.target.value || null })}
        />
      </label>

      <div className="fp-inspector__seats">
        <div className="fp-inspector__seats-title">Места вокруг стола</div>
        <div className="fp-inspector__seats-add">
          {SEAT_KINDS.map((k) => (
            <button
              key={k.value}
              type="button"
              className="fp-inspector__seats-add-btn"
              onClick={() => addSeat(k.value)}
            >
              + {k.label}
            </button>
          ))}
        </div>
        {(table.seats?.length ?? 0) > 0 ? (
          <ul className="fp-inspector__seats-list">
            {table.seats!.map((seat, i) => (
              <li
                key={seat.id}
                className={selectedSeatId === seat.id ? 'fp-inspector__seats-item fp-inspector__seats-item--active' : 'fp-inspector__seats-item'}
              >
                <button
                  type="button"
                  className="fp-inspector__seats-select"
                  onClick={() => setSelectedSeatId(seat.id)}
                >
                  <span className="fp-inspector__seats-index">{i + 1}</span>
                  <select
                    value={seat.kind}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => {
                      const kind = e.target.value as SeatKind;
                      const slots = SEAT_DEFAULT_SLOTS[kind];
                      updateSeat(seat.id, {
                        kind,
                        slots,
                        width: kind === 'couch' || kind === 'bench' ? slots * SEAT_SLOT_WIDTH : undefined,
                      });
                    }}
                  >
                    {SEAT_KINDS.map((k) => (
                      <option key={k.value} value={k.value}>{k.label}</option>
                    ))}
                  </select>
                </button>
                <button
                  type="button"
                  className="fp-inspector__seats-del"
                  onClick={() => {
                    removeSeat(seat.id);
                    if (selectedSeatId === seat.id) setSelectedSeatId(null);
                  }}
                  title="Удалить место"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="fp-inspector__hint">Нет мест. Кликните по месту на столе для поворота и изменения размера.</p>
        )}

        {activeSeat && (
          <div className="fp-inspector__seat-detail">
            <p className="fp-inspector__seat-detail-title">Выбранное место</p>
            <label className="fp-inspector__field">
              <span>Поворот (°)</span>
              <input
                type="number"
                min={0}
                max={359}
                value={Math.round(activeSeat.rotation ?? 0)}
                onChange={(e) => updateSeat(activeSeat.id, { rotation: Number(e.target.value) })}
              />
            </label>
            {(activeSeat.kind === 'couch' || activeSeat.kind === 'bench') && (
              <label className="fp-inspector__field">
                <span>Кол-во мест: {activeSeat.slots ?? SEAT_DEFAULT_SLOTS[activeSeat.kind]}</span>
                <input
                  type="range"
                  min={1}
                  max={8}
                  step={1}
                  value={activeSeat.slots ?? SEAT_DEFAULT_SLOTS[activeSeat.kind]}
                  onChange={(e) => {
                    const slots = Number(e.target.value);
                    updateSeat(activeSeat.id, { slots, width: slots * SEAT_SLOT_WIDTH });
                  }}
                />
                <small className="fp-inspector__hint">Или потяните боковые якоря на холсте</small>
              </label>
            )}
          </div>
        )}
      </div>

      <label className="fp-inspector__field fp-inspector__field--row">
        <span>Доступен для брони</span>
        <input
          type="checkbox"
          checked={table.isActive}
          onChange={(e) => patch({ isActive: e.target.checked })}
        />
      </label>

      <label className="fp-inspector__field fp-inspector__field--row">
        <span>Виден гостям</span>
        <input
          type="checkbox"
          checked={table.visibleToGuests}
          onChange={(e) => patch({ visibleToGuests: e.target.checked })}
        />
      </label>

      <button
        type="button"
        className="fp-inspector__delete"
        onClick={() => {
          if (confirm(`Удалить стол «${table.label}» полностью?`)) {
            removeTable(table.id);
          }
        }}
      >
        Удалить стол
      </button>

      <p className="fp-inspector__id">ID: {table.id.slice(0, 8)}… · ресторан {restaurantId.slice(0, 8)}…</p>
    </aside>
  );
}

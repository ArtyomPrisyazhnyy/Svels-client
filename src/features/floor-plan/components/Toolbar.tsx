'use client';

import { useState } from 'react';
import { useLayoutStore } from '@/store/layout-store';
import { TABLE_SHAPES, TOOLS, ZOOM_STEP } from './constants';
import type { TableShape } from '@/shared/types/floor-plan';

interface ToolbarProps {
  onSave?: () => void;
  saving?: boolean;
  canSave?: boolean;
  onAddZone?: () => void;
  onRenameZone?: () => void;
  onDeleteZone?: () => void;
  onAddTable?: (shape: TableShape) => void;
}

export function Toolbar({ onSave, saving, canSave, onAddZone, onRenameZone, onDeleteZone, onAddTable }: ToolbarProps) {
  const zones = useLayoutStore((s) => s.zones);
  const activeZoneId = useLayoutStore((s) => s.activeZoneId);
  const setActiveZone = useLayoutStore((s) => s.setActiveZone);
  const tool = useLayoutStore((s) => s.tool);
  const setTool = useLayoutStore((s) => s.setTool);
  const zoom = useLayoutStore((s) => s.zoom);
  const setZoom = useLayoutStore((s) => s.setZoom);
  const setPan = useLayoutStore((s) => s.setPan);
  const undo = useLayoutStore((s) => s.undo);
  const redo = useLayoutStore((s) => s.redo);
  const historyLen = useLayoutStore((s) => s.history.length);
  const futureLen = useLayoutStore((s) => s.future.length);
  const toggleGrid = useLayoutStore((s) => s.toggleGrid);
  const gridVisible = useLayoutStore((s) => s.gridVisible);
  const [zoneMenuOpen, setZoneMenuOpen] = useState(false);
  const [tableMenuOpen, setTableMenuOpen] = useState(false);
  const activeZone = zones.find((z) => z.id === activeZoneId) ?? null;

  return (
    <div className="fp-toolbar">
      <div className="fp-toolbar__group fp-toolbar__zones">
        <button
          type="button"
          className="fp-toolbar__zone-btn"
          onClick={() => setZoneMenuOpen((v) => !v)}
          title="Выбрать зал"
        >
          {activeZone?.name ?? 'Зал не выбран'} ▾
        </button>
        {zoneMenuOpen && (
          <div className="fp-toolbar__zone-menu">
            {zones.map((z) => (
              <button
                key={z.id}
                type="button"
                className={z.id === activeZoneId ? 'fp-toolbar__zone-item fp-toolbar__zone-item--active' : 'fp-toolbar__zone-item'}
                onClick={() => { setActiveZone(z.id); setZoneMenuOpen(false); }}
              >
                {z.name}
              </button>
            ))}
            <div className="fp-toolbar__zone-actions">
              {onRenameZone && activeZone && (
                <button type="button" onClick={() => { onRenameZone(); setZoneMenuOpen(false); }}>
                  ✎ Переименовать
                </button>
              )}
              {onDeleteZone && activeZone && zones.length > 1 && (
                <button type="button" onClick={() => { onDeleteZone(); setZoneMenuOpen(false); }}>
                  🗑 Удалить зал
                </button>
              )}
            </div>
          </div>
        )}
        {onAddZone && (
          <button type="button" className="fp-toolbar__add-zone" onClick={onAddZone} title="Добавить зал">
            + Зал
          </button>
        )}
      </div>

      <div className="fp-toolbar__group fp-toolbar__add">
        {onAddTable && (
          <div className="fp-toolbar__add-table">
            <button
              type="button"
              className="fp-toolbar__add-table-btn"
              onClick={() => setTableMenuOpen((v) => !v)}
              disabled={!activeZoneId}
              title="Добавить стол"
            >
              + Стол ▾
            </button>
            {tableMenuOpen && (
              <div className="fp-toolbar__table-menu">
                {TABLE_SHAPES.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    className="fp-toolbar__table-item"
                    onClick={() => { onAddTable(s.value); setTableMenuOpen(false); }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="fp-toolbar__group fp-toolbar__tools">
        {TOOLS.map((t) => (
          <button
            key={t.value}
            type="button"
            className={tool === t.value ? 'fp-toolbar__tool fp-toolbar__tool--active' : 'fp-toolbar__tool'}
            onClick={() => setTool(t.value)}
            title={t.label}
          >
            <span className="fp-toolbar__tool-icon">{t.icon}</span>
            <span className="fp-toolbar__tool-label">{t.label}</span>
          </button>
        ))}
      </div>

      <div className="fp-toolbar__group fp-toolbar__history">
        <button type="button" disabled={historyLen === 0} onClick={undo} title="Отменить (Ctrl+Z)">↶</button>
        <button type="button" disabled={futureLen === 0} onClick={redo} title="Повторить (Ctrl+Y)">↷</button>
      </div>

      <div className="fp-toolbar__group fp-toolbar__view">
        <button
          type="button"
          className={gridVisible ? 'fp-toolbar__toggle--active' : ''}
          onClick={toggleGrid}
          title="Сетка"
        >
          #
        </button>
        <button
          type="button"
          onClick={() => setZoom(Math.max(0.2, zoom / ZOOM_STEP))}
          title="Уменьшить"
        >
          −
        </button>
        <span className="fp-toolbar__zoom">{Math.round(zoom * 100)}%</span>
        <button
          type="button"
          onClick={() => setZoom(Math.min(3, zoom * ZOOM_STEP))}
          title="Увеличить"
        >
          +
        </button>
        <button
          type="button"
          onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
          title="Центр"
        >
          ⊕
        </button>
      </div>

      {onSave && (
        <div className="fp-toolbar__group fp-toolbar__save">
          <button
            type="button"
            className="fp-toolbar__save-btn"
            disabled={saving || canSave === false}
            onClick={onSave}
          >
            {saving ? 'Сохранение…' : 'Сохранить (Ctrl+S)'}
          </button>
        </div>
      )}
    </div>
  );
}

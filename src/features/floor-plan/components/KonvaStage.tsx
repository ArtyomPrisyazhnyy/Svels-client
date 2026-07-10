'use client';

import { useEffect, useRef, useState } from 'react';
import { Layer, Line, Rect, Stage } from 'react-konva';
import type Konva from 'konva';
import { useActiveItems, useLayoutStore, createDecorObject } from '@/store/layout-store';
import { TABLE_COLORS } from './constants';
import { DecorNode } from './DecorNode';
import { TableNode } from './TableNode';

interface KonvaStageProps {
  width: number;
  height: number;
  onSave?: () => void;
}

interface LassoState {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

/** Убрать подряд идущие дублирующиеся вершины из массива [x1,y1,x2,y2,...]. */
function dedupAdjacentPoints(points: number[]): number[] {
  if (points.length < 4) return points;
  const result: number[] = [points[0], points[1]];
  for (let i = 2; i < points.length; i += 2) {
    const x = points[i];
    const y = points[i + 1];
    const lastX = result[result.length - 2];
    const lastY = result[result.length - 1];
    if (Math.hypot(x - lastX, y - lastY) > 1) {
      result.push(x, y);
    }
  }
  return result;
}

export function KonvaStage({ width, height }: KonvaStageProps) {
  const stageRef = useRef<Konva.Stage>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [lasso, setLasso] = useState<LassoState | null>(null);
  const [drawing, setDrawing] = useState<{
    type: 'line' | 'polyline' | 'zone' | null;
    points: number[]; // зафиксированные кликами точки [x1,y1,x2,y2,...]
  }>({ type: null, points: [] });
  const [livePoint, setLivePoint] = useState<{ x: number; y: number } | null>(null);

  const mode = useLayoutStore((s) => s.mode);
  const tool = useLayoutStore((s) => s.tool);
  const zoom = useLayoutStore((s) => s.zoom);
  const pan = useLayoutStore((s) => s.pan);
  const gridVisible = useLayoutStore((s) => s.gridVisible && mode === 'edit');
  const selectedIds = useLayoutStore((s) => s.selectedIds);
  const availability = useLayoutStore((s) => s.availability);
  const activeZoneId = useLayoutStore((s) => s.activeZoneId);
  const activeZone = useLayoutStore((s) => s.zones.find((z) => z.id === s.activeZoneId) ?? null);
  const items = useActiveItems();

  const setZoom = useLayoutStore((s) => s.setZoom);
  const setPan = useLayoutStore((s) => s.setPan);
  const setTool = useLayoutStore((s) => s.setTool);
  const select = useLayoutStore((s) => s.select);
  const toggleSelection = useLayoutStore((s) => s.toggleSelection);
  const clearSelection = useLayoutStore((s) => s.clearSelection);
  const selectAll = useLayoutStore((s) => s.selectAll);
  const addDecor = useLayoutStore((s) => s.addDecor);
  const updateDecor = useLayoutStore((s) => s.updateDecor);
  const updateTable = useLayoutStore((s) => s.updateTable);
  const selectTableForBooking = useLayoutStore((s) => s.selectTableForBooking);

  const editable = mode === 'edit';
  const gridSize = activeZone?.decorData?.grid.size ?? 20;

  // Сброс незавершённого рисования при смене инструмента/зала/режима.
  useEffect(() => {
    resetDrawing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tool, activeZoneId, mode]);

  function pointerPosition(): { x: number; y: number } | null {
    const stage = stageRef.current;
    if (!stage) return null;
    const pos = stage.getPointerPosition();
    if (!pos) return null;
    return { x: (pos.x - pan.x) / zoom, y: (pos.y - pan.y) / zoom };
  }

  function handleWheel(e: Konva.KonvaEventObject<WheelEvent>) {
    if (!editable && mode !== 'guest') return;
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;
    const oldZoom = zoom;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;
    const direction = e.evt.deltaY > 0 ? -1 : 1;
    const newZoom = Math.max(0.2, Math.min(3, direction > 0 ? oldZoom * 1.1 : oldZoom / 1.1));
    const mousePointTo = {
      x: (pointer.x - pan.x) / oldZoom,
      y: (pointer.y - pan.y) / oldZoom,
    };
    setZoom(newZoom);
    setPan({
      x: pointer.x - mousePointTo.x * newZoom,
      y: pointer.y - mousePointTo.y * newZoom,
    });
  }

  function resolveItemIdFromTarget(target: Konva.Node): string | null {
    const stage = stageRef.current;
    let node: Konva.Node | null = target;
    while (node && node !== stage) {
      const itemName = node.name();
      if (itemName && items.some((i) => i.data.id === itemName)) {
        return itemName;
      }
      node = node.parent;
    }
    return null;
  }

  function handleMouseDown(e: Konva.KonvaEventObject<MouseEvent>) {
    const pos = pointerPosition();
    if (!pos) return;
    const clickedEmpty = e.target === e.target.getStage();
    const additive = e.evt.ctrlKey || e.evt.metaKey;

    // Режим рисования decor
    if (editable && (tool === 'line' || tool === 'polyline' || tool === 'zone')) {
      // Клик по существующему объекту — выделить и переключиться на «Выделить»
      const hitId = resolveItemIdFromTarget(e.target);
      if (hitId && drawing.type === null) {
        if (additive) toggleSelection(hitId);
        else select(hitId);
        setTool('select');
        return;
      }

      if (drawing.type === null) {
        // первый клик — ставим первую точку, за курсором будет «резиновая» линия
        setDrawing({ type: tool, points: [pos.x, pos.y] });
        setLivePoint({ x: pos.x, y: pos.y });
        return;
      }
      if (drawing.type === tool) {
        if (tool === 'line') {
          // линия — два клика, завершаем на втором
          finishLine([drawing.points[0], drawing.points[1], pos.x, pos.y]);
          return;
        }
        // polyline/zone: клик близко к первой вершине — замкнуть и завершить
        const firstX = drawing.points[0];
        const firstY = drawing.points[1];
        const distToFirst = Math.hypot(pos.x - firstX, pos.y - firstY);
        if (drawing.points.length >= 4 && distToFirst < 10) {
          finishDrawing();
          return;
        }
        // иначе добавляем зафиксированную точку
        setDrawing((prev) =>
          prev.type === tool
            ? { ...prev, points: [...prev.points, pos.x, pos.y] }
            : prev,
        );
        setLivePoint({ x: pos.x, y: pos.y });
      }
      return;
    }

    if (editable && tool !== 'select') {
      // Создание shape/text/decor-icon по клику
      const decorType = tool === 'rect' ? 'shape' : tool === 'circle' ? 'shape' : tool === 'text' ? 'text' : 'decor-icon';
      const obj = createDecorObject(decorType as 'shape' | 'text' | 'decor-icon', pos.x, pos.y);
      if (decorType === 'shape') {
        if (tool === 'circle') (obj as { shape: string }).shape = 'circle';
      }
      if (activeZoneId) addDecor(activeZoneId, obj);
      select(obj.id);
      return;
    }

    // Pan по пустому месту в select-режиме
    if (clickedEmpty && !additive) {
      clearSelection();
    }

    // Lasso-выделение (Ctrl+drag по пустому)
    if (editable && clickedEmpty && additive) {
      setLasso({ x1: pos.x, y1: pos.y, x2: pos.x, y2: pos.y });
    }
  }

  function handleMouseMove() {
    if (lasso) {
      const pos = pointerPosition();
      if (pos) setLasso((prev) => (prev ? { ...prev, x2: pos.x, y2: pos.y } : prev));
    }
    if (drawing.type !== null) {
      const pos = pointerPosition();
      if (pos) setLivePoint({ x: pos.x, y: pos.y });
    }
  }

  function handleMouseUp() {
    if (drawing.type === 'polyline' || drawing.type === 'zone') {
      // завершаем по двойному клику (handleDblClick); здесь ничего
      return;
    }
    if (lasso) {
      const { x1, y1, x2, y2 } = lasso;
      const minX = Math.min(x1, x2);
      const maxX = Math.max(x1, x2);
      const minY = Math.min(y1, y2);
      const maxY = Math.max(y1, y2);
      if (Math.abs(maxX - minX) > 5 && Math.abs(maxY - minY) > 5) {
        const hitIds = items
          .filter((i) => {
            if (i.kind === 'table') {
              const t = i.data;
              const cx = t.positionX ?? 0;
              const cy = t.positionY ?? 0;
              return cx >= minX && cx <= maxX && cy >= minY && cy <= maxY;
            }
            const d = i.data;
            if (d.type === 'line' || d.type === 'polyline' || d.type === 'zone') {
              return d.points.some((p, idx) =>
                idx % 2 === 0 ? p >= minX && p <= maxX : p >= minY && p <= maxY,
              );
            }
            return d.x >= minX && d.x <= maxX && d.y >= minY && d.y <= maxY;
          })
          .map((i) => i.data.id);
        hitIds.forEach((id) => toggleSelection(id));
      }
      setLasso(null);
    }
  }

  function handleDblClick() {
    finishDrawing();
  }

  /** Завершить линию (2 клика) с явно переданными точками. */
  function finishLine(points: number[]) {
    if (!activeZoneId) {
      resetDrawing();
      return;
    }
    const obj = createDecorObject('line', 0, 0);
    (obj as { points: number[] }).points = points;
    addDecor(activeZoneId, obj);
    select(obj.id);
    setTool('select');
    resetDrawing();
  }

  /** Завершить polyline/zone по двойному клику / Enter / клику на первую вершину. */
  function finishDrawing() {
    if (!drawing.type || drawing.type === 'line' || drawing.points.length < 4) {
      resetDrawing();
      return;
    }
    if (!activeZoneId) {
      resetDrawing();
      return;
    }
    // Убираем подряд идущие дублирующиеся вершины (бывают от dblclick).
    const cleaned = dedupAdjacentPoints(drawing.points);
    if (cleaned.length < 4) {
      resetDrawing();
      return;
    }
    const obj = createDecorObject(drawing.type, 0, 0);
    let points = [...cleaned];
    if (drawing.type === 'zone') {
      // замкнуть контур автоматически
      points = [...points, points[0], points[1]];
    }
    (obj as { points: number[] }).points = points;
    addDecor(activeZoneId, obj);
    select(obj.id);
    setTool('select');
    resetDrawing();
  }

  function resetDrawing() {
    setDrawing({ type: null, points: [] });
    setLivePoint(null);
  }

  // Клавиатура во время рисования: Enter — завершить, Escape — отменить.
  useEffect(() => {
    if (drawing.type === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (drawing.type === 'line') {
          if (livePoint) {
            finishLine([drawing.points[0], drawing.points[1], livePoint.x, livePoint.y]);
          } else {
            resetDrawing();
          }
        } else {
          finishDrawing();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        resetDrawing();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawing, livePoint]);

  function handleSelect(id: string, additive: boolean) {
    if (additive) {
      toggleSelection(id);
    } else {
      select(id);
    }
  }

  function handleCommit(id: string, patch: unknown) {
    const item = items.find((i) => i.data.id === id);
    if (!item) return;
    if (item.kind === 'table') {
      updateTable(id, patch as Parameters<typeof updateTable>[1]);
    } else if (activeZoneId) {
      updateDecor(activeZoneId, id, patch as Parameters<typeof updateDecor>[2]);
    }
  }

  function handleBookingSelect(tableId: string) {
    selectTableForBooking(tableId);
    select(tableId);
  }

  // Сетка
  const gridLines: React.ReactNode[] = [];
  if (gridVisible) {
    const gridColor = activeZone?.decorData?.grid.color ?? '#e5e7eb';
    for (let x = 0; x <= width / zoom; x += gridSize) {
      gridLines.push(
        <Line key={`v${x}`} points={[x, 0, x, height / zoom]} stroke={gridColor} strokeWidth={0.5} listening={false} />,
      );
    }
    for (let y = 0; y <= height / zoom; y += gridSize) {
      gridLines.push(
        <Line key={`h${y}`} points={[0, y, width / zoom, y]} stroke={gridColor} strokeWidth={0.5} listening={false} />,
      );
    }
  }

  // Превью «резиновой» линии/ломаной/зоны: зафиксированные точки + текущая позиция курсора.
  const previewLine =
    drawing.type === 'line' && drawing.points.length >= 2 && livePoint
      ? [drawing.points[0], drawing.points[1], livePoint.x, livePoint.y]
      : null;
  const previewPolyline =
    (drawing.type === 'polyline' || drawing.type === 'zone') && drawing.points.length >= 2 && livePoint
      ? [...drawing.points, livePoint.x, livePoint.y]
      : null;
  const previewZoneClosed = drawing.type === 'zone';

  return (
    <div ref={containerRef} className="fp-stage-container">
      <Stage
        ref={stageRef}
        width={width}
        height={height}
        scaleX={zoom}
        scaleY={zoom}
        x={pan.x}
        y={pan.y}
        draggable={editable && tool === 'select' && !lasso}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onDblclick={handleDblClick}
        onClick={(e) => {
          // Ctrl+A обрабатывается в useHotkeys; здесь клик по пустому — снять выделение
          if (e.target === e.target.getStage() && !(e.evt.ctrlKey || e.evt.metaKey)) {
            clearSelection();
          }
          void selectAll;
        }}
        onDragEnd={(e) => {
          if (e.target === e.target.getStage()) {
            setPan({ x: e.target.x(), y: e.target.y() });
          }
        }}
      >
        <Layer>
          {gridLines}
          {items.map((item) => {
            const isSelected = selectedIds.includes(item.data.id);
            if (item.kind === 'table') {
              const busyUntil = mode === 'guest' ? availability.get(item.data.id) : undefined;
              return (
                <TableNode
                  key={item.data.id}
                  table={item.data}
                  selected={isSelected}
                  busyUntil={busyUntil}
                  editable={editable}
                  onSelect={handleSelect}
                  onCommit={handleCommit}
                  onBookingSelect={mode === 'guest' ? handleBookingSelect : undefined}
                />
              );
            }
            return (
              <DecorNode
                key={item.data.id}
                decor={item.data}
                selected={isSelected}
                editable={editable}
                onSelect={handleSelect}
                onCommit={handleCommit}
              />
            );
          })}

          {/* Preview рисования */}
          {previewLine && (
            <Line points={previewLine} stroke="#374151" strokeWidth={3} dash={[6, 4]} listening={false} />
          )}
          {previewPolyline && (
            <Line
              points={previewPolyline}
              stroke={previewZoneClosed ? '#3b82f6' : '#374151'}
              fill={previewZoneClosed ? '#dbeafe' : undefined}
              strokeWidth={2}
              closed={previewZoneClosed}
              dash={[6, 4]}
              listening={false}
            />
          )}

          {/* Lasso-рамка */}
          {lasso && (
            <Rect
              x={Math.min(lasso.x1, lasso.x2)}
              y={Math.min(lasso.y1, lasso.y2)}
              width={Math.abs(lasso.x2 - lasso.x1)}
              height={Math.abs(lasso.y2 - lasso.y1)}
              stroke={TABLE_COLORS.selected}
              strokeWidth={1}
              dash={[4, 4]}
              fill="rgba(37, 99, 235, 0.08)"
              listening={false}
            />
          )}
        </Layer>
      </Stage>
      {drawing.type !== null && (
        <div className="fp-stage-hint">
          {drawing.type === 'line' ? (
            <>Кликните вторую точку · <b>Enter</b> — завершить · <b>Esc</b> — отмена</>
          ) : (
            <>Кликайте вершины · клик по первой вершине замкнёт · <b>Enter</b> — завершить · <b>Esc</b> — отмена</>
          )}
        </div>
      )}
    </div>
  );
}

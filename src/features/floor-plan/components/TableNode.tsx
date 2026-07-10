'use client';

import { forwardRef, useEffect, useRef } from 'react';
import { Circle, Ellipse, Group, Line, Rect, Text, Transformer } from 'react-konva';
import type Konva from 'konva';
import type { FloorPlanTable, PublicFloorPlanTable, SeatKind, TableShape, TableSeat } from '@/shared/types/floor-plan';
import { useLayoutStore } from '@/store/layout-store';
import { SEAT_COLORS, SEAT_DEFAULT_SLOTS, SEAT_SLOT_WIDTH, TABLE_COLORS } from './constants';

interface TableNodeProps {
  table: FloorPlanTable | PublicFloorTableLike;
  selected: boolean;
  busyUntil?: string;
  editable: boolean;
  onSelect: (id: string, additive: boolean) => void;
  onCommit: (id: string, patch: Partial<FloorPlanTable>) => void;
  onBookingSelect?: (id: string) => void;
}

type PublicFloorTableLike = PublicFloorPlanTable & {
  isActive?: boolean;
  visibleToGuests?: boolean;
};

function shapeProps(
  shape: TableShape,
  width: number,
  height: number,
): { kind: 'rect' | 'circle' | 'ellipse'; w: number; h: number; radiusX: number; radiusY: number } {
  if (shape === 'round') {
    const r = Math.min(width, height) / 2;
    return { kind: 'circle', w: width, h: height, radiusX: r, radiusY: r };
  }
  if (shape === 'oval') {
    return { kind: 'ellipse', w: width, h: height, radiusX: width / 2, radiusY: height / 2 };
  }
  if (shape === 'square') {
    const side = Math.min(width, height);
    return { kind: 'rect', w: side, h: side, radiusX: 0, radiusY: 0 };
  }
  return { kind: 'rect', w: width, h: height, radiusX: 0, radiusY: 0 };
}

function tableFillColor(table: PublicFloorTableLike, selected: boolean, busyUntil?: string): string {
  if (busyUntil) return TABLE_COLORS.busy;
  if (selected) return TABLE_COLORS.selected;
  if (!table.isActive) return TABLE_COLORS.inactive;
  return TABLE_COLORS.fill;
}

function polygonBbox(points: number[] | null | undefined): { w: number; h: number } {
  if (!points || points.length < 4) return { w: 0, h: 0 };
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (let i = 0; i < points.length; i += 2) {
    minX = Math.min(minX, points[i]);
    maxX = Math.max(maxX, points[i]);
    minY = Math.min(minY, points[i + 1]);
    maxY = Math.max(maxY, points[i + 1]);
  }
  return { w: Math.max(1, maxX - minX), h: Math.max(1, maxY - minY) };
}

/** Ширина посадочного места с учётом slots/width. */
function seatWidth(seat: TableSeat): number {
  if (seat.width != null && seat.width > 0) return seat.width;
  const slots = seat.slots ?? SEAT_DEFAULT_SLOTS[seat.kind];
  if (seat.kind === 'couch' || seat.kind === 'bench') return slots * SEAT_SLOT_WIDTH;
  return 22;
}

function seatSlots(seat: TableSeat): number {
  if (seat.slots != null && seat.slots > 0) return seat.slots;
  if (seat.width != null && seat.width > 0 && (seat.kind === 'couch' || seat.kind === 'bench')) {
    return Math.max(1, Math.round(seat.width / SEAT_SLOT_WIDTH));
  }
  return SEAT_DEFAULT_SLOTS[seat.kind];
}

/** Внутренние фигуры посадочного места в локальных координатах (центр = 0,0). */
function renderSeatInner(seat: TableSeat) {
  const { kind } = seat;
  const w = seatWidth(seat);
  const slots = seatSlots(seat);
  const fill = SEAT_COLORS.fill;
  const stroke = SEAT_COLORS.stroke;
  const back = SEAT_COLORS.back;
  const half = w / 2;

  if (kind === 'stool') {
    const r = Math.max(8, w / 2);
    return <Circle radius={r} fill={fill} stroke={stroke} strokeWidth={1.5} />;
  }
  if (kind === 'couch') {
    const dividers = Array.from({ length: Math.max(0, slots - 1) }).map((_, i) => {
      const t = (i + 1) / slots;
      const x = -half + t * w;
      return <Line key={`d${i}`} points={[x, -11, x, 11]} stroke={stroke} strokeWidth={1} />;
    });
    return (
      <>
        <Rect x={-half} y={-11} width={w} height={22} rx={6} fill={fill} stroke={stroke} strokeWidth={1.5} />
        <Rect x={-half} y={-17} width={w} height={7} rx={3} fill={back} stroke={stroke} strokeWidth={1.5} />
        {dividers}
      </>
    );
  }
  if (kind === 'bench') {
    const dividers = Array.from({ length: Math.max(0, slots - 1) }).map((_, i) => {
      const t = (i + 1) / slots;
      const x = -half + t * w;
      return <Line key={`d${i}`} points={[x, -8, x, 8]} stroke={stroke} strokeWidth={1} />;
    });
    return (
      <>
        <Rect x={-half} y={-8} width={w} height={16} rx={3} fill={fill} stroke={stroke} strokeWidth={1.5} />
        {dividers}
      </>
    );
  }
  return (
    <>
      <Rect x={-half} y={-9} width={w} height={18} rx={4} fill={fill} stroke={stroke} strokeWidth={1.5} />
      <Rect x={-half} y={-15} width={w} height={6} rx={2} fill={back} stroke={stroke} strokeWidth={1.5} />
    </>
  );
}

export const TableNode = forwardRef<Konva.Node, TableNodeProps>(function TableNode(
  { table, selected, busyUntil, editable, onSelect, onCommit, onBookingSelect },
  _ref,
) {
  const isPolygon = table.shape === 'polygon' && Array.isArray(table.points) && (table.points?.length ?? 0) >= 6;
  const shape = shapeProps(table.shape, table.width, table.height);
  const polyBbox = isPolygon ? polygonBbox(table.points) : { w: shape.w, h: shape.h };
  const shapeRef = useRef<Konva.Group>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const seatNodeRef = useRef<Konva.Group | null>(null);
  const seatTransformerRef = useRef<Konva.Transformer>(null);
  const selectedSeatId = useLayoutStore((s) => s.selectedSeatId);
  const setSelectedSeatId = useLayoutStore((s) => s.setSelectedSeatId);
  const isSelected = useLayoutStore((s) => s.selectedTableIdForBooking === table.id);

  const selectedSeat = selected
    ? (table.seats?.find((s) => s.id === selectedSeatId) ?? null)
    : null;
  const seatResizable = selectedSeat?.kind === 'couch' || selectedSeat?.kind === 'bench';

  useEffect(() => {
    if (editable && selected && transformerRef.current && shapeRef.current) {
      transformerRef.current.nodes([shapeRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [editable, selected, table]);

  // Под-выделение места: прикрепляем Transformer к выбранному месту для вращения/размера.
  useEffect(() => {
    if (editable && selected && selectedSeat && seatTransformerRef.current && seatNodeRef.current) {
      seatTransformerRef.current.nodes([seatNodeRef.current]);
      seatTransformerRef.current.getLayer()?.batchDraw();
    } else if (seatTransformerRef.current) {
      seatTransformerRef.current.nodes([]);
    }
  }, [editable, selected, selectedSeatId, table, selectedSeat]);

  const x = table.positionX ?? 0;
  const y = table.positionY ?? 0;
  const fill = tableFillColor(table, selected, busyUntil);
  const stroke = selected ? TABLE_COLORS.selected : TABLE_COLORS.active;
  const labelColor = selected ? '#ffffff' : TABLE_COLORS.label;
  const capacityColor = selected ? '#e5e7eb' : TABLE_COLORS.capacity;

  function handleClick(e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) {
    if (!editable) {
      if (!busyUntil && onBookingSelect) {
        onBookingSelect(table.id);
      }
      return;
    }
    setSelectedSeatId(null);
    const additive = 'ctrlKey' in e.evt && (e.evt.ctrlKey || e.evt.metaKey);
    onSelect(table.id, additive);
  }

  function handleDragEnd() {
    const node = shapeRef.current;
    if (!node) return;
    onCommit(table.id, {
      positionX: Math.round(node.x()),
      positionY: Math.round(node.y()),
    });
  }

  function handleTransformEnd() {
    const node = shapeRef.current;
    if (!node) return;
    if (isPolygon) {
      // Для полигона Transformer не используется (только бордюр); на всякий случай сброс.
      node.scaleX(1);
      node.scaleY(1);
      return;
    }
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    const newWidth = Math.max(20, Math.round(table.width * scaleX));
    const newHeight = Math.max(20, Math.round(table.height * scaleY));
    const rotation = Math.round(((node.rotation() % 360) + 360) % 360);
    node.scaleX(1);
    node.scaleY(1);
    onCommit(table.id, {
      positionX: Math.round(node.x()),
      positionY: Math.round(node.y()),
      width: newWidth,
      height: newHeight,
      rotation,
    });
  }

  function handleVertexDragEnd(index: number, node: Konva.Node) {
    if (!table.points) return;
    const points = [...table.points];
    points[index] = Math.round(node.x());
    points[index + 1] = Math.round(node.y());
    onCommit(table.id, { points });
  }

  function handleSeatDragEnd(seatId: string, node: Konva.Node) {
    const seats = (table.seats ?? []).map((s) =>
      s.id === seatId ? { ...s, x: Math.round(node.x()), y: Math.round(node.y()) } : s,
    );
    onCommit(table.id, { seats });
  }

  function handleSeatTransformEnd(seatId: string, node: Konva.Group) {
    const seat = table.seats?.find((s) => s.id === seatId);
    if (!seat) return;
    const rotation = Math.round(((node.rotation() % 360) + 360) % 360);
    const scaleX = node.scaleX();
    let width = seatWidth(seat);
    let slots = seatSlots(seat);
    if (seat.kind === 'couch' || seat.kind === 'bench') {
      width = Math.max(SEAT_SLOT_WIDTH, Math.round(width * scaleX));
      slots = Math.max(1, Math.min(8, Math.round(width / SEAT_SLOT_WIDTH)));
      width = slots * SEAT_SLOT_WIDTH;
    }
    node.scaleX(1);
    node.scaleY(1);
    node.rotation(rotation);
    const seats = (table.seats ?? []).map((s) =>
      s.id === seatId
        ? {
            ...s,
            x: Math.round(node.x()),
            y: Math.round(node.y()),
            rotation,
            width,
            slots,
          }
        : s,
    );
    onCommit(table.id, { seats });
  }

  function handleSeatClick(e: Konva.KonvaEventObject<MouseEvent | TouchEvent>, seatId: string) {
    if (!editable) return;
    e.cancelBubble = true;
    if (!selected) {
      onSelect(table.id, false);
    }
    setSelectedSeatId(seatId);
  }

  const commonShapeProps = {
    width: shape.w,
    height: shape.h,
    fill,
    stroke,
    strokeWidth: selected ? 3 : 2,
    cornerRadius: table.cornerRadius ?? 6,
    shadowColor: 'rgba(0,0,0,0.15)',
    shadowBlur: 6,
    shadowOffset: { x: 0, y: 2 },
  };

  return (
    <>
      <Group
        ref={shapeRef}
        name={table.id}
        x={x}
        y={y}
        rotation={table.rotation}
        draggable={editable}
        onClick={handleClick}
        onTap={handleClick}
        onDragend={handleDragEnd}
        onTransformend={handleTransformEnd}
        opacity={busyUntil ? 0.55 : 1}
        style={{ cursor: busyUntil ? 'not-allowed' : 'pointer' }}
      >
        {isPolygon && table.points && (
          <Line
            points={table.points}
            closed
            fill={fill}
            stroke={stroke}
            strokeWidth={selected ? 3 : 2}
            lineJoin="round"
            shadowColor="rgba(0,0,0,0.15)"
            shadowBlur={6}
            shadowOffset={{ x: 0, y: 2 }}
          />
        )}
        {!isPolygon && shape.kind === 'rect' && (
          <Rect {...commonShapeProps} width={shape.w} height={shape.h} />
        )}
        {!isPolygon && shape.kind === 'circle' && (
          <Circle
            x={shape.w / 2}
            y={shape.h / 2}
            radius={shape.radiusX}
            fill={fill}
            stroke={stroke}
            strokeWidth={selected ? 3 : 2}
            shadowColor="rgba(0,0,0,0.15)"
            shadowBlur={6}
            shadowOffset={{ x: 0, y: 2 }}
          />
        )}
        {!isPolygon && shape.kind === 'ellipse' && (
          <Ellipse
            x={shape.w / 2}
            y={shape.h / 2}
            radiusX={shape.radiusX}
            radiusY={shape.radiusY}
            fill={fill}
            stroke={stroke}
            strokeWidth={selected ? 3 : 2}
            shadowColor="rgba(0,0,0,0.15)"
            shadowBlur={6}
            shadowOffset={{ x: 0, y: 2 }}
          />
        )}
        {table.seats?.map((seat) => {
          const isSeatSelected = selectedSeat?.id === seat.id;
          return (
            <Group
              key={seat.id}
              ref={isSeatSelected ? (node: Konva.Group | null) => { seatNodeRef.current = node; } : undefined}
              x={seat.x}
              y={seat.y}
              rotation={seat.rotation ?? 0}
              draggable={editable && selected}
              onClick={(e) => handleSeatClick(e, seat.id)}
              onTap={(e) => handleSeatClick(e, seat.id)}
              onDragend={(e: Konva.KonvaEventObject<DragEvent>) =>
                handleSeatDragEnd(seat.id, e.target as Konva.Group)
              }
              onTransformend={(e: Konva.KonvaEventObject<Event>) =>
                handleSeatTransformEnd(seat.id, e.target as Konva.Group)
              }
            >
              {renderSeatInner(seat)}
            </Group>
          );
        })}
        <Text
          text={table.label}
          fontSize={14}
          fontStyle="bold"
          fill={labelColor}
          width={polyBbox.w}
          height={polyBbox.h - 18}
          align="center"
          verticalAlign="middle"
          listening={false}
        />
        <Text
          text={busyUntil ? `до ${busyUntil.slice(11, 16)}` : `${table.capacity} мест`}
          fontSize={11}
          fill={capacityColor}
          width={polyBbox.w}
          y={polyBbox.h - 16}
          align="center"
          listening={false}
        />
        {isPolygon && table.points && editable && selected && (
          <>
            {Array.from({ length: table.points.length / 2 }).map((_, i) => (
              <Circle
                key={`v${i}`}
                x={table.points![i * 2]}
                y={table.points![i * 2 + 1]}
                radius={6}
                fill="#ffffff"
                stroke={TABLE_COLORS.selected}
                strokeWidth={2}
                draggable
                onDragend={(e: Konva.KonvaEventObject<DragEvent>) =>
                  handleVertexDragEnd(i * 2, e.target as Konva.Circle)
                }
              />
            ))}
          </>
        )}
        {!editable && isSelected && (
          <Rect
            width={polyBbox.w}
            height={polyBbox.h}
            stroke={TABLE_COLORS.booked}
            strokeWidth={3}
            dash={[6, 4]}
            listening={false}
          />
        )}
      </Group>
      {editable && selected && !selectedSeat && (
        <Transformer
          ref={transformerRef}
          rotateEnabled={!isPolygon}
          rotationSnaps={[0, 90, 180, 270]}
          rotationSnapTolerance={5}
          enabledAnchors={isPolygon ? [] : [
            'top-left', 'top-right', 'bottom-left', 'bottom-right',
            'middle-left', 'middle-right', 'top-center', 'bottom-center',
          ]}
          anchorSize={8}
          borderStroke={TABLE_COLORS.selected}
          rotateAnchorOffset={24}
        />
      )}
      {editable && selected && selectedSeat && (
        <Transformer
          ref={seatTransformerRef}
          rotateEnabled
          rotationSnaps={[0, 90, 180, 270]}
          rotationSnapTolerance={5}
          enabledAnchors={seatResizable ? ['middle-left', 'middle-right'] : []}
          anchorSize={8}
          borderStroke={SEAT_COLORS.selected}
          borderDash={[4, 4]}
          rotateAnchorOffset={20}
        />
      )}
    </>
  );
});

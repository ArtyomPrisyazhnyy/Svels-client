'use client';

import { forwardRef, useEffect, useRef } from 'react';
import { Circle, Ellipse, Group, Line, Path, Rect, Text, Transformer } from 'react-konva';
import type Konva from 'konva';
import type { DecorObject, PolylineDecorObject, ZoneDecorObject } from '@/shared/types/floor-plan';
import { DECOR_ICONS } from './constants';
import { buildRoundedPath } from './path-utils';

/** Внутренний рендер point-based decor (line/polyline/zone) с учётом spline и скругления. */
function renderPointBasedInner(
  decor: PolylineDecorObject | ZoneDecorObject,
) {
  const tension = decor.tension ?? 0;
  const cornerRadius = decor.cornerRadius ?? 0;
  const closed = decor.type === 'zone' ? true : decor.closed;
  const isZone = decor.type === 'zone';
  const hitProps = {
    hitStrokeWidth: isZone ? 0 : Math.max(12, decor.strokeWidth * 2),
    perfectDrawEnabled: false,
  };

  if (tension > 0) {
    return (
      <Line
        {...hitProps}
        points={decor.points}
        closed={closed}
        tension={tension}
        lineCap="round"
        lineJoin="round"
        stroke={isZone ? decor.stroke : decor.color}
        strokeWidth={decor.strokeWidth}
        fill={isZone ? decor.fill : undefined}
      />
    );
  }

  if (cornerRadius > 0 && decor.points.length >= 6) {
    return (
      <Path
        {...hitProps}
        data={buildRoundedPath(decor.points, cornerRadius, closed)}
        stroke={isZone ? decor.stroke : decor.color}
        strokeWidth={decor.strokeWidth}
        fill={isZone ? decor.fill : undefined}
        lineJoin="round"
        lineCap="round"
      />
    );
  }

  return (
    <>
      {isZone && (
        <Line
          points={decor.points}
          closed
          fill={decor.fill}
          strokeWidth={0}
          listening
          perfectDrawEnabled={false}
        />
      )}
      <Line
        {...hitProps}
        points={decor.points}
        closed={closed}
        stroke={isZone ? decor.stroke : decor.color}
        strokeWidth={decor.strokeWidth}
        fill={isZone ? undefined : undefined}
        lineCap="round"
        lineJoin="round"
      />
    </>
  );
}

interface DecorNodeProps {
  decor: DecorObject;
  selected: boolean;
  editable: boolean;
  onSelect: (id: string, additive: boolean) => void;
  onCommit: (id: string, patch: Partial<DecorObject>) => void;
}

function decorIconLabel(icon: string): string {
  const found = (DECOR_ICONS as ReadonlyArray<{ value: string; emoji: string }>).find((i) => i.value === icon);
  return found?.emoji ?? '✦';
}

const TRANSFORMER_ANCHORS = [
  'top-left', 'top-right', 'bottom-left', 'bottom-right',
  'middle-left', 'middle-right', 'top-center', 'bottom-center',
] as const;

export const DecorNode = forwardRef<Konva.Node, DecorNodeProps>(function DecorNode(
  { decor, selected, editable, onSelect, onCommit },
  _ref,
) {
  const groupRef = useRef<Konva.Group>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  // (Пере)привязываем Transformer к узлу при выборе и при любом изменении decor,
  // чтобы рамка следовала за новой геометрией после коммита drag/transform.
  useEffect(() => {
    if (editable && selected && transformerRef.current && groupRef.current) {
      transformerRef.current.nodes([groupRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [editable, selected, decor]);

  function handleClick(e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) {
    if (!editable) return;
    e.cancelBubble = true;
    const additive = 'ctrlKey' in e.evt && (e.evt.ctrlKey || e.evt.metaKey);
    onSelect(decor.id, additive);
  }

  /**
   * Применить текущую матрицу трансформации узла к точкам line/polyline/zone
   * и закоммитить в store. После — сбросить узел к тождеству (точки теперь абсолютные).
   */
  function commitPointBasedTransform(node: Konva.Group) {
    const t = node.getTransform();
    const src = (decor as PolylineDecorObject | ZoneDecorObject).points;
    const newPoints: number[] = new Array(src.length);
    for (let i = 0; i < src.length; i += 2) {
      const p = t.point({ x: src[i], y: src[i + 1] });
      newPoints[i] = Math.round(p.x);
      newPoints[i + 1] = Math.round(p.y);
    }
    onCommit(decor.id, { points: newPoints } as Partial<DecorObject>);
    node.x(0);
    node.y(0);
    node.scaleX(1);
    node.scaleY(1);
    node.rotation(0);
  }

  function handleDragEnd() {
    const node = groupRef.current;
    if (!node) return;
    if (decor.type === 'line' || decor.type === 'polyline' || decor.type === 'zone') {
      commitPointBasedTransform(node);
    } else {
      onCommit(decor.id, {
        x: Math.round(node.x()),
        y: Math.round(node.y()),
      } as Partial<DecorObject>);
    }
  }

  function handleTransformEnd() {
    const node = groupRef.current;
    if (!node) return;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    const rotation = Math.round(((node.rotation() % 360) + 360) % 360);
    if (decor.type === 'line' || decor.type === 'polyline' || decor.type === 'zone') {
      commitPointBasedTransform(node);
      return;
    }
    if (decor.type === 'shape' || decor.type === 'decor-icon') {
      onCommit(decor.id, {
        x: Math.round(node.x()),
        y: Math.round(node.y()),
        width: Math.max(10, Math.round(decor.width * scaleX)),
        height: Math.max(10, Math.round(decor.height * scaleY)),
        rotation,
      } as Partial<DecorObject>);
    } else if (decor.type === 'text') {
      onCommit(decor.id, {
        x: Math.round(node.x()),
        y: Math.round(node.y()),
        rotation,
        fontSize: Math.max(8, Math.round(decor.fontSize * Math.max(scaleX, scaleY))),
      } as Partial<DecorObject>);
    }
    node.scaleX(1);
    node.scaleY(1);
  }

  const isPointBased = decor.type === 'line' || decor.type === 'polyline' || decor.type === 'zone';
  const isBoxBased = decor.type === 'shape' || decor.type === 'text' || decor.type === 'decor-icon';

  const transformerProps = {
    rotateEnabled: true,
    rotationSnaps: [0, 90, 180, 270],
    rotationSnapTolerance: 5,
    enabledAnchors: isPointBased ? [] : [...TRANSFORMER_ANCHORS],
    anchorSize: 8,
    borderStroke: '#2563eb',
    borderDash: isPointBased ? ([4, 4] as number[]) : undefined,
    rotateAnchorOffset: 24,
  };

  return (
    <>
      {decor.type === 'line' && (
        <Group
          ref={groupRef}
          name={decor.id}
          draggable={editable}
          onClick={handleClick}
          onTap={handleClick}
          onDragend={handleDragEnd}
          onTransformend={handleTransformEnd}
        >
          <Line
            points={decor.points}
            stroke={decor.color}
            strokeWidth={decor.strokeWidth}
            lineCap="round"
            hitStrokeWidth={Math.max(12, decor.strokeWidth * 2)}
          />
        </Group>
      )}
      {decor.type === 'polyline' && (
        <Group
          ref={groupRef}
          name={decor.id}
          draggable={editable}
          onClick={handleClick}
          onTap={handleClick}
          onDragend={handleDragEnd}
          onTransformend={handleTransformEnd}
        >
          {renderPointBasedInner(decor)}
        </Group>
      )}
      {decor.type === 'zone' && (
        <Group
          ref={groupRef}
          name={decor.id}
          draggable={editable}
          onClick={handleClick}
          onTap={handleClick}
          onDragend={handleDragEnd}
          onTransformend={handleTransformEnd}
        >
          {renderPointBasedInner(decor)}
        </Group>
      )}
      {decor.type === 'shape' && (
        <Group
          ref={groupRef}
          name={decor.id}
          x={decor.x}
          y={decor.y}
          rotation={decor.rotation}
          draggable={editable}
          onClick={handleClick}
          onTap={handleClick}
          onDragend={handleDragEnd}
          onTransformend={handleTransformEnd}
        >
          {decor.shape === 'rect' && (
            <Rect
              width={decor.width}
              height={decor.height}
              fill={decor.fill}
              stroke={decor.stroke}
              strokeWidth={decor.strokeWidth}
            />
          )}
          {decor.shape === 'circle' && (
            <Circle
              x={decor.width / 2}
              y={decor.height / 2}
              radius={Math.min(decor.width, decor.height) / 2}
              fill={decor.fill}
              stroke={decor.stroke}
              strokeWidth={decor.strokeWidth}
            />
          )}
          {decor.shape === 'oval' && (
            <Ellipse
              x={decor.width / 2}
              y={decor.height / 2}
              radiusX={decor.width / 2}
              radiusY={decor.height / 2}
              fill={decor.fill}
              stroke={decor.stroke}
              strokeWidth={decor.strokeWidth}
            />
          )}
          {decor.shape === 'triangle' && (
            <Path
              data={`M ${decor.width / 2} 0 L ${decor.width} ${decor.height} L 0 ${decor.height} Z`}
              fill={decor.fill}
              stroke={decor.stroke}
              strokeWidth={decor.strokeWidth}
            />
          )}
        </Group>
      )}
      {decor.type === 'text' && (
        <Group
          ref={groupRef}
          name={decor.id}
          x={decor.x}
          y={decor.y}
          rotation={decor.rotation}
          draggable={editable}
          onClick={handleClick}
          onTap={handleClick}
          onDragend={handleDragEnd}
          onTransformend={handleTransformEnd}
        >
          <Text
            text={decor.text}
            fontSize={decor.fontSize}
            fill={decor.color}
          />
        </Group>
      )}
      {decor.type === 'decor-icon' && (
        <Group
          ref={groupRef}
          name={decor.id}
          x={decor.x}
          y={decor.y}
          rotation={decor.rotation}
          draggable={editable}
          onClick={handleClick}
          onTap={handleClick}
          onDragend={handleDragEnd}
          onTransformend={handleTransformEnd}
        >
          <Rect
            width={decor.width}
            height={decor.height}
            fill={decor.color ?? '#f3f4f6'}
            cornerRadius={6}
            opacity={0.85}
          />
          <Text
            text={decorIconLabel(decor.icon)}
            fontSize={decor.width * 0.6}
            width={decor.width}
            height={decor.height}
            align="center"
            verticalAlign="middle"
            listening={false}
          />
        </Group>
      )}
      {editable && selected && isBoxBased && <Transformer ref={transformerRef} {...transformerProps} />}
      {editable && selected && isPointBased && <Transformer ref={transformerRef} {...transformerProps} />}
    </>
  );
});

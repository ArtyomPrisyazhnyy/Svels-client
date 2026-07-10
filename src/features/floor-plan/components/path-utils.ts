/**
 * Утилиты геометрии для рендера decor/столов на Konva.
 */

interface Pt { x: number; y: number; }

function toPoints(flat: number[]): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i < flat.length; i += 2) pts.push({ x: flat[i], y: flat[i + 1] });
  return pts;
}

function dist(a: Pt, b: Pt): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/**
 * Построить SVG-path для замкнутого/разомкнутого многоугольника со скруглёнными
 * углами радиуса `radius`. Заменяет каждую вершину (кроме концов разомкнутой
 * ломаной) дугой. Радиус ограничивается половиной длины смежных сегментов,
 * чтобы дуги не пересекались.
 */
export function buildRoundedPath(flatPoints: number[], radius: number, closed: boolean): string {
  const pts = toPoints(flatPoints);
  if (pts.length < 2) return '';
  const r = Math.max(0, radius);
  if (r === 0 || pts.length < 3) {
    const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    return closed ? `${d} Z` : d;
  }

  const n = pts.length;
  const segments: Array<{ from: Pt; to: Pt; len: number; ux: number; uy: number }> = [];
  const segCount = closed ? n : n - 1;
  for (let i = 0; i < segCount; i++) {
    const from = pts[i];
    const to = pts[(i + 1) % n];
    const len = dist(from, to) || 1e-6;
    segments.push({ from, to, len, ux: (to.x - from.x) / len, uy: (to.y - from.y) / len });
  }

  // Для каждой вершины считаем допустимый радиус = min(r, len(prev)/2, len(next)/2).
  function cornerRadius(i: number): number {
    const prev = segments[(i - 1 + segCount) % segCount];
    const next = segments[i % segCount];
    const isEndpoint = !closed && (i === 0 || i === n - 1);
    if (isEndpoint) return 0;
    return Math.min(r, prev.len / 2, next.len / 2);
  }

  // Точка начала дуги (отступ от вершины назад по предыдущему сегменту)
  // и конца дуги (отступ вперёд по следующему сегменту).
  function arcPoints(i: number): { p1: Pt; p2: Pt; cr: number } | null {
    const cr = cornerRadius(i);
    if (cr <= 0) return null;
    const prev = segments[(i - 1 + segCount) % segCount];
    const next = segments[i % segCount];
    const v = pts[i];
    // p1 = v - prevDir * cr  (вдоль предыдущего сегмента к вершине)
    const p1 = { x: v.x - prev.ux * cr, y: v.y - prev.uy * cr };
    // p2 = v + nextDir * cr
    const p2 = { x: v.x + next.ux * cr, y: v.y + next.uy * cr };
    return { p1, p2, cr };
  }

  const parts: string[] = [];
  // Старт — в начале первой дуги (или в первой вершине, если угла нет).
  const firstArc = arcPoints(0);
  if (firstArc) {
    parts.push(`M ${firstArc.p1.x} ${firstArc.p1.y}`);
  } else {
    parts.push(`M ${pts[0].x} ${pts[0].y}`);
  }

  for (let i = 0; i < n; i++) {
    const cur = pts[i];
    const arc = arcPoints(i);
    if (arc) {
      // дуга из p1 в p2 с радиусом cr
      parts.push(`A ${arc.cr} ${arc.cr} 0 0 1 ${arc.p2.x} ${arc.p2.y}`);
      // далее линия до начала следующей дуги (или до следующей вершины)
      const nextIdx = (i + 1) % n;
      if (nextIdx !== 0 || closed) {
        const nextArc = arcPoints(nextIdx);
        const target = nextArc ? nextArc.p1 : pts[nextIdx];
        // не дублируем нулевую линию
        if (dist(arc.p2, target) > 1e-6) {
          parts.push(`L ${target.x} ${target.y}`);
        }
      }
    } else {
      // без скругления — линия до следующей точки/дуги
      const nextIdx = (i + 1) % n;
      if (nextIdx !== 0 || closed) {
        const nextArc = arcPoints(nextIdx);
        const target = nextArc ? nextArc.p1 : pts[nextIdx];
        if (dist(cur, target) > 1e-6) {
          parts.push(`L ${target.x} ${target.y}`);
        }
      }
    }
  }

  if (closed) parts.push('Z');
  return parts.join(' ');
}

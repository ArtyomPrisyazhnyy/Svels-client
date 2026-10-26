/** Периоды KPI. График всегда покрывает последние 30 календарных дней Минска. */
export type StatsPeriod = 'today' | '7d' | '30d';

export type StatsFulfillment = 'delivery' | 'takeaway' | 'dine_in';

export interface StatsOrderItem {
  name: string;
  quantity: number | string;
  lineTotal: number | string;
}

export interface StatsOrder {
  createdAt: string;
  status: string;
  fulfillmentType: StatsFulfillment | string;
  totalAmount: number | string;
  items: StatsOrderItem[];
}

export interface StatsBooking {
  bookingDate: string;
  status: string;
}

export interface StatsKpi {
  current: number;
  previous: number;
  /** null — предыдущий период был нулевым, а текущий нет («новое»). */
  deltaPercent: number | null;
}

export interface StatsDayPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface StatsTopProduct {
  name: string;
  quantity: number;
  revenue: number;
}

export interface StatsFulfillmentSplit {
  delivery: number;
  takeaway: number;
  dine_in: number;
}

export interface OwnerStats {
  period: StatsPeriod;
  comparisonLabel: string;
  kpis: {
    revenue: StatsKpi;
    orders: StatsKpi;
    averageCheck: StatsKpi;
    bookings: StatsKpi;
  };
  series: StatsDayPoint[];
  topProducts: StatsTopProduct[];
  fulfillment: StatsFulfillmentSplit;
}

export interface PeriodBounds {
  start: string;
  end: string;
  previousStart: string;
  previousEnd: string;
}

const PERIOD_DAYS: Record<StatsPeriod, number> = {
  today: 1,
  '7d': 7,
  '30d': 30,
};

const COMPARISON_LABEL: Record<StatsPeriod, string> = {
  today: 'ко вчера',
  '7d': 'к 7 дням ранее',
  '30d': 'к 30 дням ранее',
};

export function addCalendarDays(isoDate: string, days: number): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  const utc = new Date(Date.UTC(year, (month ?? 1) - 1, (day ?? 1) + days));
  const y = utc.getUTCFullYear();
  const m = String(utc.getUTCMonth() + 1).padStart(2, '0');
  const d = String(utc.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function periodBounds(today: string, period: StatsPeriod): PeriodBounds {
  const days = PERIOD_DAYS[period];
  const end = today;
  const start = addCalendarDays(today, -(days - 1));
  const previousEnd = addCalendarDays(start, -1);
  const previousStart = addCalendarDays(previousEnd, -(days - 1));
  return { start, end, previousStart, previousEnd };
}

export function listCalendarDays(start: string, end: string): string[] {
  const days: string[] = [];
  let cursor = start;
  while (cursor <= end && days.length < 400) {
    days.push(cursor);
    cursor = addCalendarDays(cursor, 1);
  }
  return days;
}

const MINSK_TZ = 'Europe/Minsk';

/** YYYY-MM-DD в календаре Europe/Minsk. */
export function minskCalendarDate(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: MINSK_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

export function orderCalendarDay(createdAt: string): string | null {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return minskCalendarDate(date);
}

export function bookingCalendarDay(bookingDate: string): string | null {
  const match = /^(\d{4}-\d{2}-\d{2})/.exec(bookingDate.trim());
  return match?.[1] ?? null;
}

function inRange(day: string, start: string, end: string): boolean {
  return day >= start && day <= end;
}

function money(value: number | string): number {
  const numeric = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
}

function isCancelled(status: string): boolean {
  return status === 'cancelled';
}

export function deltaPercent(current: number, previous: number): number | null {
  if (previous === 0) {
    return current === 0 ? 0 : null;
  }
  return ((current - previous) / previous) * 100;
}

export function formatSignedPercent(percent: number | null): string {
  if (percent === null) {
    return 'новое';
  }
  const abs = Math.abs(percent);
  const digits = abs !== 0 && abs < 10 ? 1 : 0;
  const rounded = Number(percent.toFixed(digits));
  if (rounded === 0) {
    return '0%';
  }
  const body = Math.abs(rounded).toLocaleString('ru-RU', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
  return `${rounded > 0 ? '+' : '−'}${body}%`;
}

export type DeltaTone = 'up' | 'down' | 'flat';

export function deltaTone(percent: number | null): DeltaTone {
  if (percent === null) {
    return 'up';
  }
  if (percent > 0.05) {
    return 'up';
  }
  if (percent < -0.05) {
    return 'down';
  }
  return 'flat';
}

function kpi(current: number, previous: number): StatsKpi {
  return { current, previous, deltaPercent: deltaPercent(current, previous) };
}

function average(revenue: number, orders: number): number {
  if (orders <= 0) {
    return 0;
  }
  return revenue / orders;
}

interface Bucket {
  revenue: number;
  orders: number;
  products: Map<string, StatsTopProduct>;
  fulfillment: StatsFulfillmentSplit;
}

function emptyBucket(): Bucket {
  return {
    revenue: 0,
    orders: 0,
    products: new Map(),
    fulfillment: { delivery: 0, takeaway: 0, dine_in: 0 },
  };
}

function consumeOrder(bucket: Bucket, order: StatsOrder): void {
  if (isCancelled(order.status)) {
    return;
  }
  const total = money(order.totalAmount);
  bucket.revenue += total;
  bucket.orders += 1;
  if (
    order.fulfillmentType === 'delivery' ||
    order.fulfillmentType === 'takeaway' ||
    order.fulfillmentType === 'dine_in'
  ) {
    bucket.fulfillment[order.fulfillmentType] += 1;
  }
  for (const item of order.items) {
    const name = item.name.trim() || 'Позиция';
    const quantity = money(item.quantity);
    const lineTotal = money(item.lineTotal);
    const existing = bucket.products.get(name) ?? { name, quantity: 0, revenue: 0 };
    existing.quantity += quantity;
    existing.revenue += lineTotal;
    bucket.products.set(name, existing);
  }
}

function countBookings(bookings: StatsBooking[], start: string, end: string): number {
  let count = 0;
  for (const booking of bookings) {
    if (isCancelled(booking.status)) {
      continue;
    }
    const day = bookingCalendarDay(booking.bookingDate);
    if (day && inRange(day, start, end)) {
      count += 1;
    }
  }
  return count;
}

export function computeOwnerStats(input: {
  orders: StatsOrder[];
  bookings: StatsBooking[];
  today: string;
  period: StatsPeriod;
}): OwnerStats {
  const bounds = periodBounds(input.today, input.period);
  const chartStart = addCalendarDays(input.today, -29);
  const current = emptyBucket();
  const byDay = new Map<string, { revenue: number; orders: number }>();

  for (const order of input.orders) {
    const day = orderCalendarDay(order.createdAt);
    if (!day || isCancelled(order.status)) {
      continue;
    }
    if (inRange(day, bounds.start, bounds.end)) {
      consumeOrder(current, order);
    }
    if (inRange(day, chartStart, input.today)) {
      const point = byDay.get(day) ?? { revenue: 0, orders: 0 };
      point.revenue += money(order.totalAmount);
      point.orders += 1;
      byDay.set(day, point);
    }
  }

  const previous = emptyBucket();
  for (const order of input.orders) {
    const day = orderCalendarDay(order.createdAt);
    if (!day || !inRange(day, bounds.previousStart, bounds.previousEnd)) {
      continue;
    }
    consumeOrder(previous, order);
  }

  const series = listCalendarDays(chartStart, input.today).map((date) => ({
    date,
    revenue: byDay.get(date)?.revenue ?? 0,
    orders: byDay.get(date)?.orders ?? 0,
  }));

  const topProducts = [...current.products.values()]
    .sort((a, b) => b.revenue - a.revenue || b.quantity - a.quantity || a.name.localeCompare(b.name, 'ru'))
    .slice(0, 5);

  return {
    period: input.period,
    comparisonLabel: COMPARISON_LABEL[input.period],
    kpis: {
      revenue: kpi(current.revenue, previous.revenue),
      orders: kpi(current.orders, previous.orders),
      averageCheck: kpi(average(current.revenue, current.orders), average(previous.revenue, previous.orders)),
      bookings: kpi(
        countBookings(input.bookings, bounds.start, bounds.end),
        countBookings(input.bookings, bounds.previousStart, bounds.previousEnd),
      ),
    },
    series,
    topProducts,
    fulfillment: current.fulfillment,
  };
}

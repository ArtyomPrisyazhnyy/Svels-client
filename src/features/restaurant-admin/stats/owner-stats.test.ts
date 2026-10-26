import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  addCalendarDays,
  computeOwnerStats,
  formatSignedPercent,
  periodBounds,
  type StatsBooking,
  type StatsOrder,
} from './owner-stats.ts';

const TODAY = '2026-10-26';

function atMinskNoon(day: string): string {
  return `${day}T09:00:00.000Z`;
}

const orders: StatsOrder[] = [
  {
    createdAt: atMinskNoon(TODAY),
    status: 'completed',
    fulfillmentType: 'delivery',
    totalAmount: 120,
    items: [
      { name: 'Борщ', quantity: 2, lineTotal: 70 },
      { name: 'Чай', quantity: 1, lineTotal: 50 },
    ],
  },
  {
    createdAt: atMinskNoon(TODAY),
    status: 'new',
    fulfillmentType: 'takeaway',
    totalAmount: 30,
    items: [{ name: 'Чай', quantity: 1, lineTotal: 30 }],
  },
  {
    createdAt: atMinskNoon('2026-10-25'),
    status: 'completed',
    fulfillmentType: 'dine_in',
    totalAmount: 40,
    items: [{ name: 'Драники', quantity: 1, lineTotal: 40 }],
  },
  {
    createdAt: atMinskNoon('2026-10-25'),
    status: 'cancelled',
    fulfillmentType: 'delivery',
    totalAmount: 999,
    items: [{ name: 'Отмена', quantity: 4, lineTotal: 999 }],
  },
  {
    createdAt: atMinskNoon('2026-10-23'),
    status: 'completed',
    fulfillmentType: 'delivery',
    totalAmount: 10,
    items: [{ name: 'Чай', quantity: 1, lineTotal: 10 }],
  },
  {
    createdAt: atMinskNoon('2026-09-27'),
    status: 'completed',
    fulfillmentType: 'takeaway',
    totalAmount: 15,
    items: [{ name: 'Суп', quantity: 1, lineTotal: 15 }],
  },
  {
    createdAt: atMinskNoon('2026-09-26'),
    status: 'completed',
    fulfillmentType: 'delivery',
    totalAmount: 70,
    items: [{ name: 'Старое', quantity: 1, lineTotal: 70 }],
  },
];

const bookings: StatsBooking[] = [
  { bookingDate: TODAY, status: 'confirmed' },
  { bookingDate: TODAY, status: 'cancelled' },
  { bookingDate: '2026-10-25', status: 'pending' },
  { bookingDate: '2026-10-20', status: 'completed' },
];

describe('owner stats periods', () => {
  it('builds inclusive windows in the Minsk calendar', () => {
    assert.equal(addCalendarDays('2026-10-26', -29), '2026-09-27');
    assert.deepEqual(periodBounds(TODAY, 'today'), {
      start: TODAY,
      end: TODAY,
      previousStart: '2026-10-25',
      previousEnd: '2026-10-25',
    });
    assert.deepEqual(periodBounds(TODAY, '7d'), {
      start: '2026-10-20',
      end: TODAY,
      previousStart: '2026-10-13',
      previousEnd: '2026-10-19',
    });
    assert.equal(periodBounds(TODAY, '30d').start, '2026-09-27');
    assert.equal(periodBounds(TODAY, '30d').previousEnd, '2026-09-26');
  });

  it('counts revenue, orders, average check and bookings without cancellations', () => {
    const stats = computeOwnerStats({ orders, bookings, today: TODAY, period: 'today' });
    assert.equal(stats.kpis.revenue.current, 150);
    assert.equal(stats.kpis.revenue.previous, 40);
    assert.equal(stats.kpis.orders.current, 2);
    assert.equal(stats.kpis.orders.previous, 1);
    assert.equal(stats.kpis.averageCheck.current, 75);
    assert.equal(stats.kpis.averageCheck.previous, 40);
    assert.equal(stats.kpis.bookings.current, 1);
    assert.equal(stats.kpis.bookings.previous, 1);
    assert.equal(formatSignedPercent(stats.kpis.revenue.deltaPercent), '+275%');
    assert.equal(formatSignedPercent(stats.kpis.bookings.deltaPercent), '0%');
    assert.deepEqual(
      stats.topProducts.map((product) => product.name),
      ['Чай', 'Борщ'],
    );
    assert.equal(stats.topProducts[0]?.revenue, 80);
    assert.equal(stats.topProducts[0]?.quantity, 2);
    assert.deepEqual(stats.fulfillment, { delivery: 1, takeaway: 1, dine_in: 0 });
  });

  it('widens the window to 7 and 30 days and always charts 30 days', () => {
    const week = computeOwnerStats({ orders, bookings, today: TODAY, period: '7d' });
    assert.equal(week.kpis.revenue.current, 200);
    assert.equal(week.kpis.orders.current, 4);
    assert.equal(week.kpis.bookings.current, 3);
    assert.equal(formatSignedPercent(week.kpis.bookings.deltaPercent), 'новое');

    const month = computeOwnerStats({ orders, bookings, today: TODAY, period: '30d' });
    assert.equal(month.series.length, 30);
    assert.equal(month.series[0]?.date, '2026-09-27');
    assert.equal(month.series[29]?.date, TODAY);
    assert.equal(month.series[0]?.revenue, 15);
    assert.equal(month.kpis.revenue.previous, 70);
    assert.equal(month.kpis.revenue.current, 215);
    assert.equal(month.series.some((point) => point.date === '2026-09-26'), false);
  });

  it('formats signed percents and an empty period', () => {
    assert.equal(formatSignedPercent(null), 'новое');
    assert.equal(formatSignedPercent(0), '0%');
    assert.equal(formatSignedPercent(8.54), '+8,5%');
    assert.equal(formatSignedPercent(-3), '−3,0%');
    const empty = computeOwnerStats({ orders: [], bookings: [], today: TODAY, period: '30d' });
    assert.equal(empty.kpis.revenue.current, 0);
    assert.equal(empty.series.length, 30);
    assert.equal(empty.topProducts.length, 0);
    assert.deepEqual(empty.fulfillment, { delivery: 0, takeaway: 0, dine_in: 0 });
  });
});

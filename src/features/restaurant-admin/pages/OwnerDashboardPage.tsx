'use client';

import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { RestaurantStylingShell } from '@/features/restaurants/context/RestaurantStylingContext';
import { ApiError } from '@/shared/api/api-client';
import { CurrencyAmount } from '@/shared/components/CurrencyAmount';
import { formatCurrencyAmount } from '@/shared/utils/currency-format.util';
import {
  DEFAULT_RESTAURANT_STYLING,
  type RestaurantStyling,
} from '@/shared/types/restaurant-styling';
import { Button, PageTitle, SegmentedControl, Skeleton, Stack } from '@/shared/ui';
import { useAuthStore } from '@/store/auth.store';
import { fetchRestaurantStyling } from '../api/styling.api';
import { fetchOwnerStatsSources } from '../stats/fetch-owner-stats';
import {
  computeOwnerStats,
  deltaTone,
  formatSignedPercent,
  minskCalendarDate,
  type OwnerStats,
  type StatsBooking,
  type StatsOrder,
  type StatsPeriod,
} from '../stats/owner-stats';
import '../styles/owner-dashboard.scss';

const PERIOD_OPTIONS: Array<{ value: StatsPeriod; label: string; testId: string }> = [
  { value: 'today', label: 'Сегодня', testId: 'owner-stats-period-today' },
  { value: '7d', label: '7 дней', testId: 'owner-stats-period-7d' },
  { value: '30d', label: '30 дней', testId: 'owner-stats-period-30d' },
];

const FULFILLMENT_META = [
  { key: 'delivery' as const, label: 'Доставка', swatch: 'owner-stats__dot--delivery' },
  { key: 'takeaway' as const, label: 'Самовывоз', swatch: 'owner-stats__dot--takeaway' },
  { key: 'dine_in' as const, label: 'В зале', swatch: 'owner-stats__dot--dinein' },
];

type LoadState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; orders: StatsOrder[]; bookings: StatsBooking[]; today: string };

function axisLabel(iso: string): string {
  const [, month, day] = iso.split('-');
  return `${day}.${month}`;
}

function OwnerStatsBody({ stats }: { stats: OwnerStats }) {
  const maxRevenue = Math.max(...stats.series.map((point) => point.revenue), 0);
  const maxOrders = Math.max(...stats.series.map((point) => point.orders), 0);
  const chartHasOrders = stats.series.some((point) => point.orders > 0);
  const fulfillmentTotal =
    stats.fulfillment.delivery + stats.fulfillment.takeaway + stats.fulfillment.dine_in;
  const first = stats.series[0];
  const last = stats.series[stats.series.length - 1];
  const mid = stats.series[Math.floor(stats.series.length / 2)];
  const chartHeadroom = 10;
  const chartScale = 100 - chartHeadroom;
  const linePoints = stats.series
    .map((point, index) => {
      const y =
        maxOrders > 0
          ? chartHeadroom + (1 - point.orders / maxOrders) * chartScale
          : 100;
      return `${index + 0.5},${y}`;
    })
    .join(' ');

  return (
    <Stack gap={4}>
      <div className="owner-stats__kpis" data-testid="owner-stats-kpis">
        <KpiCard
          label="Выручка"
          testId="owner-stats-revenue"
          value={<CurrencyAmount className="owner-stats__price" amount={stats.kpis.revenue.current} />}
          kpi={stats.kpis.revenue}
          hint={stats.comparisonLabel}
        />
        <KpiCard
          label="Заказы"
          testId="owner-stats-orders"
          value={<span className="owner-stats__count">{stats.kpis.orders.current}</span>}
          kpi={stats.kpis.orders}
          hint={stats.comparisonLabel}
        />
        <KpiCard
          label="Средний чек"
          testId="owner-stats-average"
          value={<CurrencyAmount className="owner-stats__price" amount={stats.kpis.averageCheck.current} />}
          kpi={stats.kpis.averageCheck}
          hint={stats.comparisonLabel}
        />
        <KpiCard
          label="Брони"
          testId="owner-stats-bookings"
          value={<span className="owner-stats__count">{stats.kpis.bookings.current}</span>}
          kpi={stats.kpis.bookings}
          hint={stats.comparisonLabel}
        />
      </div>

      <div className="owner-stats__panels">
        <section className="owner-stats__card" aria-labelledby="owner-stats-chart-title">
          <div className="owner-stats__card-head">
            <h2 id="owner-stats-chart-title" className="owner-stats__heading">
              30 дней
            </h2>
            <div className="owner-stats__chart-key">
              <span className="owner-stats__key">
                <i className="owner-stats__key-bar" aria-hidden />
                Выручка
              </span>
              <span className="owner-stats__key">
                <i className="owner-stats__key-line" aria-hidden />
                Заказы
              </span>
            </div>
          </div>
          {chartHasOrders && first && last && mid ? (
            <div
              className="owner-stats__chart"
              data-testid="owner-stats-chart"
              role="img"
              aria-label={`Выручка и заказы за 30 дней. Последний день ${axisLabel(last.date)}: ${formatCurrencyAmount(last.revenue)} рублей, заказов ${last.orders}.`}
            >
              <div className="owner-stats__chart-plot">
                {stats.series.map((point) => {
                  const height =
                    point.revenue <= 0 || maxRevenue <= 0
                      ? 0
                      : Math.max(6, (point.revenue / maxRevenue) * chartScale);
                  return (
                    <div
                      key={point.date}
                      className="owner-stats__bar-col"
                      title={`${axisLabel(point.date)} · ${formatCurrencyAmount(point.revenue)} · заказов ${point.orders}`}
                    >
                      <div className="owner-stats__bar" style={{ height: `${height}%` }} />
                    </div>
                  );
                })}
                {maxOrders > 0 ? (
                  <svg
                    className="owner-stats__chart-line"
                    viewBox={`0 0 ${stats.series.length} 100`}
                    preserveAspectRatio="none"
                    aria-hidden
                  >
                    <polyline points={linePoints} />
                  </svg>
                ) : null}
              </div>
              <div className="owner-stats__chart-axis">
                <span>{axisLabel(first.date)}</span>
                <span>{axisLabel(mid.date)}</span>
                <span>{axisLabel(last.date)}</span>
              </div>
            </div>
          ) : (
            <p className="owner-stats__empty" data-testid="owner-stats-empty">
              За 30 дней заказов не было. График появится после первых предзаказов.
            </p>
          )}
        </section>

        <div className="owner-stats__side">
          <section className="owner-stats__card" aria-labelledby="owner-stats-top-title">
            <h2 id="owner-stats-top-title" className="owner-stats__heading">
              Топ позиций
            </h2>
            {stats.topProducts.length === 0 ? (
              <p className="owner-stats__empty">В этом периоде проданных позиций нет.</p>
            ) : (
              <ol className="owner-stats__products" data-testid="owner-stats-top">
                {stats.topProducts.map((product, index) => (
                  <li key={product.name} className="owner-stats__product">
                    <span className="owner-stats__rank">{index + 1}</span>
                    <span className="owner-stats__product-copy">
                      <span className="owner-stats__product-name">{product.name}</span>
                      <span className="owner-stats__product-qty">{product.quantity} шт.</span>
                    </span>
                    <CurrencyAmount className="owner-stats__product-price" amount={product.revenue} />
                  </li>
                ))}
              </ol>
            )}
          </section>

          <section className="owner-stats__card" aria-labelledby="owner-stats-split-title">
            <h2 id="owner-stats-split-title" className="owner-stats__heading">
              Тип заказа
            </h2>
            {fulfillmentTotal === 0 ? (
              <p className="owner-stats__empty">Нет заказов, чтобы показать доли.</p>
            ) : (
              <div data-testid="owner-stats-fulfillment">
                <div className="owner-stats__split" aria-hidden>
                  {FULFILLMENT_META.map((item) =>
                    stats.fulfillment[item.key] > 0 ? (
                      <span
                        key={item.key}
                        className={`owner-stats__split-seg ${item.swatch}`}
                        style={{ flexGrow: stats.fulfillment[item.key] }}
                      />
                    ) : null,
                  )}
                </div>
                <ul className="owner-stats__legend">
                  {FULFILLMENT_META.map((item) => {
                    const count = stats.fulfillment[item.key];
                    const share = Math.round((count / fulfillmentTotal) * 100);
                    return (
                      <li key={item.key} className="owner-stats__legend-item">
                        <i className={`owner-stats__dot ${item.swatch}`} aria-hidden />
                        <span className="owner-stats__legend-label">{item.label}</span>
                        <span className="owner-stats__legend-count">{count}</span>
                        <span className="owner-stats__legend-share">{share}%</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </section>
        </div>
      </div>
    </Stack>
  );
}

function KpiCard({
  label,
  testId,
  value,
  kpi,
  hint,
}: {
  label: string;
  testId: string;
  value: ReactNode;
  kpi: OwnerStats['kpis']['revenue'];
  hint: string;
}) {
  const tone = deltaTone(kpi.deltaPercent);
  return (
    <article className="owner-stats__kpi">
      <div className="owner-stats__kpi-main">
        <span className="owner-stats__label">{label}</span>
        <div data-testid={testId}>{value}</div>
      </div>
      <p className={`owner-stats__delta owner-stats__delta--${tone}`}>
        <span className="owner-stats__delta-value">{formatSignedPercent(kpi.deltaPercent)}</span>
        <span className="owner-stats__delta-hint">{hint}</span>
      </p>
    </article>
  );
}

function OwnerStatsSkeleton() {
  return (
    <div data-testid="owner-stats-loading" aria-hidden>
      <Stack gap={4}>
        <div className="owner-stats__kpis">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} variant="rect" height={112} radius="var(--radius-lg)" />
          ))}
        </div>
        <div className="owner-stats__panels">
          <Skeleton variant="rect" height={240} radius="var(--radius-lg)" />
          <Stack gap={3}>
            <Skeleton variant="rect" height={160} radius="var(--radius-lg)" />
            <Skeleton variant="rect" height={140} radius="var(--radius-lg)" />
          </Stack>
        </div>
      </Stack>
    </div>
  );
}

export default function OwnerDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const restaurantId = user?.restaurantId;
  const [period, setPeriod] = useState<StatsPeriod>('today');
  const [load, setLoad] = useState<LoadState>({ status: 'loading' });
  const [styling, setStyling] = useState<RestaurantStyling>(() => ({
    restaurantId: restaurantId ?? '',
    ...DEFAULT_RESTAURANT_STYLING,
    updatedAt: '',
  }));

  const pullStats = useCallback(async (): Promise<LoadState> => {
    if (!restaurantId || !accessToken) {
      return { status: 'error', message: 'Сессия истекла. Войдите снова.' };
    }
    try {
      const today = minskCalendarDate();
      const sources = await fetchOwnerStatsSources(restaurantId, accessToken, today);
      return { status: 'ready', orders: sources.orders, bookings: sources.bookings, today };
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Не удалось загрузить статистику.';
      return { status: 'error', message };
    }
  }, [accessToken, restaurantId]);

  useEffect(() => {
    let cancelled = false;
    void pullStats().then((next) => {
      if (!cancelled) {
        setLoad(next);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [pullStats]);

  async function retry() {
    setLoad({ status: 'loading' });
    setLoad(await pullStats());
  }

  useEffect(() => {
    if (!restaurantId) {
      return;
    }
    let cancelled = false;
    void fetchRestaurantStyling(restaurantId)
      .then((next) => {
        if (!cancelled) {
          setStyling(next);
        }
      })
      .catch(() => {
        // Тема заведения не блокирует цифры: остаётся classic.
      });
    return () => {
      cancelled = true;
    };
  }, [restaurantId]);

  const stats =
    load.status === 'ready'
      ? computeOwnerStats({
          orders: load.orders,
          bookings: load.bookings,
          today: load.today,
          period,
        })
      : null;

  return (
    <RestaurantStylingShell styling={styling} enableScrollToTop={false} className="owner-stats-shell">
      <section className="owner-stats" data-testid="owner-dashboard" aria-busy={load.status === 'loading'}>
        <Stack gap={4}>
          <PageTitle
            title="Статистика"
            subtitle="Выручка, заказы и брони. Отменённые не входят в суммы."
            testId="owner-stats-heading"
          />
          <SegmentedControl
            ariaLabel="Период статистики"
            options={PERIOD_OPTIONS}
            value={period}
            onChange={setPeriod}
            fullWidth={false}
            className="owner-stats__period"
            testId="owner-stats-period"
          />
          {load.status === 'loading' ? <OwnerStatsSkeleton /> : null}
          {load.status === 'error' ? (
            <div className="owner-stats__card" data-testid="owner-stats-error" role="alert">
              <p className="owner-stats__empty">{load.message}</p>
              <Button variant="secondary" onClick={() => void retry()} testId="owner-stats-retry">
                Повторить
              </Button>
            </div>
          ) : null}
          {stats ? <OwnerStatsBody stats={stats} /> : null}
        </Stack>
      </section>
    </RestaurantStylingShell>
  );
}

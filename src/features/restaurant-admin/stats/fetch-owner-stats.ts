import { fetchRestaurantBookings } from '../api/bookings.api';
import { fetchRestaurantOrders } from '../api/orders.api';
import type { Booking } from '@/shared/types/booking';
import type { OrderDto } from '@/shared/types/pre-order';
import { addCalendarDays, orderCalendarDay } from './owner-stats';

/**
 * Модуль analytics бэкенда отдаёт только визиты и только super-admin.
 * Выручка, заказы и брони считаются из staff-эндпоинтов предзаказов и броней.
 * Список заказов идёт от новых к старым, поэтому листаем страницы, пока не
 * выйдем за окно сравнения (60 календарных дней).
 */
export async function fetchOrdersSince(
  restaurantId: string,
  token: string,
  sinceDay: string,
): Promise<OrderDto[]> {
  const collected: OrderDto[] = [];
  let page = 1;

  while (page <= 40) {
    const response = await fetchRestaurantOrders(restaurantId, token, { page, limit: 100 });
    collected.push(...response.items);
    if (response.items.length === 0 || collected.length >= response.total) {
      break;
    }
    const oldest = response.items[response.items.length - 1];
    const oldestDay = oldest ? orderCalendarDay(oldest.createdAt) : null;
    if (oldestDay && oldestDay < sinceDay) {
      break;
    }
    page += 1;
  }

  return collected.filter((order) => {
    const day = orderCalendarDay(order.createdAt);
    return day != null && day >= sinceDay;
  });
}

export async function fetchOwnerStatsSources(
  restaurantId: string,
  token: string,
  today: string,
): Promise<{ orders: OrderDto[]; bookings: Booking[] }> {
  const since = addCalendarDays(today, -59);
  const [orders, bookings] = await Promise.all([
    fetchOrdersSince(restaurantId, token, since),
    fetchRestaurantBookings(restaurantId, token),
  ]);
  return { orders, bookings };
}

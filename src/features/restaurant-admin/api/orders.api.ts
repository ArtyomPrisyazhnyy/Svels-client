import { apiRequest } from '@/shared/api/api-client';
import type { OrderDto } from '@/shared/types/pre-order';
import type {
  RestaurantOrdersListParams,
  RestaurantOrdersListResponse,
  UpdateOrderStatusPayload,
} from '@/shared/types/order-admin';

function buildOrdersQuery(params: RestaurantOrdersListParams = {}): string {
  const search = new URLSearchParams();
  if (params.status) {
    search.set('status', params.status);
  }
  if (params.date) {
    search.set('date', params.date);
  }
  if (params.updatedSince) {
    search.set('updatedSince', params.updatedSince);
  }
  if (params.page != null) {
    search.set('page', String(params.page));
  }
  if (params.limit != null) {
    search.set('limit', String(params.limit));
  }
  const query = search.toString();
  return query ? `?${query}` : '';
}

export function fetchRestaurantOrders(
  restaurantId: string,
  token: string,
  params?: RestaurantOrdersListParams,
): Promise<RestaurantOrdersListResponse> {
  return apiRequest<RestaurantOrdersListResponse>(
    `/restaurants/${restaurantId}/pre-orders${buildOrdersQuery(params)}`,
    { method: 'GET', token },
  );
}

export function fetchRestaurantOrder(
  restaurantId: string,
  orderId: string,
  token: string,
): Promise<OrderDto> {
  return apiRequest<OrderDto>(`/restaurants/${restaurantId}/pre-orders/${orderId}`, {
    method: 'GET',
    token,
  });
}

export function updateOrderStatus(
  restaurantId: string,
  orderId: string,
  token: string,
  payload: UpdateOrderStatusPayload,
): Promise<OrderDto> {
  return apiRequest<OrderDto>(`/restaurants/${restaurantId}/pre-orders/${orderId}/status`, {
    method: 'PATCH',
    token,
    body: JSON.stringify(payload),
  });
}

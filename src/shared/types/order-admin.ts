import type { OrderDto, PreOrderStatus } from './pre-order';

export interface RestaurantOrdersListParams {
  status?: string;
  date?: string;
  updatedSince?: string;
  page?: number;
  limit?: number;
}

export interface RestaurantOrdersListResponse {
  items: OrderDto[];
  total: number;
  page: number;
  limit: number;
  serverTime: string;
}

export interface UpdateOrderStatusPayload {
  status: PreOrderStatus;
  cancelReason?: string;
}

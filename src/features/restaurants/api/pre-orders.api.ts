import { apiRequest } from '@/shared/api/api-client';
import type {
  CreatePreOrderPayload,
  OrderDto,
  PaymentInfo,
  PreOrderResponse,
} from '@/shared/types/pre-order';

export function createPreOrder(
  restaurantId: string,
  token: string,
  payload: CreatePreOrderPayload,
): Promise<PreOrderResponse> {
  return apiRequest<PreOrderResponse>(`/restaurants/${restaurantId}/pre-orders`, {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  });
}

export function fetchMyOrders(token: string): Promise<OrderDto[]> {
  return apiRequest<OrderDto[]>('/users/me/pre-orders', {
    method: 'GET',
    token,
  });
}

export function fetchMyOrder(token: string, orderId: string): Promise<OrderDto> {
  return apiRequest<OrderDto>(`/users/me/pre-orders/${orderId}`, {
    method: 'GET',
    token,
  });
}

export function syncPayment(paymentId: string, token: string): Promise<PaymentInfo> {
  return apiRequest<PaymentInfo>(`/payments/${paymentId}/sync`, {
    method: 'POST',
    token,
  });
}

export function fetchPayment(paymentId: string, token: string): Promise<PaymentInfo> {
  return apiRequest<PaymentInfo>(`/payments/${paymentId}`, {
    method: 'GET',
    token,
  });
}

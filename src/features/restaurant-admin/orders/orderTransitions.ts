import type { PreOrderStatus } from '@/shared/types/pre-order';
import type { UserRole } from '@/shared/types/auth';

export interface OrderAction {
  status: PreOrderStatus;
  label: string;
  variant: 'primary' | 'secondary';
}

export function canShowCancelButton(role: UserRole | undefined): boolean {
  return role !== 'restaurant_production';
}

export function getOrderActions(
  currentStatus: PreOrderStatus,
  role: UserRole | undefined,
): OrderAction[] {
  const isProduction = role === 'restaurant_production';

  switch (currentStatus) {
    case 'new':
      if (isProduction) {
        return [];
      }
      return [{ status: 'accepted', label: 'Принять', variant: 'primary' }];
    case 'accepted':
      if (isProduction) {
        return [
          { status: 'preparing', label: 'Готовится', variant: 'secondary' },
          { status: 'ready', label: 'Готов', variant: 'primary' },
        ];
      }
      return [
        { status: 'preparing', label: 'Готовится', variant: 'secondary' },
        { status: 'ready', label: 'Готов', variant: 'primary' },
      ];
    case 'preparing':
      if (isProduction) {
        return [{ status: 'ready', label: 'Готов', variant: 'primary' }];
      }
      return [{ status: 'ready', label: 'Готов', variant: 'primary' }];
    case 'ready':
      if (isProduction) {
        return [];
      }
      return [{ status: 'completed', label: 'Завершить', variant: 'primary' }];
    default:
      return [];
  }
}

'use client';

import type { PreOrderStatus } from '@/shared/types/pre-order';
import { PRE_ORDER_STATUS_LABELS } from '../utils/guest-order.util';
import '../styles/guest-order-status-badge.scss';

interface GuestOrderStatusBadgeProps {
  status: PreOrderStatus;
}

const STATUS_CLASS: Record<PreOrderStatus, string> = {
  new: 'guest-order-status-badge--new',
  accepted: 'guest-order-status-badge--accepted',
  preparing: 'guest-order-status-badge--preparing',
  ready: 'guest-order-status-badge--ready',
  completed: 'guest-order-status-badge--completed',
  cancelled: 'guest-order-status-badge--cancelled',
};

export function GuestOrderStatusBadge({ status }: GuestOrderStatusBadgeProps) {
  return (
    <span
      className={`guest-order-status-badge ${STATUS_CLASS[status]}`}
      data-testid={`order-status-${status}`}
    >
      {PRE_ORDER_STATUS_LABELS[status]}
    </span>
  );
}

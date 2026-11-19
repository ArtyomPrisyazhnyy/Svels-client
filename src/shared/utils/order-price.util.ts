import type { CartLineItem } from '@/shared/types/cart';
import type {
  CartGiftReward,
  CartLoyaltyDiscount,
  CreatePreOrderItemPayload,
  OrderDto,
} from '@/shared/types/pre-order';

export function moneyEquals(left: number, right: number): boolean {
  return Math.round(left * 100) === Math.round(right * 100);
}

export function formatLoyaltyRate(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  if (Number.isInteger(rounded)) {
    return String(rounded);
  }
  return rounded.toFixed(2);
}

export function loyaltyDiscountLabel(discount: {
  levelName: string | null | undefined;
  rewardType?: CartLoyaltyDiscount['rewardType'] | null;
  percentOff?: number | null;
  amountOff?: number | null;
}): string {
  const level = discount.levelName?.trim() || 'огонька';
  const base = `Скидка уровня «${level}»`;
  if (discount.rewardType === 'percent_discount' && discount.percentOff != null) {
    return `${base} −${formatLoyaltyRate(discount.percentOff)}%`;
  }
  if (discount.rewardType === 'fixed_discount' && discount.amountOff != null) {
    return `${base} −${formatLoyaltyRate(discount.amountOff)} р`;
  }
  return base;
}

export function toQuoteItems(items: CartLineItem[]): CreatePreOrderItemPayload[] {
  return items.map((line) => {
    const hasModifiers = Object.values(line.modifierSelections).some((ids) => ids.length > 0);
    return {
      menuItemId: line.menuItemId,
      quantity: line.quantity,
      ...(hasModifiers ? { modifierSelections: line.modifierSelections } : {}),
    };
  });
}

export interface OrderPriceBreakdown {
  subtotal: number;
  discountAmount: number;
  discountLabel: string | null;
  gifts: CartGiftReward[];
}

/** Пусто, если скидки и подарков нет или ответ ещё без этих полей. */
export function readOrderPriceBreakdown(order: OrderDto): OrderPriceBreakdown | null {
  const hasSnapshot =
    order.subtotalAmount != null ||
    order.loyaltyDiscountAmount != null ||
    order.loyaltyDiscount != null ||
    order.giftRewards != null;
  if (!hasSnapshot) {
    return null;
  }

  const gifts = order.giftRewards ?? [];
  const discountAmount = order.loyaltyDiscountAmount ?? order.loyaltyDiscount?.amount ?? 0;
  if (discountAmount <= 0 && gifts.length === 0) {
    return null;
  }

  const discount = order.loyaltyDiscount;
  return {
    subtotal: order.subtotalAmount ?? order.totalAmount,
    discountAmount,
    discountLabel:
      discountAmount > 0
        ? loyaltyDiscountLabel({
            levelName: discount?.levelName ?? order.loyaltyLevelName,
            rewardType: discount?.rewardType,
            percentOff: discount?.percentOff,
            amountOff: discount?.amountOff,
          })
        : null,
    gifts,
  };
}

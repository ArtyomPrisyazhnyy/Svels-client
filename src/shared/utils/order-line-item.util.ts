import type { OrderItemDto, OrderItemModifierDto } from '@/shared/types/pre-order';

/** Selected option labels for display under the item name (one entry per modifier group). */
export function getOrderLineOptionLabels(modifiers: OrderItemModifierDto[]): string[] {
  return modifiers
    .map((modifier) => modifier.optionName.trim())
    .filter((label) => label.length > 0);
}

export function orderLineHasOptions(item: OrderItemDto): boolean {
  return getOrderLineOptionLabels(item.modifiers).length > 0;
}

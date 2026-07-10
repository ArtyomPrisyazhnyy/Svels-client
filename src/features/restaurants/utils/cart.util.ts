import type { CartLineItem, CartModifierLine } from '@/shared/types/cart';
import type { MenuItem, MenuModifierGroup } from '@/shared/types/menu';
import { generateUuidV7 } from '@/shared/utils/uuid.util';
import {
  calculateModifierUnitPrice,
  getModifierGroupKey,
  getModifierOptionKey,
  type ModifierSelections,
} from './menu-modifiers.util';

function buildModifierLines(
  groups: MenuModifierGroup[],
  selections: ModifierSelections,
): CartModifierLine[] {
  const lines: CartModifierLine[] = [];

  groups.forEach((group, groupIndex) => {
    const groupKey = getModifierGroupKey(group, groupIndex);
    const selectedKeys = selections[groupKey] ?? [];

    group.options.forEach((option, optionIndex) => {
      const optionKey = getModifierOptionKey(option, optionIndex);
      if (!selectedKeys.includes(optionKey)) {
        return;
      }

      lines.push({
        groupName: group.name,
        optionName: option.name,
        priceDelta: Number(option.priceDelta) || 0,
      });
    });
  });

  return lines;
}

export function buildCartLineKey(menuItemId: string, selections: ModifierSelections): string {
  const normalizedEntries = Object.entries(selections)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([groupKey, optionKeys]) => [groupKey, [...optionKeys].sort()] as const);

  return `${menuItemId}:${JSON.stringify(normalizedEntries)}`;
}

export function buildCartLineItem(
  item: MenuItem,
  quantity: number,
  modifierGroups: MenuModifierGroup[],
  modifierSelections: ModifierSelections,
): CartLineItem {
  const modifiers = buildModifierLines(modifierGroups, modifierSelections);
  const lineKey = buildCartLineKey(item.id, modifierSelections);

  return {
    id: generateUuidV7(),
    lineKey,
    menuItemId: item.id,
    name: item.name,
    variantLabel: item.variantLabel,
    imageUrl: item.imageUrl,
    quantity,
    unitPrice: calculateModifierUnitPrice(item.price, modifierGroups, modifierSelections),
    modifiers,
    modifierSelections,
  };
}

export function getCartTotals(items: CartLineItem[]): { itemCount: number; totalAmount: number } {
  const itemCount = items.reduce((sum, line) => sum + line.quantity, 0);
  const totalAmount = items.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);

  return { itemCount, totalAmount };
}

import type { MenuModifierGroup, MenuModifierOption } from '@/shared/types/menu';

export type ModifierSelections = Record<string, string[]>;

export function getModifierGroupKey(group: MenuModifierGroup, groupIndex: number): string {
  return group.id ?? `group-${groupIndex}`;
}

export function getModifierOptionKey(option: MenuModifierOption, optionIndex: number): string {
  return option.id ?? `option-${optionIndex}`;
}

export function getValidModifierGroups(groups: MenuModifierGroup[]): MenuModifierGroup[] {
  return groups
    .map((group) => ({
      ...group,
      options: group.options.filter((option) => option.name.trim().length > 0),
    }))
    .filter((group) => group.options.length > 0);
}

export function createEmptyModifierSelections(groups: MenuModifierGroup[]): ModifierSelections {
  const selections: ModifierSelections = {};

  groups.forEach((group, groupIndex) => {
    const groupKey = getModifierGroupKey(group, groupIndex);

    // Для обязательной группы с одиночным выбором предвыбираем первый вариант,
    // чтобы пользователь сразу видел корректную цену и мог добавить товар без
    // лишнего клика.
    if (group.required && group.selectionType === 'single' && group.options.length > 0) {
      selections[groupKey] = [getModifierOptionKey(group.options[0], 0)];
      return;
    }

    selections[groupKey] = [];
  });

  return selections;
}

export function calculateModifierUnitPrice(
  basePrice: number | string,
  groups: MenuModifierGroup[],
  selections: ModifierSelections,
): number {
  let total = Number(basePrice) || 0;

  groups.forEach((group, groupIndex) => {
    const groupKey = getModifierGroupKey(group, groupIndex);
    const selectedKeys = selections[groupKey] ?? [];

    group.options.forEach((option, optionIndex) => {
      const optionKey = getModifierOptionKey(option, optionIndex);
      if (selectedKeys.includes(optionKey)) {
        total += Number(option.priceDelta) || 0;
      }
    });
  });

  return total;
}

export function hasPriceAffectingModifiers(groups: MenuModifierGroup[] | undefined): boolean {
  return getValidModifierGroups(groups ?? []).some((group) =>
    group.options.some((option) => (Number(option.priceDelta) || 0) !== 0),
  );
}

export function isModifierSelectionComplete(
  groups: MenuModifierGroup[],
  selections: ModifierSelections,
): boolean {
  return groups.every((group, groupIndex) => {
    if (group.selectionType !== 'single' || !group.required) {
      return true;
    }

    const groupKey = getModifierGroupKey(group, groupIndex);
    return (selections[groupKey]?.length ?? 0) > 0;
  });
}

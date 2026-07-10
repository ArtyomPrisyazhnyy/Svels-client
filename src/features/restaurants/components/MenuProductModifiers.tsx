'use client';

import { PriceDelta } from '@/shared/components/CurrencyAmount';
import type { MenuModifierGroup } from '@/shared/types/menu';
import {
  getModifierGroupKey,
  getModifierOptionKey,
  type ModifierSelections,
} from '../utils/menu-modifiers.util';
import '../styles/menu-product-modifiers.scss';

interface MenuProductModifiersProps {
  groups: MenuModifierGroup[];
  selections: ModifierSelections;
  onChange: (selections: ModifierSelections) => void;
}

export function MenuProductModifiers({ groups, selections, onChange }: MenuProductModifiersProps) {
  function toggleSingle(groupIndex: number, group: MenuModifierGroup, optionKey: string) {
    const groupKey = getModifierGroupKey(group, groupIndex);
    const current = selections[groupKey] ?? [];
    const isSelected = current.includes(optionKey);

    if (isSelected) {
      if (group.required) {
        return;
      }

      onChange({ ...selections, [groupKey]: [] });
      return;
    }

    onChange({ ...selections, [groupKey]: [optionKey] });
  }

  function toggleMultiple(groupIndex: number, optionKey: string) {
    const groupKey = getModifierGroupKey(groups[groupIndex], groupIndex);
    const current = selections[groupKey] ?? [];
    const isSelected = current.includes(optionKey);

    onChange({
      ...selections,
      [groupKey]: isSelected
        ? current.filter((key) => key !== optionKey)
        : [...current, optionKey],
    });
  }

  function handleOptionClick(
    groupIndex: number,
    group: MenuModifierGroup,
    optionKey: string,
  ) {
    if (group.selectionType === 'single') {
      toggleSingle(groupIndex, group, optionKey);
      return;
    }

    toggleMultiple(groupIndex, optionKey);
  }

  return (
    <div className="menu-product-modifiers">
      {groups.map((group, groupIndex) => {
        const groupKey = getModifierGroupKey(group, groupIndex);
        const selectedKeys = selections[groupKey] ?? [];

        return (
          <div key={groupKey} className="menu-product-modal__section menu-product-modifiers__group">
            <h3 className="menu-product-modal__section-title menu-product-modifiers__title">
              {group.name}
              {group.selectionType === 'single' && group.required && (
                <span className="menu-product-modifiers__required">обязательно</span>
              )}
            </h3>

            <div className="menu-product-modifiers__options" role="list">
              {group.options.map((option, optionIndex) => {
                const optionKey = getModifierOptionKey(option, optionIndex);
                const isSelected = selectedKeys.includes(optionKey);
                const isSingle = group.selectionType === 'single';

                return (
                  <button
                    key={optionKey}
                    type="button"
                    role={isSingle ? 'radio' : 'checkbox'}
                    aria-checked={isSelected}
                    className={`menu-product-modifiers__option${
                      isSelected ? ' menu-product-modifiers__option--selected' : ''
                    }`}
                    onClick={() => handleOptionClick(groupIndex, group, optionKey)}
                  >
                    <span className="menu-product-modifiers__option-label">
                      {option.name}
                      <PriceDelta delta={Number(option.priceDelta) || 0} />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

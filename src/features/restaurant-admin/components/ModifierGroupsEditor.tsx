import { PriceDelta } from '../../../shared/components/CurrencyAmount';
import type { MenuModifierGroup } from '../../../shared/types/menu';
import { generateUuidV7 } from '../../../shared/utils/uuid.util';
import '../styles/modifier-groups-editor.scss';

interface ModifierGroupsEditorProps {
  groups: MenuModifierGroup[];
  onChange: (groups: MenuModifierGroup[]) => void;
}

function createOption() {
  return { id: generateUuidV7(), name: '', priceDelta: 0 };
}

function createGroup(type: MenuModifierGroup['selectionType']): MenuModifierGroup {
  return {
    id: generateUuidV7(),
    name: '',
    selectionType: type,
    required: type === 'single',
    options: [createOption()],
  };
}

export function ModifierGroupsEditor({ groups, onChange }: ModifierGroupsEditorProps) {
  function updateGroup(index: number, patch: Partial<MenuModifierGroup>) {
    onChange(groups.map((group, i) => (i === index ? { ...group, ...patch } : group)));
  }

  function removeGroup(index: number) {
    onChange(groups.filter((_, i) => i !== index));
  }

  function updateOption(groupIndex: number, optionIndex: number, patch: { name?: string; priceDelta?: number }) {
    const group = groups[groupIndex];
    const options = group.options.map((option, i) =>
      i === optionIndex ? { ...option, ...patch } : option,
    );
    updateGroup(groupIndex, { options });
  }

  function addOption(groupIndex: number) {
    const group = groups[groupIndex];
    updateGroup(groupIndex, { options: [...group.options, createOption()] });
  }

  function removeOption(groupIndex: number, optionIndex: number) {
    const group = groups[groupIndex];
    if (group.options.length <= 1) return;
    updateGroup(groupIndex, {
      options: group.options.filter((_, i) => i !== optionIndex),
    });
  }

  return (
    <div className="modifiers">
      <div className="modifiers__header">
        <h3>Модификации</h3>
        <div className="modifiers__add-buttons">
          <button type="button" onClick={() => onChange([...groups, createGroup('single')])}>
            + Один из (объём, сок…)
          </button>
          <button type="button" onClick={() => onChange([...groups, createGroup('multiple')])}>
            + Несколько (добавки)
          </button>
        </div>
      </div>

      {groups.length === 0 && (
        <p className="modifiers__empty">Модификации необязательны. Добавьте группу, если нужно.</p>
      )}

      {groups.map((group, groupIndex) => (
        <div key={group.id ?? groupIndex} className="modifiers__group">
          <div className="modifiers__group-head">
            <input
              type="text"
              placeholder="Название группы (например: Объём)"
              value={group.name}
              onChange={(e) => updateGroup(groupIndex, { name: e.target.value })}
            />
            <span className="modifiers__type-badge">
              {group.selectionType === 'single' ? 'Один вариант' : 'Несколько'}
            </span>
            <button type="button" className="modifiers__remove" onClick={() => removeGroup(groupIndex)}>
              Удалить группу
            </button>
          </div>

          {group.selectionType === 'single' && (
            <label className="modifiers__required">
              <input
                type="checkbox"
                checked={group.required}
                onChange={(e) => updateGroup(groupIndex, { required: e.target.checked })}
              />
              Обязательный выбор
            </label>
          )}

          <div className="modifiers__options">
            {group.options.map((option, optionIndex) => (
              <div key={option.id ?? optionIndex} className="modifiers__option">
                <input
                  type="text"
                  placeholder="Название варианта"
                  value={option.name}
                  onChange={(e) => updateOption(groupIndex, optionIndex, { name: e.target.value })}
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Δ цены"
                  title="Изменение цены. 0 — без доплаты"
                  value={option.priceDelta || ''}
                  onChange={(e) =>
                    updateOption(groupIndex, optionIndex, {
                      priceDelta: e.target.value === '' ? 0 : Number(e.target.value),
                    })
                  }
                />
                <span className="modifiers__preview">
                  {option.name}
                  <PriceDelta delta={option.priceDelta} />
                </span>
                <button
                  type="button"
                  className="modifiers__remove"
                  onClick={() => removeOption(groupIndex, optionIndex)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <button type="button" className="modifiers__add-option" onClick={() => addOption(groupIndex)}>
            + Вариант
          </button>
        </div>
      ))}
    </div>
  );
}

import type { MenuItemNutrition } from '../../../shared/types/menu';
import '../styles/nutrition-badges.scss';

interface NutritionBadgesProps {
  nutrition: MenuItemNutrition;
}

const NUTRITION_ITEMS = [
  { key: 'calories' as const, label: 'Ккал', unit: 'ккал', mod: 'calories' },
  { key: 'protein' as const, label: 'Б', unit: 'г', mod: 'protein' },
  { key: 'fat' as const, label: 'Ж', unit: 'г', mod: 'fat' },
  { key: 'carbs' as const, label: 'У', unit: 'г', mod: 'carbs' },
];

export function NutritionBadges({ nutrition }: NutritionBadgesProps) {
  const items = NUTRITION_ITEMS.filter(({ key }) => nutrition[key] != null);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="nutrition-badges">
      {items.map(({ key, label, unit, mod }) => (
        <span key={key} className={`nutrition-badge nutrition-badge--${mod}`}>
          <span className="nutrition-badge__label">{label}</span>
          <span className="nutrition-badge__value">
            {nutrition[key]}
            <span className="nutrition-badge__unit">{unit}</span>
          </span>
        </span>
      ))}
    </div>
  );
}

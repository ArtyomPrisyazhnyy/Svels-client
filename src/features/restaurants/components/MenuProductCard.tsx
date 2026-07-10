import { CurrencyAmount } from '@/shared/components/CurrencyAmount';
import { resolveImageUrl, type MenuItem } from '@/shared/types/menu';
import { hasPriceAffectingModifiers } from '../utils/menu-modifiers.util';
import '../styles/menu-product-card.scss';

interface MenuProductCardProps {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
}

export function MenuProductCard({ item, onSelect }: MenuProductCardProps) {
  const showFromPrice = hasPriceAffectingModifiers(item.modifierGroups);

  return (
    <button type="button" className="menu-product-card" onClick={() => onSelect(item)}>
      <div className="menu-product-card__media">
        <img src={resolveImageUrl(item.imageUrl)} alt={item.name} loading="lazy" />
      </div>

      <div className="menu-product-card__body">
        <span className="menu-product-card__title">
          {item.name}
          {item.variantLabel && (
            <span className="menu-product-card__variant"> {item.variantLabel}</span>
          )}
        </span>

        {item.description && (
          <p className="menu-product-card__description">{item.description}</p>
        )}

        <p className="menu-product-card__price">
          {showFromPrice && <span className="menu-product-card__price-from">от </span>}
          <CurrencyAmount amount={item.price} />
        </p>
      </div>
    </button>
  );
}

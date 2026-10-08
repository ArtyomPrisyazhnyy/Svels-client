import { CurrencyAmount } from '@/shared/components/CurrencyAmount';
import './MenuItemPriceDisplay.scss';

interface MenuItemPriceDisplayProps {
  price: number;
  oldPrice?: number | null;
  /** Множитель (например количество в модалке). */
  quantity?: number;
  showFromPrefix?: boolean;
  fractionDigits?: number;
  className?: string;
  oldClassName?: string;
}

/**
 * Актуальная цена + опциональная перечёркнутая старая (скидка).
 * Старая показывается только если она задана и строго больше актуальной.
 */
export function MenuItemPriceDisplay({
  price,
  oldPrice,
  quantity = 1,
  showFromPrefix = false,
  fractionDigits = 0,
  className,
  oldClassName = 'menu-item-price__old',
}: MenuItemPriceDisplayProps) {
  const current = Number(price) * quantity;
  const previous = oldPrice != null ? Number(oldPrice) * quantity : null;
  const showOld = previous !== null && previous > current;

  return (
    <span className={className ? `menu-item-price ${className}` : 'menu-item-price'}>
      {showOld && (
        <CurrencyAmount
          amount={previous}
          fractionDigits={fractionDigits}
          className={oldClassName}
        />
      )}
      {showFromPrefix && <span className="menu-item-price__from">от </span>}
      <CurrencyAmount amount={current} fractionDigits={fractionDigits} />
    </span>
  );
}

import { Button } from '@/shared/ui/Button/Button';
import '@/features/restaurants/styles/venue-not-found.scss';

export default function RestaurantNotFound() {
  return (
    <div className="venue-not-found" data-testid="restaurant-not-found">
      <div className="venue-not-found__inner">
        <h1 className="venue-not-found__title">Заведение не найдено</h1>
        <p className="venue-not-found__text">
          Возможно, страница была удалена или заведение ещё не одобрено.
        </p>
        <Button href="/" variant="primary" testId="restaurant-not-found-home">
          На главную
        </Button>
      </div>
    </div>
  );
}

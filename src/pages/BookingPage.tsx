import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import './placeholder.scss';

export function BookingPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="placeholder-page">
      <header className="placeholder-page__header">
        <Link to="/" className="placeholder-page__back">
          ← На главную
        </Link>
        <h1>Бронирование стола</h1>
      </header>
      <main className="placeholder-page__main">
        <p>
          Здравствуйте, {user?.firstName}! Раздел бронирования в разработке — выбор ресторана,
          даты, времени и стола появится в следующих версиях.
        </p>
      </main>
    </div>
  );
}

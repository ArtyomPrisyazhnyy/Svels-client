import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import './placeholder.scss';

export function PreOrderPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="placeholder-page">
      <header className="placeholder-page__header">
        <Link to="/" className="placeholder-page__back">
          ← На главную
        </Link>
        <h1>Предзаказ</h1>
      </header>
      <main className="placeholder-page__main">
        <p>
          Здравствуйте, {user?.firstName}! Раздел предзаказа в разработке — выбор блюд и оплата
          появятся в следующих версиях.
        </p>
      </main>
    </div>
  );
}

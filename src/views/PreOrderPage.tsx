'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';
import './placeholder.scss';

export function PreOrderPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="placeholder-page">
      <header className="glass-header glass-header--stacked placeholder-page__header">
        <Link href="/" className="glass-header__link glass-header__link--accent placeholder-page__back">
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

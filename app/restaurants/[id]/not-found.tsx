import Link from 'next/link';

export default function RestaurantNotFound() {
  return (
    <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', textAlign: 'center' }}>
      <div>
        <h1>Заведение не найдено</h1>
        <p style={{ color: '#64748b' }}>
          Возможно, страница была удалена или заведение ещё не одобрено.
        </p>
        <Link href="/" style={{ color: '#2563eb' }}>
          На главную
        </Link>
      </div>
    </div>
  );
}

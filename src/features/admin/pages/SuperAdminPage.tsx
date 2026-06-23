import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  fetchPendingRegistrations,
  reviewRegistration,
  type PendingRegistration,
} from '../api/admin.api';
import { ApiError } from '../../../shared/api/api-client';
import { useAuthStore } from '../../../store/auth.store';
import '../styles/admin.scss';

export default function SuperAdminPage() {
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const logout = useAuthStore((s) => s.logout);
  const [requests, setRequests] = useState<PendingRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const loadRequests = useCallback(async () => {
    if (!accessToken) return;

    setLoading(true);
    setError(null);

    try {
      const data = await fetchPendingRegistrations(accessToken);
      setRequests(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось загрузить заявки');
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    void loadRequests();
  }, [loadRequests]);

  async function handleReview(requestId: string, action: 'approve' | 'reject') {
    if (!accessToken) return;

    let rejectionReason: string | undefined;
    if (action === 'reject') {
      const reason = window.prompt('Причина отклонения (необязательно):');
      if (reason === null) return;
      rejectionReason = reason || undefined;
    }

    setProcessingId(requestId);
    setError(null);

    try {
      await reviewRegistration(accessToken, { requestId, action, rejectionReason });
      setRequests((prev) => prev.filter((item) => item.id !== requestId));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось обработать заявку');
    } finally {
      setProcessingId(null);
    }
  }

  return (
    <div className="admin">
      <header className="admin__header">
        <Link to="/" className="admin__back">
          ← На главную
        </Link>
        <h1>
          Svels
          <span className="admin__badge">Суперадмин</span>
        </h1>
        <button type="button" className="admin__logout" onClick={logout}>
          Выйти
        </button>
      </header>

      <main className="admin__main">
        <p className="admin__intro">
          Здравствуйте, {user?.firstName}. Рассматривайте заявки заведений на подключение к
          платформе.
        </p>

        {error && <p className="admin__error">{error}</p>}

        {loading ? (
          <p className="admin__empty">Загрузка заявок…</p>
        ) : requests.length === 0 ? (
          <p className="admin__empty">Нет заявок на модерации.</p>
        ) : (
          <div className="admin__list">
            {requests.map((request) => (
              <article key={request.id} className="admin__card">
                <h2 className="admin__card-title">{request.name}</h2>
                <p className="admin__meta">
                  УНП: {request.unp}
                  {request.isChain ? ' · Сеть' : ''}
                  <br />
                  Подано: {new Date(request.createdAt).toLocaleString('ru-RU')}
                </p>
                {request.description && (
                  <p className="admin__meta">{request.description}</p>
                )}
                <ul className="admin__locations">
                  {request.locations.map((loc, index) => (
                    <li key={`${request.id}-${index}`}>
                      {loc.label ? `${loc.label}: ` : ''}
                      {loc.address}
                    </li>
                  ))}
                </ul>
                <div className="admin__actions">
                  <button
                    type="button"
                    className="admin__btn admin__btn--approve"
                    disabled={processingId === request.id}
                    onClick={() => void handleReview(request.id, 'approve')}
                  >
                    Одобрить
                  </button>
                  <button
                    type="button"
                    className="admin__btn admin__btn--reject"
                    disabled={processingId === request.id}
                    onClick={() => void handleReview(request.id, 'reject')}
                  >
                    Отклонить
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

'use client';

interface InviteLinkCardProps {
  setPasswordUrl: string;
  expiresAt?: string;
  onClose?: () => void;
}

export function InviteLinkCard({ setPasswordUrl, expiresAt, onClose }: InviteLinkCardProps) {
  const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(setPasswordUrl)}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(setPasswordUrl);
    } catch {
      window.prompt('Скопируйте ссылку:', setPasswordUrl);
    }
  }

  return (
    <div className="admin__invite" data-testid="owner-invite-link-card">
      <p className="admin__invite-title">Ссылка для установки пароля владельца</p>
      {expiresAt && (
        <p className="admin__meta">
          Действует до: {new Date(expiresAt).toLocaleString('ru-RU')}
        </p>
      )}
      <input
        className="admin__invite-url"
        type="text"
        readOnly
        value={setPasswordUrl}
        data-testid="owner-set-password-url"
      />
      <div className="admin__invite-actions">
        <button
          type="button"
          className="admin__btn admin__btn--secondary"
          onClick={() => void handleCopy()}
          data-testid="owner-invite-copy"
        >
          Скопировать
        </button>
        <a
          className="admin__btn admin__btn--telegram"
          href={telegramShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="owner-invite-telegram"
        >
          Отправить в Telegram
        </a>
        {onClose && (
          <button type="button" className="admin__btn admin__btn--ghost" onClick={onClose}>
            Закрыть
          </button>
        )}
      </div>
    </div>
  );
}

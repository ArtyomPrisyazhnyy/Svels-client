'use client';

import { useCallback, useEffect, useState } from 'react';
import type { TelegramChatDto, TelegramLinkCodeResponse } from '@/shared/types/telegram';
import {
  createTelegramLinkCode,
  deleteTelegramChat,
  fetchTelegramChats,
} from '../api/telegram.api';
import { formatOrderApiError } from './orderErrors';

interface TelegramConnectPanelProps {
  restaurantId: string;
  token: string;
}

export function TelegramConnectPanel({ restaurantId, token }: TelegramConnectPanelProps) {
  const [chats, setChats] = useState<TelegramChatDto[]>([]);
  const [link, setLink] = useState<TelegramLinkCodeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadChats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setChats(await fetchTelegramChats(restaurantId, token));
    } catch (err) {
      setError(formatOrderApiError(err, 'Не удалось загрузить чаты Telegram'));
    } finally {
      setLoading(false);
    }
  }, [restaurantId, token]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      void loadChats();
    });
    return () => cancelAnimationFrame(frame);
  }, [loadChats]);

  async function handleCreateLink() {
    setBusy(true);
    setError(null);
    try {
      setLink(await createTelegramLinkCode(restaurantId, token));
    } catch (err) {
      setError(formatOrderApiError(err, 'Не удалось создать ссылку для Telegram'));
    } finally {
      setBusy(false);
    }
  }

  async function handleUnlink(chatRowId: string) {
    setBusy(true);
    setError(null);
    try {
      await deleteTelegramChat(restaurantId, chatRowId, token);
      setChats((prev) => prev.filter((c) => c.id !== chatRowId));
    } catch (err) {
      setError(formatOrderApiError(err, 'Не удалось отвязать чат'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="orders-admin__telegram" data-testid="orders-telegram-panel">
      <h3 className="orders-admin__telegram-title">Уведомления в Telegram</h3>
      <p className="orders-admin__telegram-intro">
        Подключите чат, чтобы получать новые заказы и принимать их из бота.
      </p>

      {error && <p className="orders-admin__error orders-admin__error--inline">{error}</p>}

      <div className="orders-admin__telegram-actions">
        <button
          type="button"
          className="orders-admin__btn orders-admin__btn--secondary"
          onClick={() => void handleCreateLink()}
          disabled={busy}
        >
          {link ? 'Новый код привязки' : 'Получить код привязки'}
        </button>
        {link && (
          <a
            href={link.deepLink}
            className="orders-admin__btn orders-admin__btn--primary"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="telegram-open-deep-link"
          >
            Открыть в Telegram
          </a>
        )}
      </div>
      {link && (
        <p className="orders-admin__telegram-meta">
          Код действует до {new Date(link.expiresAt).toLocaleString('ru-RU')}
        </p>
      )}

      {loading ? (
        <p className="orders-admin__empty">Загрузка чатов…</p>
      ) : chats.length === 0 ? (
        <p className="orders-admin__empty">Пока нет подключённых чатов.</p>
      ) : (
        <ul className="orders-admin__telegram-list">
          {chats.map((chat) => (
            <li key={chat.id} className="orders-admin__telegram-item">
              <span>{chat.title ?? `Чат ${chat.chatId}`}</span>
              <button
                type="button"
                className="orders-admin__btn orders-admin__btn--ghost orders-admin__btn--small"
                onClick={() => void handleUnlink(chat.id)}
                disabled={busy}
              >
                Отвязать
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

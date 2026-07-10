'use client';

import { useCallback, useEffect, useState, type FormEvent, type KeyboardEvent } from 'react';
import { ApiError } from '../../../shared/api/api-client';
import { SocialIcon, socialIconClassName } from '../../../shared/components/SocialIcon';
import {
  detectSocialPlatform,
  normalizeSocialUrlForSubmit,
} from '../../../shared/social/detect-social-platform';
import type { SocialLink } from '../../../shared/types/social-link';
import {
  getSocialLinkDisplayLabel,
  SOCIAL_PLATFORM_LABELS,
} from '../../../shared/types/social-link';
import { useAuthStore } from '../../../store/auth.store';
import {
  createSocialLink,
  deleteSocialLink,
  fetchSocialLinks,
  updateSocialLink,
} from '../api/social-links.api';
import { revalidateRestaurantPublicPage } from '@/features/restaurants/actions/revalidate-restaurant-public-page.action';
import '../styles/social-links-admin.scss';

const FORM_FIELD_IDS = ['social-link-label', 'social-link-url'];

function handleEnterNavigation(event: KeyboardEvent<HTMLFormElement>) {
  if (event.key !== 'Enter') {
    return;
  }

  const target = event.target;
  if (!(target instanceof HTMLInputElement) || target.type === 'submit') {
    return;
  }

  event.preventDefault();

  const index = FORM_FIELD_IDS.indexOf(target.id);
  if (index >= 0 && index < FORM_FIELD_IDS.length - 1) {
    document.getElementById(FORM_FIELD_IDS[index + 1])?.focus();
    return;
  }

  if (index === FORM_FIELD_IDS.length - 1) {
    event.currentTarget.querySelector<HTMLButtonElement>('.social-links-admin__submit')?.focus();
  }
}

export default function SocialLinksAdminPage() {
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const restaurantId = user?.restaurantId;

  const [links, setLinks] = useState<SocialLink[]>([]);
  const [label, setLabel] = useState('');
  const [url, setUrl] = useState('');
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const detectedPlatform = url.trim() ? detectSocialPlatform(url) : null;
  const labelPlaceholder = detectedPlatform
    ? `Например: наш ${SOCIAL_PLATFORM_LABELS[detectedPlatform]}`
    : 'Например: мы в Instagram';

  const loadLinks = useCallback(async () => {
    if (!restaurantId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchSocialLinks(restaurantId);
      setLinks(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось загрузить ссылки');
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);

  useEffect(() => {
    void loadLinks();
  }, [loadLinks]);

  function resetForm() {
    setLabel('');
    setUrl('');
    setEditingLink(null);
    setError(null);
  }

  function handleEdit(link: SocialLink) {
    setEditingLink(link);
    setLabel(link.label ?? '');
    setUrl(link.url);
    setError(null);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!restaurantId || !accessToken) return;

    const normalizedUrl = normalizeSocialUrlForSubmit(url);
    if (!normalizedUrl) {
      setError('Укажите корректную ссылку (например, https://t.me/your_channel)');
      return;
    }

    const trimmedLabel = label.trim();

    setSaving(true);
    setError(null);

    try {
      if (editingLink) {
        await updateSocialLink(restaurantId, accessToken, editingLink.id, {
          url: normalizedUrl,
          label: trimmedLabel || null,
        });
      } else {
        await createSocialLink(restaurantId, accessToken, {
          url: normalizedUrl,
          ...(trimmedLabel ? { label: trimmedLabel } : {}),
        });
      }

      resetForm();
      await loadLinks();
      await revalidateRestaurantPublicPage(restaurantId);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : editingLink
            ? 'Не удалось сохранить изменения'
            : 'Не удалось добавить ссылку',
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(linkId: string) {
    if (!restaurantId || !accessToken) return;
    if (!window.confirm('Удалить ссылку?')) return;

    setError(null);

    try {
      await deleteSocialLink(restaurantId, accessToken, linkId);
      if (editingLink?.id === linkId) {
        resetForm();
      }
      await loadLinks();
      await revalidateRestaurantPublicPage(restaurantId);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось удалить ссылку');
    }
  }

  if (!restaurantId) {
    return (
      <p className="social-links-admin__notice">
        Заявка ещё на модерации или ресторан не привязан к аккаунту.
      </p>
    );
  }

  return (
    <div className="social-links-admin">
      <section className="social-links-admin__panel">
        <h2>{editingLink ? 'Редактирование ссылки' : 'Добавить ссылку'}</h2>
        <p className="social-links-admin__hint">
          Укажите ссылку и подпись, которую увидят гости — например «наш Instagram» или просто
          «Telegram». Иконка подставится автоматически по адресу ссылки.
        </p>

        {error && <p className="social-links-admin__error">{error}</p>}

        <form
          className="social-links-admin__form"
          onSubmit={handleSubmit}
          onKeyDown={handleEnterNavigation}
        >
          <div className="social-links-admin__field">
            <label htmlFor="social-link-label">Подпись</label>
            <input
              id="social-link-label"
              type="text"
              maxLength={120}
              placeholder={labelPlaceholder}
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>

          <div className="social-links-admin__field">
            <label htmlFor="social-link-url">Ссылка *</label>
            <div className="social-links-admin__input-row">
              {detectedPlatform && (
                <span className={socialIconClassName(detectedPlatform)} aria-hidden="true">
                  <SocialIcon platform={detectedPlatform} />
                </span>
              )}
              <input
                id="social-link-url"
                type="url"
                inputMode="url"
                placeholder="https://t.me/your_channel"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>
          </div>

          {detectedPlatform && (
            <p className="social-links-admin__detected">
              Определено: {SOCIAL_PLATFORM_LABELS[detectedPlatform]}
              {!label.trim() && ` · подпись по умолчанию: ${SOCIAL_PLATFORM_LABELS[detectedPlatform]}`}
            </p>
          )}

          <div className="social-links-admin__actions">
            <button className="social-links-admin__submit" type="submit" disabled={saving}>
              {saving ? 'Сохранение…' : editingLink ? 'Сохранить' : 'Добавить'}
            </button>
            {editingLink && (
              <button
                className="social-links-admin__cancel"
                type="button"
                disabled={saving}
                onClick={resetForm}
              >
                Отмена
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="social-links-admin__list-panel">
        <h2>Ваши соцсети</h2>

        {loading ? (
          <p className="social-links-admin__empty">Загрузка…</p>
        ) : links.length === 0 ? (
          <p className="social-links-admin__empty">Пока нет добавленных ссылок.</p>
        ) : (
          <ul className="social-links-admin__list">
            {links.map((link) => (
              <li
                key={link.id}
                className={`social-links-admin__item${
                  editingLink?.id === link.id ? ' social-links-admin__item--editing' : ''
                }`}
              >
                <span className={socialIconClassName(link.platform)}>
                  <SocialIcon
                    platform={link.platform}
                    title={getSocialLinkDisplayLabel(link)}
                  />
                </span>
                <div className="social-links-admin__item-body">
                  <strong>{getSocialLinkDisplayLabel(link)}</strong>
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.url}
                  </a>
                </div>
                <div className="social-links-admin__item-actions">
                  <button type="button" onClick={() => handleEdit(link)}>
                    Изменить
                  </button>
                  <button
                    type="button"
                    className="social-links-admin__delete"
                    onClick={() => void handleDelete(link.id)}
                  >
                    Удалить
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

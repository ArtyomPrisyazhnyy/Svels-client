'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useModalPresence } from '@/hooks/useModalPresence';
import { ApiError } from '@/shared/api/api-client';
import { submitLead, type LeadPayload } from './landing-api';
import './contact-modal.scss';

const MODAL_ANIMATION_MS = 220;

type ContactMethod = 'telegram' | 'whatsapp' | 'viber';

const CONTACT_OPTIONS: { id: ContactMethod; label: string; hint: string }[] = [
  { id: 'telegram', label: 'Telegram', hint: 'Напишем в мессенджер' },
  { id: 'whatsapp', label: 'WhatsApp', hint: 'Сообщение в WhatsApp' },
  { id: 'viber', label: 'Viber', hint: 'Свяжемся через Viber' },
];

interface ContactModalProps {
  onClose: () => void;
}

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function ContactModal({ onClose }: ContactModalProps) {
  const { mounted, isActive, handleClose } = useModalPresence(onClose, MODAL_ANIMATION_MS);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [method, setMethod] = useState<ContactMethod>('telegram');
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && status !== 'submitting') {
        handleClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleClose, status]);

  if (!mounted) {
    return null;
  }

  const nameValid = name.trim().length >= 2;
  const phoneValid = /^\+?[0-9\s\-()]{7,20}$/.test(phone.trim());
  const formValid = nameValid && phoneValid && privacyAccepted;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formValid || status === 'submitting') return;

    const payload: LeadPayload = {
      name: name.trim(),
      phone: phone.trim(),
      contactTelegram: method === 'telegram',
      contactWhatsapp: method === 'whatsapp',
      contactViber: method === 'viber',
    };

    setStatus('submitting');
    setErrorMessage('');

    try {
      await submitLead(payload);
      setStatus('success');
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : 'Не удалось отправить заявку. Попробуйте позже.';
      setErrorMessage(message);
      setStatus('error');
    }
  };

  const requestClose = () => {
    if (status === 'submitting') return;
    handleClose();
  };

  const activeClass = isActive ? ' contact-modal--active' : '';

  return createPortal(
    <>
      <button
        type="button"
        aria-label="Закрыть"
        className={`contact-modal__backdrop${activeClass}`}
        onClick={requestClose}
        tabIndex={-1}
      />
      <div
        className={`contact-modal${activeClass}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
      >
        <div className={`contact-modal__panel${activeClass}`}>
          <button
            type="button"
            className="contact-modal__close"
            onClick={requestClose}
            aria-label="Закрыть"
            disabled={status === 'submitting'}
          >
            ×
          </button>

          {status === 'success' ? (
            <div className="contact-modal__success">
              <div className="contact-modal__success-icon" aria-hidden>
                ✓
              </div>
              <h2 id="contact-modal-title" className="contact-modal__title">
                Заявка отправлена
              </h2>
              <p className="contact-modal__subtitle">
                Мы свяжемся с вами в течение дня в выбранном мессенджере.
              </p>
              <button type="button" className="contact-modal__submit" onClick={requestClose}>
                Закрыть
              </button>
            </div>
          ) : (
            <>
              <header className="contact-modal__header">
                <h2 id="contact-modal-title" className="contact-modal__title">
                  Оставить заявку
                </h2>
                <p className="contact-modal__subtitle">
                  Заполните форму — и мы подберём решение под ваше заведение.
                </p>
              </header>

              <form className="contact-modal__form" onSubmit={handleSubmit} noValidate>
                <label className="contact-modal__field">
                  <span className="contact-modal__label">Ваше имя</span>
                  <input
                    type="text"
                    className="contact-modal__input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Как к вам обращаться"
                    autoComplete="name"
                    required
                    disabled={status === 'submitting'}
                  />
                </label>

                <label className="contact-modal__field">
                  <span className="contact-modal__label">Номер телефона</span>
                  <input
                    type="tel"
                    className="contact-modal__input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+375 29 000-00-00"
                    autoComplete="tel"
                    required
                    disabled={status === 'submitting'}
                  />
                </label>

                <div className="contact-modal__field contact-modal__field--radios">
                  <span className="contact-modal__label" id="contact-modal-method-label">
                    Как с вами связаться
                  </span>
                  <div
                    className="contact-modal__radios"
                    role="radiogroup"
                    aria-labelledby="contact-modal-method-label"
                  >
                    {CONTACT_OPTIONS.map((option) => {
                      const checked = method === option.id;
                      return (
                        <label
                          key={option.id}
                          className={`contact-modal__radio${checked ? ' contact-modal__radio--checked' : ''}`}
                        >
                          <input
                            type="radio"
                            className="contact-modal__radio-input"
                            name="contact-method"
                            value={option.id}
                            checked={checked}
                            onChange={() => setMethod(option.id)}
                            disabled={status === 'submitting'}
                          />
                          <span className="contact-modal__radio-control" aria-hidden="true">
                            <span className="contact-modal__radio-dot" />
                          </span>
                          <span className="contact-modal__radio-text">
                            <span className="contact-modal__radio-label">{option.label}</span>
                            <span className="contact-modal__radio-hint">{option.hint}</span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <label className="contact-modal__consent">
                  <input
                    type="checkbox"
                    className="contact-modal__consent-input"
                    checked={privacyAccepted}
                    onChange={(event) => setPrivacyAccepted(event.target.checked)}
                    disabled={status === 'submitting'}
                    data-testid="contact-modal-privacy-consent"
                  />
                  <span className="contact-modal__consent-box" aria-hidden="true" />
                  <span className="contact-modal__consent-text">
                    Я согласен с условиями{' '}
                    <Link className="contact-modal__consent-link" href="/privacypolicy" target="_blank">
                      политики конфиденциальности
                    </Link>
                  </span>
                </label>

                {status === 'error' && errorMessage && (
                  <p className="contact-modal__error" role="alert">
                    {errorMessage}
                  </p>
                )}

                <button
                  type="submit"
                  className="contact-modal__submit"
                  disabled={!formValid || status === 'submitting'}
                >
                  {status === 'submitting' ? 'Отправляем…' : 'Отправить заявку'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </>,
    document.body,
  );
}

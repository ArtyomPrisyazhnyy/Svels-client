'use client';

import { useState, type FormEvent } from 'react';
import { submitLead } from '@/views/landing-api';
import { ApiError } from '@/shared/api/api-client';
import { Button, Field, Input, SegmentedControl, Stack } from '@/shared/ui';
import { markAppRequested } from './launch-checklist';

type Channel = 'telegram' | 'whatsapp' | 'viber';

const PHONE_PATTERN = /^\+?[0-9\s\-()]{7,20}$/;

interface MobileAppRequestFormProps {
  restaurantId: string;
  restaurantName: string;
  ownerName: string;
  requested: boolean;
  onRequested: () => void;
}

export function MobileAppRequestForm({
  restaurantId,
  restaurantName,
  ownerName,
  requested,
  onRequested,
}: MobileAppRequestFormProps) {
  const [phone, setPhone] = useState('');
  const [channel, setChannel] = useState<Channel>('telegram');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(requested ? 'Запрос уже отправляли с этого браузера.' : null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const trimmed = phone.trim();
    if (!PHONE_PATTERN.test(trimmed)) {
      setError('Введите телефон с кодом страны, например +375 29 000-00-01. Можно пробелы и дефисы, от 7 до 20 символов.');
      return;
    }

    setSubmitting(true);
    try {
      await submitLead({
        name: ownerName.trim() || restaurantName,
        phone: trimmed,
        contactTelegram: channel === 'telegram',
        contactWhatsapp: channel === 'whatsapp',
        contactViber: channel === 'viber',
        note: `Запрос мобильного приложения для «${restaurantName}». Сайт: /restaurants/${restaurantId}`,
      });
      markAppRequested(restaurantId);
      onRequested();
      setSuccess('Заявка ушла. Приложение соберёт команда Svels и опубликует в App Store и Google Play. От вас ничего устанавливать не нужно.');
    } catch (err) {
      if (err instanceof ApiError && err.status === 503) {
        markAppRequested(restaurantId);
        onRequested();
        setSuccess(
          'Заявка записана, но сообщение команде Svels не отправилось. Если в течение дня не напишем — отправьте форму ещё раз.',
        );
        return;
      }
      setError(
        err instanceof ApiError
          ? err.message
          : 'Не удалось отправить запрос. Проверьте телефон и попробуйте ещё раз.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={(event) => void handleSubmit(event)} data-testid="app-request-form">
      <Stack gap={3}>
        <p className="launch-checklist__hint">
          Сайт можно открыть без приложения. Если нужно своё приложение в сторах, оставьте телефон — мы напишем в выбранный мессенджер.
        </p>
        <SegmentedControl
          ariaLabel="Как с вами связаться"
          value={channel}
          onChange={setChannel}
          options={[
            { value: 'telegram', label: 'Telegram' },
            { value: 'whatsapp', label: 'WhatsApp' },
            { value: 'viber', label: 'Viber' },
          ]}
          fullWidth
        />
        <Field
          label="Телефон"
          htmlFor="app-request-phone"
          required
          hint="Формат +375 29 000-00-01. Это номер для связи, его не увидят гости."
          error={error ?? undefined}
        >
          <Input
            id="app-request-phone"
            name="phone"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+375 29 000-00-01"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            testId="app-request-phone"
            required
          />
        </Field>
        {success ? <p className="launch-checklist__success">{success}</p> : null}
        <Button type="submit" loading={submitting} testId="app-request-submit">
          {requested ? 'Отправить ещё раз' : 'Запросить приложение'}
        </Button>
      </Stack>
    </form>
  );
}

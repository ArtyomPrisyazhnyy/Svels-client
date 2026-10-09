'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { revalidateRestaurantPublicPage } from '@/features/restaurants/actions/revalidate-restaurant-public-page.action';
import { ApiError } from '../../../shared/api/api-client';
import { PhoneInput } from '../../../shared/components/PhoneInput';
import { toPhoneApiValue, isCompleteBelarusPhone } from '../../../shared/utils/phone.util';
import { useAuthStore } from '../../../store/auth.store';
import { fetchRestaurantLegal, updateRestaurantLegal } from '../api/legal.api';
import '../styles/locations-admin.scss';

export default function LegalAdminPage() {
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const restaurantId = user?.restaurantId;

  const [legalName, setLegalName] = useState('');
  const [legalAddress, setLegalAddress] = useState('');
  const [unp, setUnp] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadLegal = useCallback(async () => {
    if (!restaurantId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchRestaurantLegal(restaurantId);
      setLegalName(data.legalName ?? '');
      setLegalAddress(data.legalAddress ?? '');
      setUnp(data.unp ?? '');
      setContactPhone(data.contactPhone ?? '');
      setContactEmail(data.contactEmail ?? '');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось загрузить реквизиты');
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch on mount
    void loadLegal();
  }, [loadLegal]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!restaurantId || !accessToken) {
      return;
    }

    if (contactPhone && !isCompleteBelarusPhone(contactPhone)) {
      setError('Укажите корректный контактный телефон или оставьте поле пустым');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await updateRestaurantLegal(restaurantId, accessToken, {
        legalName: legalName.trim() || null,
        legalAddress: legalAddress.trim() || null,
        unp: unp.trim() || null,
        contactPhone: contactPhone.trim() ? toPhoneApiValue(contactPhone) : null,
        contactEmail: contactEmail.trim() || null,
      });
      await revalidateRestaurantPublicPage(restaurantId);
      setSuccess('Реквизиты сохранены');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось сохранить реквизиты');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="locations-admin__hint">Загрузка…</p>;
  }

  return (
    <div className="locations-admin" data-testid="legal-admin-page">
      <h1 className="locations-admin__title">Реквизиты заведения</h1>
      <p className="locations-admin__hint">
        Данные отображаются гостям на странице «Реквизиты и условия» в подвале сайта заведения.
      </p>

      <form className="locations-admin__panel" onSubmit={handleSubmit}>
        {error && <p className="locations-admin__error">{error}</p>}
        {success && <p className="locations-admin__hint">{success}</p>}

        <div className="locations-admin__field">
          <label htmlFor="legal-name">Юридическое наименование</label>
          <input
            id="legal-name"
            type="text"
            value={legalName}
            onChange={(e) => setLegalName(e.target.value)}
            data-testid="legal-admin-legal-name"
          />
        </div>

        <div className="locations-admin__field">
          <label htmlFor="legal-address">Юридический адрес</label>
          <textarea
            id="legal-address"
            rows={3}
            value={legalAddress}
            onChange={(e) => setLegalAddress(e.target.value)}
            data-testid="legal-admin-legal-address"
          />
        </div>

        <div className="locations-admin__field">
          <label htmlFor="legal-unp">УНП</label>
          <input
            id="legal-unp"
            type="text"
            inputMode="numeric"
            value={unp}
            onChange={(e) => setUnp(e.target.value)}
            data-testid="legal-admin-unp"
          />
        </div>

        <div className="locations-admin__field">
          <label htmlFor="legal-phone">Контактный телефон</label>
          <PhoneInput
            id="legal-phone"
            value={contactPhone}
            onChange={setContactPhone}
            data-testid="legal-admin-contact-phone"
          />
        </div>

        <div className="locations-admin__field">
          <label htmlFor="legal-email">Контактный e-mail</label>
          <input
            id="legal-email"
            type="email"
            autoComplete="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            data-testid="legal-admin-contact-email"
          />
        </div>

        <button
          type="submit"
          className="locations-admin__submit"
          disabled={saving}
          data-testid="legal-admin-submit"
        >
          {saving ? 'Сохранение…' : 'Сохранить'}
        </button>
      </form>
    </div>
  );
}

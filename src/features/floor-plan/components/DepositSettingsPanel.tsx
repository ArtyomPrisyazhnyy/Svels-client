'use client';

import { useState } from 'react';
import { useLayoutStore } from '@/store/layout-store';
import { DEPOSIT_SCHEMES } from './constants';
import type { DepositScheme } from '@/shared/types/floor-plan';

interface DepositSettingsPanelProps {
  restaurantId: string;
  token: string;
  onSetDeposit: (restaurantId: string, token: string, payload: { scheme: DepositScheme; amount: number }) => Promise<void>;
}

export function DepositSettingsPanel({ restaurantId, token, onSetDeposit }: DepositSettingsPanelProps) {
  const scheme = useLayoutStore((s) => s.depositScheme);
  const globalAmount = useLayoutStore((s) => s.globalDepositAmount);
  const zones = useLayoutStore((s) => s.zones);
  const updateZone = useLayoutStore((s) => s.updateZone);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSchemeChange(newScheme: DepositScheme) {
    setSaving(true);
    setSaved(false);
    try {
      await onSetDeposit(restaurantId, token, { scheme: newScheme, amount: globalAmount });
      useLayoutStore.setState({ depositScheme: newScheme });
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } finally {
      setSaving(false);
    }
  }

  async function handleGlobalAmountChange(amount: number) {
    useLayoutStore.setState({ globalDepositAmount: amount });
    setSaving(true);
    setSaved(false);
    try {
      await onSetDeposit(restaurantId, token, { scheme, amount });
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="fp-deposit">
      <h3 className="fp-deposit__title">Депозиты за бронирование</h3>

      <label className="fp-deposit__field">
        <span>Схема депозита</span>
        <select
          value={scheme}
          disabled={saving}
          onChange={(e) => void handleSchemeChange(e.target.value as DepositScheme)}
        >
          {DEPOSIT_SCHEMES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </label>

      {scheme === 'global_deposit' && (
        <label className="fp-deposit__field">
          <span>Глобальная сумма (BYN)</span>
          <input
            type="number"
            min={0}
            step={0.5}
            value={globalAmount}
            disabled={saving}
            onChange={(e) => void handleGlobalAmountChange(Number(e.target.value))}
          />
        </label>
      )}

      {scheme === 'per_zone' && (
        <div className="fp-deposit__zones">
          <p className="fp-deposit__hint">Депозит для каждой зоны:</p>
          {zones.map((z) => (
            <label key={z.id} className="fp-deposit__field">
              <span>{z.name}</span>
              <input
                type="number"
                min={0}
                step={0.5}
                value={z.depositAmount}
                onChange={(e) => updateZone(z.id, { depositAmount: Number(e.target.value) })}
              />
            </label>
          ))}
        </div>
      )}

      {scheme === 'per_table' && (
        <p className="fp-deposit__hint">
          Депозит настраивается индивидуально для каждого стола в панели свойств стола.
          Если у стола 0 — наследует зону или глобальную сумму.
        </p>
      )}

      {scheme === 'no_deposit' && (
        <p className="fp-deposit__hint">Депозит не требуется при бронировании.</p>
      )}

      {saved && <p className="fp-deposit__saved">✓ Сохранено</p>}
      {saving && <p className="fp-deposit__saving">Сохранение…</p>}
    </section>
  );
}

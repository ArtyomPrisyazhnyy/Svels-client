'use client';

import { useState } from 'react';

interface CancelOrderModalProps {
  open: boolean;
  orderNumber: number | null;
  busy: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export function CancelOrderModal({
  open,
  orderNumber,
  busy,
  onClose,
  onConfirm,
}: CancelOrderModalProps) {
  const [reason, setReason] = useState('');

  function handleClose() {
    setReason('');
    onClose();
  }

  if (!open) {
    return null;
  }

  const trimmed = reason.trim();
  const valid = trimmed.length >= 1 && trimmed.length <= 300;

  return (
    <div className="orders-admin__modal-backdrop" role="presentation" onClick={handleClose}>
      <div
        className="orders-admin__modal"
        role="dialog"
        aria-labelledby="cancel-order-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="cancel-order-title" className="orders-admin__modal-title">
          Отменить заказ{orderNumber != null ? ` №${orderNumber}` : ''}?
        </h3>
        <p className="orders-admin__modal-hint">
          Укажите причину отмены для гостя и персонала (1–300 символов).
        </p>
        <textarea
          className="orders-admin__modal-textarea"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          maxLength={300}
          rows={4}
          placeholder="Например: нет ингредиентов"
          disabled={busy}
        />
        <p className="orders-admin__modal-counter">{trimmed.length}/300</p>
        <div className="orders-admin__modal-actions">
          <button
            type="button"
            className="orders-admin__btn orders-admin__btn--ghost"
            onClick={handleClose}
            disabled={busy}
          >
            Назад
          </button>
          <button
            type="button"
            className="orders-admin__btn orders-admin__btn--danger"
            onClick={() => onConfirm(trimmed)}
            disabled={!valid || busy}
          >
            {busy ? 'Отмена…' : 'Отменить заказ'}
          </button>
        </div>
      </div>
    </div>
  );
}

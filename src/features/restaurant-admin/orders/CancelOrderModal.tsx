'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui/Button/Button';
import { Field } from '@/shared/ui/Field/Field';
import { Modal } from '@/shared/ui/Modal/Modal';
import { Textarea } from '@/shared/ui/Textarea/Textarea';

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

  const trimmed = reason.trim();
  const valid = trimmed.length >= 1 && trimmed.length <= 300;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={`Отменить заказ${orderNumber != null ? ` №${orderNumber}` : ''}?`}
      titleId="cancel-order-title"
      testId="cancel-order-modal"
      closeTestId="cancel-order-close"
      size="sm"
      footer={
        <div className="orders-admin__modal-actions">
          <Button type="button" variant="ghost" onClick={handleClose} disabled={busy}>
            Назад
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={() => onConfirm(trimmed)}
            disabled={!valid || busy}
          >
            {busy ? 'Отмена…' : 'Отменить заказ'}
          </Button>
        </div>
      }
    >
      <Field
        label="Причина отмены"
        htmlFor="cancel-order-reason"
        hint="Для гостя и персонала, 1–300 символов"
      >
        <Textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          maxLength={300}
          rows={4}
          placeholder="Например: нет ингредиентов"
          disabled={busy}
        />
      </Field>
      <p className="orders-admin__modal-counter">{trimmed.length}/300</p>
    </Modal>
  );
}

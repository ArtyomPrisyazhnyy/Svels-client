'use client';

import { useRef, type InputHTMLAttributes, type MouseEvent } from 'react';
import {
  composeBelarusPhone,
  extractBelarusNational,
  formatBelarusNationalInput,
  PHONE_INPUT_NATIONAL_PLACEHOLDER,
  PHONE_INPUT_PREFIX,
} from '@/shared/utils/phone.util';
import './PhoneInput.scss';

type NativeInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'value' | 'onChange' | 'inputMode' | 'placeholder'
>;

export interface PhoneInputProps extends NativeInputProps {
  /** Полный номер (+375…) или пустая строка. */
  value: string;
  onChange: (value: string) => void;
}

export function PhoneInput({
  value,
  onChange,
  className,
  id,
  disabled,
  onFocus,
  onBlur,
  ...rest
}: PhoneInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const nationalValue = extractBelarusNational(value);

  function handleShellMouseDown(event: MouseEvent<HTMLDivElement>) {
    if (disabled) {
      return;
    }
    if (event.target !== inputRef.current) {
      event.preventDefault();
      inputRef.current?.focus();
    }
  }

  return (
    <div
      className={['phone-input', className].filter(Boolean).join(' ')}
      data-disabled={disabled ? 'true' : undefined}
      onMouseDown={handleShellMouseDown}
    >
      <div className="phone-input__row">
        <span className="phone-input__prefix" aria-hidden="true">
          {PHONE_INPUT_PREFIX}
        </span>
        <input
          {...rest}
          ref={inputRef}
          id={id}
          type="tel"
          inputMode="numeric"
          autoComplete={rest.autoComplete ?? 'tel-national'}
          disabled={disabled}
          className="phone-input__control"
          placeholder={PHONE_INPUT_NATIONAL_PLACEHOLDER}
          aria-label={rest['aria-label'] ?? 'Номер телефона без кода страны'}
          value={nationalValue}
          onChange={(event) => {
            const national = formatBelarusNationalInput(event.target.value);
            onChange(composeBelarusPhone(national));
          }}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </div>
    </div>
  );
}

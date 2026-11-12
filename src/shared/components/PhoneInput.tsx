'use client';

import {
  useLayoutEffect,
  useRef,
  type FormEvent,
  type InputHTMLAttributes,
  type MouseEvent,
} from 'react';
import {
  composeBelarusPhone,
  extractBelarusNational,
  formatBelarusNationalInput,
  PHONE_INPUT_NATIONAL_PLACEHOLDER,
  PHONE_INPUT_PREFIX,
} from '@/shared/utils/phone.util';
import {
  applyBelarusNationalPhoneEdit,
  isHandledPhoneInputType,
} from '@/shared/utils/phone-input-edit.util';
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
  onSelect,
  ...rest
}: PhoneInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const pendingCaretRef = useRef<number | null>(null);
  const skipNextInputRef = useRef(false);
  const fieldStateRef = useRef({ value: '', selStart: 0, selEnd: 0 });

  const nationalValue = extractBelarusNational(value);

  function syncFieldState() {
    const input = inputRef.current;
    if (!input) {
      return;
    }
    fieldStateRef.current = {
      value: nationalValue,
      selStart: input.selectionStart ?? 0,
      selEnd: input.selectionEnd ?? 0,
    };
  }

  useLayoutEffect(() => {
    const input = inputRef.current;
    if (!input) {
      return;
    }
    if (pendingCaretRef.current !== null) {
      const caret = pendingCaretRef.current;
      pendingCaretRef.current = null;
      input.setSelectionRange(caret, caret);
    }
    syncFieldState();
  }, [nationalValue]);

  function commitNationalEdit(
    formattedNational: string,
    caret: number,
  ) {
    pendingCaretRef.current = caret;
    onChange(composeBelarusPhone(formattedNational));
  }

  function applyEditFromInputType(
    inputType: string,
    data: string | null,
    selectionStart: number,
    selectionEnd: number,
    baseFormatted: string,
  ) {
    const { formattedNational, caret } = applyBelarusNationalPhoneEdit(
      baseFormatted,
      selectionStart,
      selectionEnd,
      inputType,
      data,
    );
    commitNationalEdit(formattedNational, caret);
  }

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
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          autoComplete={rest.autoComplete ?? 'tel-national'}
          disabled={disabled}
          className="phone-input__control"
          placeholder={PHONE_INPUT_NATIONAL_PLACEHOLDER}
          aria-label={rest['aria-label'] ?? 'Номер телефона без кода страны'}
          value={nationalValue}
          onBeforeInput={(event) => {
            if (disabled) {
              return;
            }
            const inputType = event.nativeEvent.inputType;
            if (!isHandledPhoneInputType(inputType)) {
              return;
            }
            event.preventDefault();
            skipNextInputRef.current = true;
            const input = event.currentTarget;
            applyEditFromInputType(
              inputType,
              event.nativeEvent.data,
              input.selectionStart ?? 0,
              input.selectionEnd ?? 0,
              nationalValue,
            );
          }}
          onInput={(event: FormEvent<HTMLInputElement>) => {
            if (disabled) {
              return;
            }
            if (skipNextInputRef.current) {
              skipNextInputRef.current = false;
              return;
            }
            const native = event.nativeEvent as InputEvent;
            if (isHandledPhoneInputType(native.inputType)) {
              const { value: prevValue, selStart, selEnd } = fieldStateRef.current;
              applyEditFromInputType(
                native.inputType,
                native.data,
                selStart,
                selEnd,
                prevValue,
              );
              return;
            }
            const national = formatBelarusNationalInput(event.currentTarget.value);
            onChange(composeBelarusPhone(national));
          }}
          onSelect={(event) => {
            syncFieldState();
            onSelect?.(event);
          }}
          onFocus={(event) => {
            syncFieldState();
            onFocus?.(event);
          }}
          onClick={() => {
            syncFieldState();
          }}
          onBlur={onBlur}
        />
      </div>
    </div>
  );
}

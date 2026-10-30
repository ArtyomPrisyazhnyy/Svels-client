import {
  BY_NATIONAL_LENGTH,
  formatBelarusNationalInput,
  normalizePhoneDigits,
} from './phone.util.ts';

/** Цифры национальной части (до 9), без форматирования. */
export function nationalDigitsFromFormatted(formattedNational: string): string {
  return normalizePhoneDigits(formattedNational).slice(0, BY_NATIONAL_LENGTH);
}

/** Сколько цифр в отформатированной строке стоит до caret (не включая caret). */
export function countDigitsBefore(formattedNational: string, caret: number): number {
  const limit = Math.max(0, Math.min(caret, formattedNational.length));
  let count = 0;
  for (let i = 0; i < limit; i += 1) {
    const char = formattedNational[i];
    if (char !== undefined && char >= '0' && char <= '9') {
      count += 1;
    }
  }
  return count;
}

/** Позиция caret после `digitIndex` цифр в уже отформатированной строке. */
export function caretAfterDigitIndex(formattedNational: string, digitIndex: number): number {
  if (digitIndex <= 0) {
    return 0;
  }
  let seen = 0;
  for (let i = 0; i < formattedNational.length; i += 1) {
    const char = formattedNational[i];
    if (char !== undefined && char >= '0' && char <= '9') {
      seen += 1;
      if (seen === digitIndex) {
        return i + 1;
      }
    }
  }
  return formattedNational.length;
}

function normalizePastedNationalDigits(raw: string): string {
  let digits = normalizePhoneDigits(raw);
  if (digits.startsWith('375')) {
    digits = digits.slice(3);
  } else if (digits.startsWith('80')) {
    digits = digits.slice(2);
  }
  return digits.slice(0, BY_NATIONAL_LENGTH);
}

function deleteDigitRange(digits: string, startDigit: number, endDigit: number): string {
  return digits.slice(0, startDigit) + digits.slice(endDigit);
}

export const HANDLED_PHONE_INPUT_TYPES = new Set([
  'deleteContentBackward',
  'deleteContentForward',
  'deleteByCut',
  'insertText',
  'insertReplacementText',
  'insertFromPaste',
  'insertFromDrop',
]);

export function isHandledPhoneInputType(inputType: string): boolean {
  return HANDLED_PHONE_INPUT_TYPES.has(inputType);
}

export interface BelarusNationalPhoneEditResult {
  formattedNational: string;
  caret: number;
}

/**
 * Чистая логика маски: formatted value + caret/selection + тип правки → новое value и caret.
 * `selectionStart`/`selectionEnd` — в координатах отформатированной национальной части (без +375).
 */
export function applyBelarusNationalPhoneEdit(
  formattedNational: string,
  selectionStart: number,
  selectionEnd: number,
  inputType: string,
  data: string | null,
): BelarusNationalPhoneEditResult {
  const digits = nationalDigitsFromFormatted(formattedNational);
  const startDigit = countDigitsBefore(formattedNational, selectionStart);
  const endDigit = countDigitsBefore(formattedNational, selectionEnd);

  let nextDigits = digits;
  let caretDigit = startDigit;

  switch (inputType) {
    case 'deleteContentBackward': {
      if (startDigit !== endDigit) {
        nextDigits = deleteDigitRange(digits, startDigit, endDigit);
        caretDigit = startDigit;
      } else if (startDigit > 0) {
        nextDigits = deleteDigitRange(digits, startDigit - 1, startDigit);
        caretDigit = startDigit - 1;
      }
      break;
    }
    case 'deleteContentForward': {
      if (startDigit !== endDigit) {
        nextDigits = deleteDigitRange(digits, startDigit, endDigit);
        caretDigit = startDigit;
      } else if (startDigit < digits.length) {
        nextDigits = deleteDigitRange(digits, startDigit, startDigit + 1);
        caretDigit = startDigit;
      }
      break;
    }
    case 'deleteByCut': {
      nextDigits = deleteDigitRange(digits, startDigit, endDigit);
      caretDigit = startDigit;
      break;
    }
    case 'insertText':
    case 'insertReplacementText': {
      const raw = data ?? '';
      const insertDigits =
        inputType === 'insertReplacementText'
          ? normalizePastedNationalDigits(raw)
          : normalizePhoneDigits(raw);
      if (!insertDigits) {
        break;
      }
      const base = deleteDigitRange(digits, startDigit, endDigit);
      nextDigits = nationalDigitsFromFormatted(
        base.slice(0, startDigit) + insertDigits + base.slice(startDigit),
      );
      caretDigit = Math.min(startDigit + insertDigits.length, BY_NATIONAL_LENGTH);
      break;
    }
    case 'insertFromPaste':
    case 'insertFromDrop': {
      const pasted = normalizePastedNationalDigits(data ?? '');
      if (!pasted) {
        break;
      }
      const base = deleteDigitRange(digits, startDigit, endDigit);
      nextDigits = nationalDigitsFromFormatted(
        base.slice(0, startDigit) + pasted + base.slice(startDigit),
      );
      caretDigit = Math.min(startDigit + pasted.length, BY_NATIONAL_LENGTH);
      break;
    }
    default:
      break;
  }

  const formatted = formatBelarusNationalInput(nextDigits);
  const caret = caretAfterDigitIndex(formatted, caretDigit);
  return { formattedNational: formatted, caret };
}

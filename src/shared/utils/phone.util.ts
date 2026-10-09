/** Только цифры из строки телефона. */
export function normalizePhoneDigits(value: string): string {
  return value.replace(/\D/g, '');
}

const BY_COUNTRY_DIGITS = '375';
const BY_NATIONAL_LENGTH = 9;

/** Для API: +375291234567 */
export function toPhoneApiValue(value: string): string {
  const digits = normalizePhoneDigits(value);
  if (!digits) {
    return '';
  }
  return `+${digits}`;
}

/**
 * Национальная часть BY: XX XXX-XX-XX (до 9 цифр).
 * Код страны в инпут не входит — он вынесен в UI-префикс.
 */
export function formatBelarusNationalInput(value: string): string {
  let digits = normalizePhoneDigits(value);

  // Если вставили полный номер с 375 / 80 — оставляем только национальную часть.
  if (digits.startsWith('375')) {
    digits = digits.slice(3);
  } else if (digits.startsWith('80')) {
    digits = digits.slice(2);
  }

  digits = digits.slice(0, BY_NATIONAL_LENGTH);
  if (!digits) {
    return '';
  }

  let result = digits.slice(0, Math.min(2, digits.length));
  if (digits.length <= 2) {
    return result;
  }

  result += ` ${digits.slice(2, Math.min(5, digits.length))}`;
  if (digits.length <= 5) {
    return result;
  }

  result += `-${digits.slice(5, Math.min(7, digits.length))}`;
  if (digits.length <= 7) {
    return result;
  }

  return `${result}-${digits.slice(7, 9)}`;
}

/** Собирает полный отображаемый номер из национальной части. */
export function composeBelarusPhone(nationalFormatted: string): string {
  const national = normalizePhoneDigits(nationalFormatted).slice(0, BY_NATIONAL_LENGTH);
  if (!national) {
    return '';
  }
  return formatPhoneDisplay(`${BY_COUNTRY_DIGITS}${national}`);
}

/** Достаёт национальную часть из полного value (для controlled input). */
export function extractBelarusNational(value: string): string {
  let digits = normalizePhoneDigits(value);
  if (digits.startsWith(BY_COUNTRY_DIGITS)) {
    digits = digits.slice(3);
  } else if (digits.startsWith('80')) {
    digits = digits.slice(2);
  }
  return formatBelarusNationalInput(digits.slice(0, BY_NATIONAL_LENGTH));
}

export function isCompleteBelarusPhone(value: string): boolean {
  const digits = normalizePhoneDigits(value);
  return digits.length === 12 && digits.startsWith(BY_COUNTRY_DIGITS);
}

export const PHONE_INPUT_PREFIX = '+375';
export const PHONE_INPUT_NATIONAL_PLACEHOLDER = 'XX XXX-XX-XX';

/**
 * Значение для controlled PhoneInput: полный +375 …, совместимый с isCompleteBelarusPhone.
 * Нормализует сохранённые национальные черновики («29 622-05-33») и E.164 из профиля.
 */
export function normalizePhoneForPhoneInput(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return '';
  }

  if (isCompleteBelarusPhone(trimmed)) {
    return formatPhoneDisplay(trimmed);
  }

  const national = extractBelarusNational(trimmed);
  if (national && normalizePhoneDigits(national).length === BY_NATIONAL_LENGTH) {
    return composeBelarusPhone(national);
  }

  const digits = normalizePhoneDigits(trimmed);
  if (digits.startsWith(BY_COUNTRY_DIGITS) && digits.length === 12) {
    return formatPhoneDisplay(`+${digits}`);
  }

  return trimmed;
}

/** Отображение уже сохранённого нормализованного номера. */
export function formatPhoneDisplay(normalized: string): string {
  let digits = normalizePhoneDigits(normalized);

  if (digits.startsWith('80')) {
    digits = `${BY_COUNTRY_DIGITS}${digits.slice(2)}`;
  }

  if (!digits.startsWith(BY_COUNTRY_DIGITS)) {
    return normalized.startsWith('+') ? normalized : `+${normalized}`;
  }

  digits = digits.slice(0, 12);
  const national = formatBelarusNationalInput(digits.slice(3));
  return national ? `${PHONE_INPUT_PREFIX} ${national}` : PHONE_INPUT_PREFIX;
}

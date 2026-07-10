export function formatPhoneDisplay(normalized: string): string {
  const digits = normalized.replace(/\D/g, '');

  if (digits.length === 12 && digits.startsWith('375')) {
    return `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 8)}-${digits.slice(8, 10)}-${digits.slice(10)}`;
  }

  return normalized;
}

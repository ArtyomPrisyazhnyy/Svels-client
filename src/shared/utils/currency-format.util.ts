/** Формат BYN для UI: копейки, если есть; целые без «,00». */
export function formatCurrencyAmount(amount: number | string, fractionDigits?: number): string {
  const value = Number(amount);
  if (!Number.isFinite(value)) {
    return '0';
  }

  if (fractionDigits !== undefined) {
    return value.toFixed(fractionDigits);
  }

  const rounded = Math.round(value * 100) / 100;
  if (Number.isInteger(rounded)) {
    return String(rounded);
  }

  return rounded.toFixed(2);
}

const MINSK_TZ = 'Europe/Minsk';

/** YYYY-MM-DD в календаре Europe/Minsk */
export function formatDateMinsk(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: MINSK_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

export function formatTimeMinsk(iso: string): string {
  const d = new Date(iso);
  return new Intl.DateTimeFormat('ru-RU', {
    timeZone: MINSK_TZ,
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function formatDateTimeMinsk(iso: string): string {
  const d = new Date(iso);
  return new Intl.DateTimeFormat('ru-RU', {
    timeZone: MINSK_TZ,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

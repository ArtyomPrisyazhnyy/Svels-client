export const DEFAULT_VENUE_TIMEZONE = 'Europe/Minsk';

/** Guest-facing order datetime: «28 окт., 16:30» in the venue timezone. */
export function formatVenueOrderDateTime(
  iso: string,
  timeZone: string = DEFAULT_VENUE_TIMEZONE,
): string {
  return new Intl.DateTimeFormat('ru-RU', {
    timeZone,
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));
}

export function formatVenueRequestedAt(
  requestedAt: string | null,
  timeZone: string = DEFAULT_VENUE_TIMEZONE,
): string {
  if (!requestedAt) {
    return 'Как можно скорее';
  }
  return formatVenueOrderDateTime(requestedAt, timeZone);
}

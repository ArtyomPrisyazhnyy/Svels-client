const SLOT_MS = 15 * 60 * 1000;
const MIN_LEAD_MS = 15 * 60 * 1000;

export interface RequestedTimeSlot {
  id: string;
  label: string;
  isoUtc: string;
}

function roundUpToSlot(date: Date): Date {
  return new Date(Math.ceil(date.getTime() / SLOT_MS) * SLOT_MS);
}

function startOfLocalDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatSlotLabel(date: Date, todayStart: Date): string {
  const isToday = date >= todayStart && date < new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
  const dayPart = isToday
    ? 'Сегодня'
    : 'Завтра';
  const time = date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${dayPart}, ${time}`;
}

/** Слоты по 15 мин на сегодня и завтра, не раньше now + 15 мин. */
export function buildRequestedTimeSlots(now = new Date()): RequestedTimeSlot[] {
  const minTime = roundUpToSlot(new Date(now.getTime() + MIN_LEAD_MS));
  const todayStart = startOfLocalDay(now);
  const slots: RequestedTimeSlot[] = [];

  for (let dayOffset = 0; dayOffset < 2; dayOffset += 1) {
    const dayStart = new Date(todayStart);
    dayStart.setDate(dayStart.getDate() + dayOffset);

    for (let minutes = 0; minutes < 24 * 60; minutes += 15) {
      const slot = new Date(dayStart);
      slot.setHours(0, 0, 0, 0);
      slot.setMinutes(minutes);

      if (slot < minTime) {
        continue;
      }

      slots.push({
        id: slot.toISOString(),
        label: formatSlotLabel(slot, todayStart),
        isoUtc: slot.toISOString(),
      });
    }
  }

  return slots;
}

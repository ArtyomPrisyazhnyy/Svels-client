export interface WorkSchedule {
  id: string;
  restaurantId: string;
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isOpen: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSchedulePayload {
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isOpen?: boolean;
}

export interface UpdateSchedulePayload {
  openTime?: string;
  closeTime?: string;
  isOpen?: boolean;
}

export const DAY_OF_WEEK_LABELS = [
  'Воскресенье',
  'Понедельник',
  'Вторник',
  'Среда',
  'Четверг',
  'Пятница',
  'Суббота',
];

export const SHORT_DAY_LABELS = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

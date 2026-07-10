import type { BookingMode, DepositScheme } from './floor-plan';

export type { BookingMode, DepositScheme };

export interface BookingSettings {
  restaurantId: string;
  bookingEnabled: boolean;
  mode: BookingMode;
  depositScheme: DepositScheme;
  depositAmount: number;
  bookingDurationMinutes: number;
  slotMinutes: number;
  maxGuests: number;
  advanceDays: number;
  autoConfirm: boolean;
  updatedAt: string;
}

export type UpdateBookingSettingsPayload = Partial<
  Pick<
    BookingSettings,
    | 'bookingEnabled'
    | 'mode'
    | 'depositScheme'
    | 'depositAmount'
    | 'bookingDurationMinutes'
    | 'slotMinutes'
    | 'maxGuests'
    | 'advanceDays'
    | 'autoConfirm'
  >
>;

export const DEFAULT_BOOKING_SETTINGS: Omit<BookingSettings, 'restaurantId' | 'updatedAt'> = {
  bookingEnabled: false,
  mode: 'specific_table',
  depositScheme: 'no_deposit',
  depositAmount: 0,
  bookingDurationMinutes: 120,
  slotMinutes: 30,
  maxGuests: 8,
  advanceDays: 14,
  autoConfirm: false,
};

export interface BookingModeOption {
  value: BookingMode;
  label: string;
  description: string;
}

export const BOOKING_MODE_OPTIONS: BookingModeOption[] = [
  {
    value: 'specific_table',
    label: 'Конкретный стол',
    description: 'Гость выбирает стол на 2D-планировке заведения',
  },
  {
    value: 'by_seats',
    label: 'По количеству мест',
    description: 'Гость бронирует «стол на N мест», стол назначает заведение',
  },
];

export const SLOT_MINUTES_OPTIONS = [15, 20, 30, 45, 60, 90, 120] as const;

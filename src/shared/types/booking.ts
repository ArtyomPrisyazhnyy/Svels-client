export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Booking {
  id: string;
  restaurantId: string;
  tableId: string | null;
  userId: string;
  bookingDate: string;
  bookingTime: string;
  guestCount: number;
  status: BookingStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingPayload {
  tableId?: string;
  bookingDate: string;
  bookingTime: string;
  guestCount: number;
  notes?: string;
}

export type BookingMode = 'specific_table' | 'by_seats';

export interface TableAvailability {
  id: string;
  label: string;
  capacity: number;
  occupiedSlots: string[];
}

export interface SeatsAvailability {
  total: number;
  occupied: number;
  remaining: number;
}

export interface BookingAvailability {
  enabled: boolean;
  mode: BookingMode;
  slotMinutes: number;
  date: string;
  slots: string[];
  tables?: TableAvailability[];
  seatsBySlot?: Record<string, SeatsAvailability>;
}

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  pending: 'Ожидает подтверждения',
  confirmed: 'Подтверждено',
  cancelled: 'Отменено',
  completed: 'Завершено',
};

export const BOOKING_STATUS_OPTIONS: BookingStatus[] = [
  'pending',
  'confirmed',
  'cancelled',
  'completed',
];

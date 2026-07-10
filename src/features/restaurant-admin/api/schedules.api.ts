import { apiRequest } from '../../../shared/api/api-client';
import type { WorkSchedule, UpdateSchedulePayload } from '../../../shared/types/schedule';

export function fetchSchedules(restaurantId: string): Promise<WorkSchedule[]> {
  return apiRequest<WorkSchedule[]>(`/restaurants/${restaurantId}/schedules`);
}

export function updateSchedule(
  restaurantId: string,
  token: string,
  scheduleId: string,
  payload: UpdateSchedulePayload,
): Promise<WorkSchedule> {
  return apiRequest<WorkSchedule>(
    `/restaurants/${restaurantId}/schedules/${scheduleId}`,
    {
      method: 'PATCH',
      token,
      body: JSON.stringify(payload),
    },
  );
}

export function createSchedule(
  restaurantId: string,
  token: string,
  payload: { dayOfWeek: number; openTime: string; closeTime: string; isOpen?: boolean },
): Promise<WorkSchedule> {
  return apiRequest<WorkSchedule>(`/restaurants/${restaurantId}/schedules`, {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  });
}

import { apiRequest } from '../../../shared/api/api-client';
import type {
  CreateFloorPlanPayload,
  CreateTablePayload,
  FloorPlan,
  FloorPlanLayoutResponse,
  FloorPlanTable,
  FloorPlanZone,
  PublicFloorPlanLayoutResponse,
  SaveLayoutPayload,
  SetDepositPayload,
  TablesAvailabilityResponse,
  UpdateFloorPlanPayload,
  UpdateTablePayload,
} from '../../../shared/types/floor-plan';

// ─────────────────────────── Admin layout ────────────────────────────────

export function fetchFloorPlans(
  restaurantId: string,
  token: string,
): Promise<FloorPlanLayoutResponse> {
  return apiRequest<FloorPlanLayoutResponse>(`/restaurants/${restaurantId}/floor-plans`, {
    token,
  });
}

export function createFloorPlan(
  restaurantId: string,
  token: string,
  payload: CreateFloorPlanPayload,
): Promise<FloorPlan> {
  return apiRequest<FloorPlan>(`/restaurants/${restaurantId}/floor-plans`, {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  });
}

export function updateFloorPlan(
  restaurantId: string,
  token: string,
  floorPlanId: string,
  payload: UpdateFloorPlanPayload,
): Promise<FloorPlan> {
  return apiRequest<FloorPlan>(`/restaurants/${restaurantId}/floor-plans/${floorPlanId}`, {
    method: 'PATCH',
    token,
    body: JSON.stringify(payload),
  });
}

export function deleteFloorPlan(
  restaurantId: string,
  token: string,
  floorPlanId: string,
): Promise<void> {
  return apiRequest<void>(`/restaurants/${restaurantId}/floor-plans/${floorPlanId}`, {
    method: 'DELETE',
    token,
  });
}

/** Atomic bulk-сохранение всей планировки зоны (decor + столы). */
export function saveLayout(
  restaurantId: string,
  token: string,
  floorPlanId: string,
  payload: SaveLayoutPayload,
): Promise<FloorPlanZone> {
  return apiRequest<FloorPlanZone>(
    `/restaurants/${restaurantId}/floor-plans/${floorPlanId}/layout`,
    {
      method: 'PUT',
      token,
      body: JSON.stringify(payload),
    },
  );
}

export function createTable(
  restaurantId: string,
  token: string,
  floorPlanId: string,
  payload: CreateTablePayload,
): Promise<FloorPlanTable> {
  return apiRequest<FloorPlanTable>(
    `/restaurants/${restaurantId}/floor-plans/${floorPlanId}/tables`,
    {
      method: 'POST',
      token,
      body: JSON.stringify(payload),
    },
  );
}

export function updateTable(
  restaurantId: string,
  token: string,
  tableId: string,
  payload: UpdateTablePayload,
): Promise<FloorPlanTable> {
  return apiRequest<FloorPlanTable>(
    `/restaurants/${restaurantId}/floor-plans/tables/${tableId}`,
    {
      method: 'PATCH',
      token,
      body: JSON.stringify(payload),
    },
  );
}

export function deleteTable(
  restaurantId: string,
  token: string,
  tableId: string,
): Promise<void> {
  return apiRequest<void>(`/restaurants/${restaurantId}/floor-plans/tables/${tableId}`, {
    method: 'DELETE',
    token,
  });
}

export function setDepositScheme(
  restaurantId: string,
  token: string,
  payload: SetDepositPayload,
): Promise<void> {
  return apiRequest<void>(`/restaurants/${restaurantId}/booking-settings/deposit`, {
    method: 'PATCH',
    token,
    body: JSON.stringify(payload),
  });
}

// ─────────────────────────── Public layout ────────────────────────────────

export function fetchPublicLayout(
  restaurantId: string,
): Promise<PublicFloorPlanLayoutResponse> {
  return apiRequest<PublicFloorPlanLayoutResponse>(
    `/restaurants/${restaurantId}/floor-plans/public`,
  );
}

export function fetchTablesAvailability(
  restaurantId: string,
  date: string,
  time: string,
): Promise<TablesAvailabilityResponse> {
  return apiRequest<TablesAvailabilityResponse>(
    `/restaurants/${restaurantId}/tables/availability?date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}`,
  );
}

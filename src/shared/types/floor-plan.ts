export type TableShape = 'rectangle' | 'round' | 'square' | 'oval' | 'polygon';

export type TableObjectType =
  | 'table'
  | 'bar'
  | 'billiard'
  | 'cabana'
  | 'room'
  | 'lounger';

export type DepositScheme =
  | 'no_deposit'
  | 'global_deposit'
  | 'per_zone'
  | 'per_table';

export type BookingMode = 'specific_table' | 'by_seats';

export type SeatKind = 'chair' | 'stool' | 'couch' | 'bench';

export interface TableSeat {
  id: string;
  kind: SeatKind;
  /** Локальная X относительно стола. */
  x: number;
  /** Локальная Y относительно стола. */
  y: number;
  /** Поворот места в градусах (ориентация спинки). */
  rotation?: number;
  /** Ширина места (для диванов/скамеек). null = default по kind/slots. */
  width?: number | null;
  /** Количество посадочных мест (для дивана/скамейки: 2, 3, 4…). */
  slots?: number;
}

export const SEAT_KINDS: Array<{ value: SeatKind; label: string }> = [
  { value: 'chair', label: 'Стул' },
  { value: 'stool', label: 'Табурет' },
  { value: 'couch', label: 'Диван' },
  { value: 'bench', label: 'Скамейка' },
];

export interface FloorPlanTable {
  id: string;
  restaurantId: string;
  floorPlanId: string;
  label: string;
  objectType: TableObjectType;
  capacity: number;
  minCapacity: number;
  positionX: number | null;
  positionY: number | null;
  width: number;
  height: number;
  rotation: number;
  shape: TableShape;
  points: number[] | null;
  seats: TableSeat[] | null;
  cornerRadius: number;
  depositAmount: number;
  isActive: boolean;
  visibleToGuests: boolean;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export type DecorIconKind =
  | 'plant'
  | 'tv'
  | 'lamp'
  | 'curtain'
  | 'stairs'
  | 'entrance'
  | 'wc'
  | 'stage'
  | 'bar'
  | 'kitchen';

export type DecorShapeKind = 'rect' | 'circle' | 'triangle' | 'oval';

interface BaseDecorObject {
  id: string;
  rotation?: number;
}

export interface LineDecorObject extends BaseDecorObject {
  type: 'line';
  points: number[];
  strokeWidth: number;
  color: string;
}

export interface PolylineDecorObject extends BaseDecorObject {
  type: 'polyline';
  points: number[];
  strokeWidth: number;
  color: string;
  closed: boolean;
  cornerRadius?: number;
  tension?: number;
}

export interface ZoneDecorObject extends BaseDecorObject {
  type: 'zone';
  points: number[];
  fill: string;
  stroke: string;
  strokeWidth: number;
  cornerRadius?: number;
  tension?: number;
}

export interface ShapeDecorObject extends BaseDecorObject {
  type: 'shape';
  shape: DecorShapeKind;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
}

export interface TextDecorObject extends BaseDecorObject {
  type: 'text';
  x: number;
  y: number;
  rotation: number;
  text: string;
  fontSize: number;
  color: string;
}

export interface DecorIconObject extends BaseDecorObject {
  type: 'decor-icon';
  x: number;
  y: number;
  rotation: number;
  icon: DecorIconKind;
  width: number;
  height: number;
  color?: string;
}

export type DecorObject =
  | LineDecorObject
  | PolylineDecorObject
  | ZoneDecorObject
  | ShapeDecorObject
  | TextDecorObject
  | DecorIconObject;

export interface DecorGrid {
  size: number;
  visible: boolean;
  color: string;
}

export interface DecorLayoutData {
  grid: DecorGrid;
  objects: DecorObject[];
}

export interface FloorPlan {
  id: string;
  restaurantId: string;
  name: string;
  sortOrder: number;
  depositAmount: number;
  decorData: DecorLayoutData | null;
  createdAt: string;
  updatedAt: string;
}

export interface FloorPlanZone extends FloorPlan {
  tables: FloorPlanTable[];
}

export interface FloorPlanLayoutResponse {
  zones: FloorPlanZone[];
}

export interface PublicFloorPlanTable {
  id: string;
  floorPlanId: string;
  label: string;
  objectType: TableObjectType;
  capacity: number;
  minCapacity: number;
  positionX: number | null;
  positionY: number | null;
  width: number;
  height: number;
  rotation: number;
  shape: TableShape;
  points: number[] | null;
  seats: TableSeat[] | null;
  cornerRadius: number;
  depositAmount: number;
  description: string | null;
}

export interface PublicFloorPlanZone {
  id: string;
  name: string;
  sortOrder: number;
  depositAmount: number;
  decorData: DecorLayoutData | null;
  tables: PublicFloorPlanTable[];
}

export interface PublicFloorPlanLayoutResponse {
  depositScheme: DepositScheme;
  globalDepositAmount: number;
  bookingDurationMinutes: number;
  zones: PublicFloorPlanZone[];
}

export interface CreateTablePayload {
  label: string;
  objectType?: TableObjectType;
  capacity: number;
  minCapacity?: number;
  positionX?: number;
  positionY?: number;
  width?: number;
  height?: number;
  points?: number[];
  seats?: TableSeat[];
  rotation?: number;
  shape?: TableShape;
  cornerRadius?: number;
  depositAmount?: number;
  isActive?: boolean;
  visibleToGuests?: boolean;
  description?: string;
}

export type UpdateTablePayload = Partial<CreateTablePayload>;

export interface CreateFloorPlanPayload {
  name: string;
  sortOrder?: number;
  depositAmount?: number;
  decorData?: DecorLayoutData;
}

export interface UpdateFloorPlanPayload {
  name?: string;
  sortOrder?: number;
  depositAmount?: number;
  decorData?: DecorLayoutData;
}

export interface LayoutTablePayload {
  id?: string;
  label: string;
  objectType?: TableObjectType;
  shape?: TableShape;
  capacity: number;
  minCapacity?: number;
  positionX?: number;
  positionY?: number;
  width?: number;
  height?: number;
  points?: number[];
  seats?: TableSeat[];
  rotation?: number;
  cornerRadius?: number;
  depositAmount?: number;
  isActive?: boolean;
  visibleToGuests?: boolean;
  description?: string;
}

export interface SaveLayoutPayload {
  decorData?: DecorLayoutData;
  tables: LayoutTablePayload[];
}

export interface SetDepositPayload {
  scheme: DepositScheme;
  amount: number;
}

export interface TableBusyEntry {
  tableId: string;
  busyUntil: string;
}

export interface TablesAvailabilityResponse {
  date: string;
  time: string;
  durationMinutes: number;
  busy: TableBusyEntry[];
}

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

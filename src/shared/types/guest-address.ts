export interface GuestAddress {
  id: string;
  label: string | null;
  street: string;
  house: string;
  apartment: string | null;
  entrance: string | null;
  floor: string | null;
  intercom: string | null;
  comment: string | null;
  isDefault: boolean;
  lastUsedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGuestAddressPayload {
  label?: string;
  street: string;
  house: string;
  apartment?: string;
  entrance?: string;
  floor?: string;
  intercom?: string;
  comment?: string;
  isDefault?: boolean;
}

export type UpdateGuestAddressPayload = Partial<CreateGuestAddressPayload>;

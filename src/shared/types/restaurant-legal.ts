export interface RestaurantLegalFields {
  legalName: string | null;
  legalAddress: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
  unp: string | null;
}

export type UpdateRestaurantLegalPayload = Partial<
  Pick<RestaurantLegalFields, 'legalName' | 'legalAddress' | 'contactPhone' | 'contactEmail' | 'unp'>
>;

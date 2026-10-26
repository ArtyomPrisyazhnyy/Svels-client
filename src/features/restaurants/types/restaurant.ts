export interface PublicRestaurant {
  id: string;
  name: string;
  description: string | null;
  address: string;
  status: string;
  customDomain?: string | null;
  logoUrl?: string | null;
  logoWebpUrl?: string | null;
  legalName?: string | null;
  legalAddress?: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
  unp?: string | null;
  createdAt: string;
}

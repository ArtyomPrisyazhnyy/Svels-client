export interface PublicRestaurant {
  id: string;
  name: string;
  description: string | null;
  address: string;
  status: string;
  customDomain?: string | null;
  logoUrl?: string | null;
  createdAt: string;
}

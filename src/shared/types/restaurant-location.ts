export interface RestaurantLocation {
  id: string;
  restaurantId: string;
  city: string;
  address: string;
  label: string | null;
  lat: number;
  lng: number;
  sortOrder: number;
}

export interface CreateRestaurantLocationPayload {
  city: string;
  address: string;
  label?: string;
  lat: number;
  lng: number;
  sortOrder?: number;
}

export interface UpdateRestaurantLocationPayload {
  city?: string;
  address?: string;
  label?: string | null;
  lat?: number;
  lng?: number;
  sortOrder?: number;
}

export function formatRestaurantLocationLine(location: RestaurantLocation): string {
  const city = location.city.trim();
  const address = location.address.trim();
  if (city && !address.toLowerCase().includes(city.toLowerCase())) {
    return `${city}, ${address}`;
  }
  return address;
}

export function uniqueLocationCities(locations: RestaurantLocation[]): string[] {
  const seen = new Set<string>();
  const cities: string[] = [];
  for (const location of locations) {
    const city = location.city.trim();
    if (!city || seen.has(city.toLowerCase())) {
      continue;
    }
    seen.add(city.toLowerCase());
    cities.push(city);
  }
  return cities;
}

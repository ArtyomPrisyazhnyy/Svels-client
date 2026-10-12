import { apiClient } from './api';

export async function clearGuestAddresses(restaurantId: string, guestToken: string): Promise<void> {
  const rows = await apiClient.listGuestAddresses(restaurantId, guestToken);
  for (const row of rows) {
    await apiClient.deleteGuestAddress(restaurantId, guestToken, row.id);
  }
}

import { apiRequest } from '@/shared/api/api-client';
import type { TelegramChatDto, TelegramLinkCodeResponse } from '@/shared/types/telegram';

export function createTelegramLinkCode(
  restaurantId: string,
  token: string,
): Promise<TelegramLinkCodeResponse> {
  return apiRequest<TelegramLinkCodeResponse>(
    `/restaurants/${restaurantId}/telegram/link-code`,
    {
      method: 'POST',
      token,
    },
  );
}

export function fetchTelegramChats(
  restaurantId: string,
  token: string,
): Promise<TelegramChatDto[]> {
  return apiRequest<TelegramChatDto[]>(`/restaurants/${restaurantId}/telegram/chats`, {
    method: 'GET',
    token,
  });
}

export function deleteTelegramChat(
  restaurantId: string,
  chatId: string,
  token: string,
): Promise<void> {
  return apiRequest<void>(`/restaurants/${restaurantId}/telegram/chats/${chatId}`, {
    method: 'DELETE',
    token,
  });
}

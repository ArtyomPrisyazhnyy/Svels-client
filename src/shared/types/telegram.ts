export interface TelegramLinkCodeResponse {
  code: string;
  deepLink: string;
  expiresAt: string;
}

export interface TelegramChatDto {
  id: string;
  chatId: string;
  title: string | null;
  createdAt: string;
}

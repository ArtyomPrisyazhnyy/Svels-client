export type SocialPlatform =
  | 'telegram'
  | 'instagram'
  | 'vk'
  | 'facebook'
  | 'youtube'
  | 'tiktok'
  | 'twitter'
  | 'whatsapp'
  | 'other';

export interface SocialLink {
  id: string;
  restaurantId: string;
  url: string;
  label: string | null;
  platform: SocialPlatform;
  sortOrder: number;
  createdAt: string;
}

export interface CreateSocialLinkPayload {
  url: string;
  label?: string;
  sortOrder?: number;
}

export interface UpdateSocialLinkPayload {
  url?: string;
  label?: string | null;
  sortOrder?: number;
}

export const SOCIAL_PLATFORM_LABELS: Record<SocialPlatform, string> = {
  telegram: 'Telegram',
  instagram: 'Instagram',
  vk: 'ВКонтакте',
  facebook: 'Facebook',
  youtube: 'YouTube',
  tiktok: 'TikTok',
  twitter: 'X (Twitter)',
  whatsapp: 'WhatsApp',
  other: 'Ссылка',
};

export function getSocialLinkDisplayLabel(link: Pick<SocialLink, 'label' | 'platform'>): string {
  return link.label?.trim() || SOCIAL_PLATFORM_LABELS[link.platform];
}

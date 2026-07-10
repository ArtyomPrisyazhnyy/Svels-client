import type { SocialPlatform } from '../types/social-link';

function normalizeSocialUrl(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) {
    return null;
  }

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const parsed = new URL(withProtocol);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

export function detectSocialPlatform(url: string): SocialPlatform {
  const normalized = normalizeSocialUrl(url);
  if (!normalized) {
    return 'other';
  }

  const hostname = new URL(normalized).hostname.replace(/^www\./i, '').toLowerCase();

  if (hostname === 't.me' || hostname === 'telegram.me' || hostname.endsWith('.t.me')) {
    return 'telegram';
  }
  if (hostname === 'instagram.com' || hostname.endsWith('.instagram.com')) {
    return 'instagram';
  }
  if (hostname === 'vk.com' || hostname === 'vk.ru' || hostname.endsWith('.vk.com') || hostname.endsWith('.vk.ru')) {
    return 'vk';
  }
  if (
    hostname === 'facebook.com' ||
    hostname === 'fb.com' ||
    hostname.endsWith('.facebook.com')
  ) {
    return 'facebook';
  }
  if (
    hostname === 'youtube.com' ||
    hostname === 'youtu.be' ||
    hostname.endsWith('.youtube.com')
  ) {
    return 'youtube';
  }
  if (hostname === 'tiktok.com' || hostname.endsWith('.tiktok.com')) {
    return 'tiktok';
  }
  if (
    hostname === 'twitter.com' ||
    hostname === 'x.com' ||
    hostname.endsWith('.twitter.com') ||
    hostname.endsWith('.x.com')
  ) {
    return 'twitter';
  }
  if (
    hostname === 'wa.me' ||
    hostname === 'whatsapp.com' ||
    hostname.endsWith('.whatsapp.com')
  ) {
    return 'whatsapp';
  }

  return 'other';
}

export function normalizeSocialUrlForSubmit(input: string): string | null {
  return normalizeSocialUrl(input);
}

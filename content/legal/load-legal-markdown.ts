import { readFile } from 'fs/promises';
import path from 'path';

const LEGAL_DIR = path.join(process.cwd(), 'content/legal');

export async function loadLegalMarkdown(filename: string): Promise<string> {
  return readFile(path.join(LEGAL_DIR, filename), 'utf8');
}

export function applyGuestTermsPlaceholders(
  template: string,
  values: Record<string, string | null | undefined>,
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    const value = values[key];
    if (value === null || value === undefined || value.trim() === '') {
      return '—';
    }
    return value.trim();
  });
}

function parseHex(hex: string): [number, number, number] | null {
  const normalized = hex.trim().toLowerCase();
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/.exec(normalized);
  if (!match) {
    return null;
  }

  let value = match[1];
  if (value.length === 3) {
    value = value
      .split('')
      .map((ch) => ch + ch)
      .join('');
  }

  if (value.length === 8) {
    value = value.slice(0, 6);
  }

  const int = Number.parseInt(value, 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
}

function srgbToLinear(channel: number): number {
  const c = channel / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance(hex: string): number {
  const rgb = parseHex(hex);
  if (!rgb) {
    throw new Error(`Unsupported color: ${hex}`);
  }

  const [r, g, b] = rgb.map(srgbToLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(foreground: string, background: string): number {
  const l1 = relativeLuminance(foreground);
  const l2 = relativeLuminance(background);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

const ON_COLOR_CANDIDATES = ['#ffffff', '#000000', '#0f172a', '#fafafa', '#171717'] as const;

export function pickOnColor(background: string, minRatio = 4.5): string {
  let best: string = ON_COLOR_CANDIDATES[0];
  let bestRatio = 0;

  for (const candidate of ON_COLOR_CANDIDATES) {
    const ratio = contrastRatio(candidate, background);
    if (ratio >= minRatio) {
      return candidate;
    }
    if (ratio > bestRatio) {
      bestRatio = ratio;
      best = candidate;
    }
  }

  return best;
}

export function blendOver(background: string, foreground: string, alpha: number): string {
  const bg = parseHex(background);
  const fg = parseHex(foreground);
  if (!bg || !fg) {
    return foreground;
  }

  const mix = (b: number, f: number) => Math.round(f * alpha + b * (1 - alpha));
  const [br, bgc, bb] = bg;
  const [fr, fgC, fb] = fg;
  const r = mix(br, fr);
  const g = mix(bgc, fgC);
  const b = mix(bb, fb);
  return `#${[r, g, b].map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;
}

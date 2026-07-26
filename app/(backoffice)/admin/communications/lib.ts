export function extractPlaceholders(message: string): string[] {
  return [...message.matchAll(/\{([^{}]+)\}/g)].map((m) => m[1].trim());
}

export function renderPreview(message: string, data: Record<string, string>): string {
  return message.replace(/\{([^{}]+)\}/g, (_, token: string) => data[token.trim()] ?? '');
}

/** GSM-7 segment estimate: 160 chars for 1 segment, 153 per segment after. */
export function smsSegments(message: string): number {
  const len = message.length;
  if (len === 0) return 0;
  return len <= 160 ? 1 : Math.ceil(len / 153);
}

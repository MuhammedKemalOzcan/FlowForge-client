// Masks an API key for display: keeps the first 8 characters visible and
// replaces the rest with "*" so the full secret is never shown on screen,
// even in this demo console.
export function maskApiKey(apiKey: string): string {
  const VISIBLE_CHARS = 16;

  if (apiKey.length <= VISIBLE_CHARS) return apiKey;

  const visible = apiKey.slice(0, VISIBLE_CHARS);
  const hidden = "*".repeat(apiKey.length - VISIBLE_CHARS);
  return visible + hidden;
}

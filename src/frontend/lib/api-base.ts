/**
 * URL del API Express (no el origen de Next.js).
 * En el navegador debe ser alcanzable desde tu PC (p. ej. localhost:4000).
 */
export function getApiBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (raw) return raw.replace(/\/$/, '');
  return 'http://localhost:4000';
}

export function apiUrl(path: string): string {
  const base = getApiBaseUrl();
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}

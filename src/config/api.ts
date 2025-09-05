import { env } from '../env';

const fallback = 'http://localhost:3333'; // para dev local
export const API_BASE = env.API_BASE || fallback;

export function ensureHttps(url?: string) {
  if (!url) return '';
  try {
    const u = new URL(url);
    // Em produção (site HTTPS), evite mixed content
    if (typeof window !== 'undefined' && window.location.protocol === 'https:' && u.protocol !== 'https:') {
      console.warn('[Config] API não-HTTPS detectada em site HTTPS. Ajuste VITE_API_BASE para https.');
    }
  } catch {}
  return url;
}

export const apiBaseUrl = ensureHttps(API_BASE);

export const apiUrl = (path: string) => {
  const base = (apiBaseUrl || '').replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
};
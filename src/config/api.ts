// src/config/api.ts
export const API_BASE = import.meta.env.VITE_API_BASE;

if (!API_BASE) {
  // Ajuda durante o build: mensagem clara
  // Em produção, isso evitará uma aplicação "muda" sem API
  console.warn('[Config] VITE_API_BASE não definida. Usando fallback http://localhost:3333 em dev.');
}

export const apiBaseUrl = API_BASE || 'http://localhost:3333';

// Helper para montar URLs
export const apiUrl = (path: string) => {
  const base = apiBaseUrl.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
};
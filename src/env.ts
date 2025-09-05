export const env = {
  API_BASE: (import.meta.env.VITE_API_BASE as string) || '',
  SUPABASE_URL: (import.meta.env.VITE_SUPABASE_URL as string) || '',
  SUPABASE_ANON_KEY: (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '',
};

// Modo demo quando faltam variáveis
export const isDemo =
  !env.SUPABASE_URL || !env.SUPABASE_ANON_KEY ? true : false;

if (isDemo) {
  // Aviso único no console, não quebra a app
  console.warn(
    '⚠️ Executando em MODO DEMO: defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY para ativar login real.'
  );
}
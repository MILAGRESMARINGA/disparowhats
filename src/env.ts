export const env = {
  API_BASE: (import.meta.env.VITE_API_BASE as string) || '',
  SUPABASE_URL: (import.meta.env.VITE_SUPABASE_URL as string) || '',
  SUPABASE_ANON_KEY: (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '',
};

// Verificar configuração obrigatória
if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
  console.error('⚠️ CONFIGURAÇÃO OBRIGATÓRIA: defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY');
}
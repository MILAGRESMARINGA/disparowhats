// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('[Supabase] Variáveis ausentes. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.');
  // Em dev podemos lançar erro; em prod mostramos UI amigável em HealthCheck
}

export const supabase = createClient(
  SUPABASE_URL || 'https://placeholder.supabase.co',
  SUPABASE_ANON_KEY || 'anon-placeholder'
);

// Types baseados no schema do banco
export interface Contact {
  id: string
  user_id: string
  name: string | null
  phone: string | null
  email?: string | null
  status: string | null
  tags: string[]
  notes: string | null
  property_interest?: string | null
  budget?: number | null
  last_contact?: string | null
  created_at: string
}

export interface Group {
  id: string
  user_id: string
  name: string | null
  description: string | null
  created_at: string
}

export interface Message {
  id: string
  template: string | null
  created_at: string
}

export interface SendLog {
  id: string
  user_id: string
  contact_id: string | null
  message_id: string | null
  status: string | null
  timestamp: string
}
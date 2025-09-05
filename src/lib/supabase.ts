import { createClient, SupabaseClient } from '@supabase/supabase-js'
import env from '../config/env'

if (!env.SUPABASE_URL) throw new Error('Supabase: VITE_SUPABASE_URL ausente.')
if (!env.SUPABASE_ANON_KEY) throw new Error('Supabase: VITE_SUPABASE_ANON_KEY ausente.')

export const supabase: SupabaseClient = createClient(
  env.SUPABASE_URL!,
  env.SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
)

// Types baseados no schema do banco
export interface Contact {
  id: string
  user_id: string
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
  user_id: string
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
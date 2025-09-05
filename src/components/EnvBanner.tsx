import { apiBaseUrl } from '../config/api'

export default function EnvBanner() {
  const missing: string[] = []
  if (!import.meta.env.VITE_API_BASE) missing.push('VITE_API_BASE')
  if (!import.meta.env.VITE_SUPABASE_URL) missing.push('VITE_SUPABASE_URL')
  if (!import.meta.env.VITE_SUPABASE_ANON_KEY) missing.push('VITE_SUPABASE_ANON_KEY')

  if (!missing.length) return null

  return (
    <div className="w-full bg-amber-500/10 border border-amber-500/20 text-amber-200 px-4 py-2 text-sm">
      ⚠️ Variáveis de ambiente ausentes: <b>{missing.join(', ')}</b>.  
      Configure no Bolt Hosting → Environment e reimplante.
    </div>
  )
}
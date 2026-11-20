import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY
export const configured = Boolean(url && key)
// Placeholders keep the app running in local-only mode when no keys are set.
export const supabase = createClient(url || 'http://localhost', key || 'missing-key')

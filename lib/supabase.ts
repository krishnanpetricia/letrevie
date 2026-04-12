import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''

// Safe factory — never throws even when a key is absent (e.g. ANON key missing
// from a local .env.local, or SERVICE_ROLE_KEY absent in browser bundles where
// variables without a NEXT_PUBLIC_ prefix are always undefined). Callers get
// null cast as the real type; any actual API call fails at runtime with a clear
// error rather than crashing the entire module at init time.
function makeClient(key: string | undefined): SupabaseClient {
  if (!supabaseUrl || !key) return null as unknown as SupabaseClient
  return createClient(supabaseUrl, key)
}

// Public client — browser / client components.
// Requires NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY.
export const supabase = makeClient(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

// Admin client — server-side API routes only (bypasses RLS).
// SUPABASE_SERVICE_ROLE_KEY has no NEXT_PUBLIC_ prefix so it is always
// undefined in browser bundles; makeClient returns null safely there.
export const supabaseAdmin = makeClient(process.env.SUPABASE_SERVICE_ROLE_KEY)

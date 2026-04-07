import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET() {
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Rome' })
  console.log('[bookings] today (Europe/Rome):', today)

  const { data, error } = await supabaseAdmin
    .from('bookings')
    .select('*')
    .gte('date', today)
    .eq('status', 'confirmed')
    .order('date', { ascending: true })
    .order('time', { ascending: true })

  console.log('[bookings] supabase error:', error ?? null)
  console.log('[bookings] rows returned:', data?.length ?? 0)
  console.log('[bookings] rows:', JSON.stringify(data))

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return new NextResponse(JSON.stringify({ bookings: data }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  })
}

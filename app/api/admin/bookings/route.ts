import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Rome' })

  const { data, error } = await supabaseAdmin
    .from('bookings')
    .select('*')
    .gte('date', today)
    .eq('status', 'confirmed')
    .order('date', { ascending: true })
    .order('time', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return new NextResponse(JSON.stringify({ bookings: data }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  })
}

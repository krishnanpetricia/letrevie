import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('settings')
    .select('value')
    .eq('key', 'opening_hours')
    .single()

  if (error || !data) {
    return NextResponse.json({
      hours: {
        dinner_open: '19:00',
        dinner_close: '22:30',
        lunch_open: '12:00',
        lunch_close: '14:00',
        closed_day: 3,
        lunch_day: 0,
      },
    })
  }

  return NextResponse.json({ hours: JSON.parse(data.value) })
}

export async function POST(req: NextRequest) {
  const password = req.headers.get('x-admin-password')
  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { hours } = await req.json()
  if (!hours) {
    return NextResponse.json({ error: 'Hours object required' }, { status: 400 })
  }

  const { error } = await supabaseAdmin
    .from('settings')
    .upsert(
      { key: 'opening_hours', value: JSON.stringify(hours) },
      { onConflict: 'key' }
    )

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

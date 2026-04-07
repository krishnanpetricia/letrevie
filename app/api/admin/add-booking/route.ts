import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, date, time, covers, phone, email, notes, lang } = body

  if (!name || !date || !time || !covers) {
    return NextResponse.json(
      { error: 'Name, date, time and covers are required.' },
      { status: 400 }
    )
  }

  const { error } = await supabaseAdmin
    .from('bookings')
    .insert({
      name,
      date,
      time,
      covers: Number(covers),
      phone:  phone  || null,
      email:  email  || null,
      notes:  notes  || null,
      lang:   lang   || 'en',
    })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

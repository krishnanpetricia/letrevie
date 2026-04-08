import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const body = await req.json()
  const { name, date, time, covers, phone, email, notes, lang } = body

  if (!name || !date || !time || !covers) {
    return NextResponse.json(
      { error: 'Name, date, time and covers are required.' },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from('bookings')
    .insert({
      name,
      date,
      time,
      covers:  Number(covers),
      phone:   phone  || null,
      email:   email  || null,
      notes:   notes  || null,
      lang:    lang   || 'en',
      status:  'confirmed',
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

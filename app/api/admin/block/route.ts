import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { date, time, time_end, reason } = await req.json()
  if (!date) return NextResponse.json({ error: 'Date required' }, { status: 400 })

  const { error } = await supabase
    .from('blocked_slots')
    .insert({ date, time: time || null, time_end: time_end || null, reason: reason || null })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

  const { data, error } = await supabase
    .from('blocked_slots')
    .delete()
    .eq('id', id)
    .select()

  console.log('[unblock] id:', id, '| deleted rows:', data?.length ?? 0, '| error:', error ?? null)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

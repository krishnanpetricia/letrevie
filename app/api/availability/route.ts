import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Operating hours by day (0 = Sunday, 1 = Monday, ... 6 = Saturday)
// Dinner: 19:00–22:30 daily except Wednesday (3)
// Sunday lunch: 12:00–14:00

function generateSlots(date: string): string[] {
  const d = new Date(date)
  const day = d.getDay() // 0 = Sunday

  const slots: string[] = []

  // Sunday lunch
  if (day === 0) {
    let h = 12, m = 0
    while (h < 14 || (h === 14 && m === 0)) {
      slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
      m += 15
      if (m === 60) { h++; m = 0 }
    }
  }

  // Dinner (all days except Wednesday)
  if (day !== 3) {
    let h = 19, m = 0
    while (h < 22 || (h === 22 && m <= 30)) {
      slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
      m += 15
      if (m === 60) { h++; m = 0 }
    }
  }

  return slots
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const date = searchParams.get('date')

  if (!date) {
    return NextResponse.json({ error: 'Date required' }, { status: 400 })
  }

  // Check if entire day is blocked
  const { data: blockedDay } = await supabaseAdmin
    .from('blocked_slots')
    .select('id')
    .eq('date', date)
    .is('time', null)
    .single()

  if (blockedDay) {
    return NextResponse.json({ slots: [] })
  }

  // Get blocked individual slots
  const { data: blockedSlots } = await supabaseAdmin
    .from('blocked_slots')
    .select('time')
    .eq('date', date)
    .not('time', 'is', null)

  const blockedTimes = new Set((blockedSlots || []).map((b) => b.time))

  // Get existing bookings for the date
  const { data: bookings } = await supabaseAdmin
    .from('bookings')
    .select('time, covers')
    .eq('date', date)

  // Sum covers per slot
  const coversBySlot: Record<string, number> = {}
  for (const b of bookings || []) {
    coversBySlot[b.time] = (coversBySlot[b.time] || 0) + Number(b.covers)
  }

  // Build available slots
  const allSlots = generateSlots(date)
  const available = allSlots.filter((slot) => {
    if (blockedTimes.has(slot)) return false
    const booked = coversBySlot[slot] || 0
    return booked < 6
  })

  return NextResponse.json({ slots: available })
}

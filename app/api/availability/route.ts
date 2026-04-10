import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

type Hours = {
  dinner_open: string
  dinner_close: string
  lunch_open: string
  lunch_close: string
  closed_day: number
  lunch_day: number
}

const DEFAULT_HOURS: Hours = {
  dinner_open: '19:00',
  dinner_close: '22:30',
  lunch_open: '12:00',
  lunch_close: '14:00',
  closed_day: 3,
  lunch_day: 0,
}

function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

function minutesToTime(mins: number): string {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

function parseDayOfWeek(date: string): number {
  // Parse YYYY-MM-DD components directly — avoids UTC-midnight timezone ambiguity
  const [y, mo, d] = date.split('-').map(Number)
  return new Date(y, mo - 1, d).getDay()
}

function generateSlots(date: string, hours: Hours): string[] {
  const day = parseDayOfWeek(date)
  const slots: string[] = []

  if (day === hours.lunch_day) {
    let mins = timeToMinutes(hours.lunch_open)
    const end = timeToMinutes(hours.lunch_close)
    while (mins <= end) {
      slots.push(minutesToTime(mins))
      mins += 15
    }
  }

  if (day !== hours.closed_day) {
    let mins = timeToMinutes(hours.dinner_open)
    const end = timeToMinutes(hours.dinner_close)
    while (mins <= end) {
      slots.push(minutesToTime(mins))
      mins += 15
    }
  }

  return slots
}

export async function GET(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { searchParams } = new URL(req.url)
  const date = searchParams.get('date')

  if (!date) {
    return NextResponse.json({ error: 'Date required' }, { status: 400 })
  }

  const { data: blockedDay } = await supabase
    .from('blocked_slots')
    .select('id')
    .eq('date', date)
    .is('time', null)
    .single()

  if (blockedDay) {
    return NextResponse.json({ slots: [] })
  }

  const { data: blockedSlots } = await supabase
    .from('blocked_slots')
    .select('time')
    .eq('date', date)
    .not('time', 'is', null)

  const blockedTimes = new Set((blockedSlots || []).map((b) => b.time))

  const { data: bookings } = await supabase
    .from('bookings')
    .select('time, covers')
    .eq('date', date)
    .eq('status', 'confirmed')

  const coversBySlot: Record<string, number> = {}
  for (const b of bookings || []) {
    coversBySlot[b.time] = (coversBySlot[b.time] || 0) + Number(b.covers)
  }

  const { data: settingsRow } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'opening_hours')
    .single()

  const hours: Hours = settingsRow?.value ? JSON.parse(settingsRow.value) : DEFAULT_HOURS
  const allSlots = generateSlots(date, hours)

  const available = allSlots.filter((slot) => {
    if (blockedTimes.has(slot)) return false
    const booked = coversBySlot[slot] || 0
    return booked < 6
  })

  return NextResponse.json({ slots: available })
}

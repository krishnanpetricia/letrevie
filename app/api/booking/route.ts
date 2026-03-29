import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { supabaseAdmin } from '@/lib/supabase'

const resend = new Resend(process.env.RESEND_API_KEY)
const RESTAURANT_EMAIL = process.env.RESTAURANT_EMAIL!
const FROM_EMAIL = process.env.FROM_EMAIL!

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, date, time, covers, lang, notes } = await req.json()

    if (!name || !email || !date || !time || !covers) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check capacity for this slot
    const { data: existing } = await supabaseAdmin
      .from('bookings')
      .select('covers')
      .eq('date', date)
      .eq('time', time)

    const alreadyBooked = (existing || []).reduce((sum, b) => sum + Number(b.covers), 0)

    if (alreadyBooked + Number(covers) > 6) {
      return NextResponse.json({ error: 'Sorry, this slot is no longer available. Please choose another time.' }, { status: 409 })
    }

    // Check if slot is blocked
    const { data: blocked } = await supabaseAdmin
      .from('blocked_slots')
      .select('id')
      .eq('date', date)
      .or(`time.is.null,time.eq.${time}`)

    if (blocked && blocked.length > 0) {
      return NextResponse.json({ error: 'This slot is not available.' }, { status: 409 })
    }

    // Save booking to database
    const { error: insertError } = await supabaseAdmin
      .from('bookings')
      .insert({ name, email, phone, date, time, covers, lang, notes })

    if (insertError) {
      console.error('Insert error:', insertError)
      return NextResponse.json({ error: 'Failed to save booking' }, { status: 500 })
    }

    const isIt = lang === 'it'

    const restaurantHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fdf8f3;">
        <div style="padding: 36px; background: #181410;">
          <h1 style="color: #f5e6d3; font-size: 24px; margin: 0;">Le Tre Vie</h1>
          <p style="color: rgba(255,255,255,0.5); margin: 4px 0 0;">Nuova prenotazione</p>
        </div>
        <div style="padding: 36px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 16px;">
            <tr><td style="color: #6b5d4f; padding: 8px 0;">Nome</td><td><strong>${name}</strong></td></tr>
            <tr><td style="color: #6b5d4f; padding: 8px 0;">Email</td><td><a href="mailto:${email}" style="color: #b5522a;">${email}</a></td></tr>
            <tr><td style="color: #6b5d4f; padding: 8px 0;">Telefono</td><td>${phone || '—'}</td></tr>
            <tr><td style="color: #6b5d4f; padding: 8px 0;">Data</td><td><strong>${date}</strong></td></tr>
            <tr><td style="color: #6b5d4f; padding: 8px 0;">Ora</td><td><strong>${time}</strong></td></tr>
            <tr><td style="color: #6b5d4f; padding: 8px 0;">Coperti</td><td><strong>${covers}</strong></td></tr>
            ${notes ? `<tr><td style="color: #6b5d4f; padding: 8px 0;">Note</td><td>${notes}</td></tr>` : ''}
          </table>
        </div>
        <div style="padding: 20px 36px; background: #181410; color: rgba(255,255,255,0.4); font-size: 12px;">
          Osteria Le Tre Vie · Via Crocifisso 4, Taormina · +39 352 041 5653
        </div>
      </div>
    `

    const customerHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fdf8f3;">
        <div style="padding: 36px; background: #181410;">
          <h1 style="color: #f5e6d3; font-size: 24px; margin: 0;">Le Tre Vie</h1>
          <p style="color: rgba(255,255,255,0.5); margin: 4px 0 0;">Osteria · Taormina</p>
        </div>
        <div style="padding: 36px;">
          <p style="font-size: 18px; color: #181410;">${isIt ? `Caro/a ${name},` : `Dear ${name},`}</p>
          <p style="font-size: 16px; line-height: 1.8; color: #6b5d4f;">
            ${isIt ? 'La sua prenotazione è confermata.' : 'Your reservation is confirmed.'}
          </p>
          <div style="background: #f0e8df; border-radius: 8px; padding: 24px; margin: 24px 0;">
            <table style="width: 100%; border-collapse: collapse; font-size: 16px;">
              <tr><td style="color: #6b5d4f; padding: 6px 0;">${isIt ? 'Data' : 'Date'}</td><td><strong>${date}</strong></td></tr>
              <tr><td style="color: #6b5d4f; padding: 6px 0;">${isIt ? 'Ora' : 'Time'}</td><td><strong>${time}</strong></td></tr>
              <tr><td style="color: #6b5d4f; padding: 6px 0;">${isIt ? 'Coperti' : 'Guests'}</td><td><strong>${covers}</strong></td></tr>
            </table>
          </div>
          <p style="font-size: 16px; line-height: 1.8; color: #6b5d4f;">
            ${isIt ? 'Per qualsiasi domanda, ci contatti direttamente:' : 'For any questions, reach us directly:'}
          </p>
          <p style="font-size: 16px; color: #181410;">
            📞 <a href="tel:+393520415653" style="color: #b5522a; text-decoration: none;">+39 352 041 5653</a><br>
            💬 <a href="https://wa.me/393520415653" style="color: #b5522a; text-decoration: none;">WhatsApp</a>
          </p>
        </div>
        <div style="padding: 20px 36px; background: #181410; color: rgba(255,255,255,0.4); font-size: 12px;">
          Osteria Le Tre Vie · Via Crocifisso 4, Taormina 98039 · +39 352 041 5653
        </div>
      </div>
    `

    await Promise.all([
      resend.emails.send({
        from: `Le Tre Vie <${FROM_EMAIL}>`,
        to: RESTAURANT_EMAIL,
        replyTo: email,
        subject: `Prenotazione: ${name} — ${date} ore ${time} — ${covers} ${Number(covers) === 1 ? 'coperto' : 'coperti'}`,
        html: restaurantHtml,
      }),
      resend.emails.send({
        from: `Le Tre Vie <${FROM_EMAIL}>`,
        to: email,
        subject: isIt
          ? `Prenotazione confermata — Le Tre Vie, ${date} ore ${time}`
          : `Booking confirmed — Le Tre Vie, ${date} at ${time}`,
        html: customerHtml,
      }),
    ])

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Booking error:', err)
    return NextResponse.json({ error: 'Failed to process booking' }, { status: 500 })
  }
}

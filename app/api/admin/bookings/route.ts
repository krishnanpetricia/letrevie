import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { supabaseAdmin } from '@/lib/supabase'

const resend = new Resend(process.env.RESEND_API_KEY)
const RESTAURANT_EMAIL = process.env.RESTAURANT_EMAIL!
const FROM_EMAIL = process.env.FROM_EMAIL!

function formatDate(dateStr: string) {
  const [y, m, d] = dateStr.split('-')
  return `${d}/${m}/${y}`
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, date, time, covers, lang, notes } = await req.json()

    if (!name || !email || !date || !time || !covers) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data: existing } = await supabaseAdmin
      .from('bookings')
      .select('covers')
      .eq('date', date)
      .eq('time', time)

    const alreadyBooked = (existing || []).reduce((sum, b) => sum + Number(b.covers), 0)

    if (alreadyBooked + Number(covers) > 6) {
      return NextResponse.json({
        error: lang === 'it'
          ? 'Siamo spiacenti, questo orario non è più disponibile. Si prega di scegliere un altro orario.'
          : 'Sorry, this slot is no longer available. Please choose another time.'
      }, { status: 409 })
    }

    const { data: blocked } = await supabaseAdmin
      .from('blocked_slots')
      .select('id')
      .eq('date', date)
      .or(`time.is.null,time.eq.${time}`)

    if (blocked && blocked.length > 0) {
      return NextResponse.json({
        error: lang === 'it'
          ? 'Questo orario non è disponibile.'
          : 'This slot is not available.'
      }, { status: 409 })
    }

    const { error: insertError } = await supabaseAdmin
      .from('bookings')
      .insert({ name, email, phone, date, time, covers, lang, notes })

    if (insertError) {
      console.error('Insert error:', insertError)
      return NextResponse.json({ error: 'Failed to save booking' }, { status: 500 })
    }

    const displayDate = formatDate(date)
    const isIt = lang === 'it'

    const restaurantHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fdf8f3;">
        <div style="padding: 36px; background: #181410;">
          <h1 style="color: #f5e6d3; font-size: 24px; margin: 0;">Le Tre Vie</h1>
          <p style="color: rgba(255,255,255,0.5); margin: 4px 0 0;">Nuova prenotazione</p>
        </div>
        <div style="padding: 36px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 16px;">
            <tr><td style="color: #6b5d4f; padding: 8px 0; width: 120px;">Nome</td><td><strong>${name}</strong></td></tr>
            <tr><td style="color: #6b5d4f; padding: 8px 0;">Email</td><td><a href="mailto:${email}" style="color: #b5522a;">${email}</a></td></tr>
            <tr><td style="color: #6b5d4f; padding: 8px 0;">Telefono</td><td>${phone || '—'}</td></tr>
            <tr><td style="color: #6b5d4f; padding: 8px 0;">Data</td><td><strong>${displayDate}</strong></td></tr>
            <tr><td style="color: #6b5d4f; padding: 8px 0;">Ora</td><td><strong>${time}</strong></td></tr>
            <tr><td style="color: #6b5d4f; padding: 8px 0;">Coperti</td><td><strong>${covers}</strong></td></tr>
            <tr><td style="color: #6b5d4f; padding: 8px 0;">Lingua</td><td>${isIt ? 'Italiano' : 'English'}</td></tr>
            ${notes ? `<tr><td style="color: #6b5d4f; padding: 8px 0;">Note</td><td>${notes}</td></tr>` : ''}
          </table>
        </div>
        <div style="padding: 20px 36px; background: #181410; color: rgba(255,255,255,0.4); font-size: 12px;">
          Osteria Le Tre Vie · Via Crocifisso 4, Taormina · +39 352 041 5653
        </div>
      </div>
    `

    const walkingDirectionsIt = `
      <div style="background: #f0e8df; border-radius: 8px; padding: 24px; margin: 24px 0;">
        <p style="font-size: 14px; font-weight: bold; color: #181410; margin: 0 0 12px; text-transform: uppercase; letter-spacing: 0.05em;">Come raggiungerci a piedi</p>
        <p style="font-size: 14px; line-height: 1.8; color: #6b5d4f; margin: 0;">
          Dal corso principale di Taormina, imbocca Via Crocifisso. Siamo al numero 4, a pochi passi dalla Piazza del Duomo. Cerchi il portone in pietra lavica con il nostro nome.
        </p>
      </div>
    `

    const walkingDirectionsEn = `
      <div style="background: #f0e8df; border-radius: 8px; padding: 24px; margin: 24px 0;">
        <p style="font-size: 14px; font-weight: bold; color: #181410; margin: 0 0 12px; text-transform: uppercase; letter-spacing: 0.05em;">How to find us on foot</p>
        <p style="font-size: 14px; line-height: 1.8; color: #6b5d4f; margin: 0;">
          From Taormina's main corso, turn onto Via Crocifisso. We are at number 4, a short walk from Piazza del Duomo. Look for the lava stone doorway with our name.
        </p>
      </div>
    `

    const customerHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fdf8f3;">
        <div style="padding: 36px; background: #181410;">
          <h1 style="color: #f5e6d3; font-size: 24px; margin: 0;">Le Tre Vie</h1>
          <p style="color: rgba(255,255,255,0.5); margin: 4px 0 0;">Osteria · Taormina</p>
        </div>
        <div style="padding: 36px;">

          ${isIt ? `
            <p style="font-size: 18px; color: #181410;">Gentile ${name},</p>
            <p style="font-size: 16px; line-height: 1.8; color: #6b5d4f;">La sua prenotazione è confermata. Non vediamo l'ora di accoglierla.</p>
            <div style="background: #f0e8df; border-radius: 8px; padding: 24px; margin: 24px 0;">
              <table style="width: 100%; border-collapse: collapse; font-size: 16px;">
                <tr><td style="color: #6b5d4f; padding: 6px 0; width: 100px;">Data</td><td><strong>${displayDate}</strong></td></tr>
                <tr><td style="color: #6b5d4f; padding: 6px 0;">Ora</td><td><strong>${time}</strong></td></tr>
                <tr><td style="color: #6b5d4f; padding: 6px 0;">Coperti</td><td><strong>${covers}</strong></td></tr>
              </table>
            </div>
            ${walkingDirectionsIt}
            <p style="font-size: 16px; line-height: 1.8; color: #6b5d4f;">Per qualsiasi domanda, non esiti a contattarci:</p>
            <p style="font-size: 16px; color: #181410;">
              📞 <a href="tel:+393520415653" style="color: #b5522a; text-decoration: none;">+39 352 041 5653</a><br>
              💬 <a href="https://wa.me/393520415653" style="color: #b5522a; text-decoration: none;">WhatsApp</a>
            </p>
          ` : `
            <p style="font-size: 18px; color: #181410;">Dear ${name},</p>
            <p style="font-size: 16px; line-height: 1.8; color: #6b5d4f;">Your reservation is confirmed. We look forward to welcoming you.</p>
            <div style="background: #f0e8df; border-radius: 8px; padding: 24px; margin: 24px 0;">
              <table style="width: 100%; border-collapse: collapse; font-size: 16px;">
                <tr><td style="color: #6b5d4f; padding: 6px 0; width: 100px;">Date</td><td><strong>${displayDate}</strong></td></tr>
                <tr><td style="color: #6b5d4f; padding: 6px 0;">Time</td><td><strong>${time}</strong></td></tr>
                <tr><td style="color: #6b5d4f; padding: 6px 0;">Guests</td><td><strong>${covers}</strong></td></tr>
              </table>
            </div>
            ${walkingDirectionsEn}
            <p style="font-size: 16px; line-height: 1.8; color: #6b5d4f;">For any questions, please reach us directly:</p>
            <p style="font-size: 16px; color: #181410;">
              📞 <a href="tel:+393520415653" style="color: #b5522a; text-decoration: none;">+39 352 041 5653</a><br>
              💬 <a href="https://wa.me/393520415653" style="color: #b5522a; text-decoration: none;">WhatsApp</a>
            </p>
          `}

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
        subject: `Prenotazione: ${name} — ${displayDate} ore ${time} — ${covers} ${Number(covers) === 1 ? 'coperto' : 'coperti'}`,
        html: restaurantHtml,
      }),
      resend.emails.send({
        from: `Le Tre Vie <${FROM_EMAIL}>`,
        to: email,
        subject: isIt
          ? `Prenotazione confermata — Le Tre Vie, ${displayDate} ore ${time}`
          : `Booking confirmed — Le Tre Vie, ${displayDate} at ${time}`,
        html: customerHtml,
      }),
    ])

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Booking error:', err)
    return NextResponse.json({ error: 'Failed to process booking' }, { status: 500 })
  }
}

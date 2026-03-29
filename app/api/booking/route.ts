import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY ?? 'placeholder')

const RESTAURANT_EMAIL = process.env.RESTAURANT_EMAIL ?? 'info@letrevietaormina.com'
const FROM_EMAIL       = process.env.FROM_EMAIL       ?? 'prenotazioni@letrevietaormina.com'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, date, time, covers, notes, lang } = body

    const isIt = lang === 'it'

    // ── Email to restaurant ──────────────────────────────────────
    const restaurantHtml = `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #181410;">
        <div style="background: #181410; padding: 28px 36px;">
          <h1 style="color: #e8c46a; font-size: 22px; font-weight: 300; letter-spacing: 0.1em; margin: 0;">
            Le Tre Vie — Nuova Prenotazione
          </h1>
        </div>
        <div style="padding: 36px; background: #faf7f2; border: 1px solid #ede7db;">
          <table style="width: 100%; border-collapse: collapse; font-size: 16px; line-height: 1.8;">
            <tr><td style="color: #6b5d4f; width: 140px; padding: 8px 0; border-bottom: 1px solid #ede7db;">Nome</td>
                <td style="font-weight: 600; padding: 8px 0; border-bottom: 1px solid #ede7db;">${name}</td></tr>
            <tr><td style="color: #6b5d4f; padding: 8px 0; border-bottom: 1px solid #ede7db;">Email</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #ede7db;"><a href="mailto:${email}" style="color: #b5522a;">${email}</a></td></tr>
            <tr><td style="color: #6b5d4f; padding: 8px 0; border-bottom: 1px solid #ede7db;">Telefono</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #ede7db;">${phone || '—'}</td></tr>
            <tr><td style="color: #6b5d4f; padding: 8px 0; border-bottom: 1px solid #ede7db;">Data</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #ede7db;"><strong>${date}</strong></td></tr>
            <tr><td style="color: #6b5d4f; padding: 8px 0; border-bottom: 1px solid #ede7db;">Ora</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #ede7db;"><strong>${time}</strong></td></tr>
            <tr><td style="color: #6b5d4f; padding: 8px 0; border-bottom: 1px solid #ede7db;">Coperti</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #ede7db;"><strong>${covers}</strong></td></tr>
            ${notes ? `<tr><td style="color: #6b5d4f; padding: 8px 0; vertical-align: top;">Note</td>
                <td style="padding: 8px 0;">${notes}</td></tr>` : ''}
          </table>
          <div style="margin-top: 32px; padding: 20px; background: #b5522a; text-align: center;">
            <a href="mailto:${email}?subject=Conferma%20prenotazione%20Le%20Tre%20Vie%20—%20${encodeURIComponent(date)}%20ore%20${encodeURIComponent(time)}&body=Gentile%20${encodeURIComponent(name)}%2C%0A%0AConfermiamo%20la%20sua%20prenotazione%20per%20${covers}%20persone%20il%20${encodeURIComponent(date)}%20alle%20ore%20${encodeURIComponent(time)}.%0A%0ACi%20vediamo%20presto!%0A%0ALe%20Tre%20Vie"
               style="color: white; font-size: 13px; letter-spacing: 0.2em; text-transform: uppercase; text-decoration: none; font-family: Arial, sans-serif;">
              Rispondi e Conferma →
            </a>
          </div>
        </div>
        <div style="padding: 20px 36px; background: #181410; color: rgba(255,255,255,0.4); font-size: 12px; font-family: Arial, sans-serif;">
          Le Tre Vie · Via Crocifisso 4, Taormina 98039
        </div>
      </div>
    `

    // ── Email to customer ──────────────────────────────────────
    const customerHtml = `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #181410;">
        <div style="background: #181410; padding: 28px 36px;">
          <h1 style="color: #e8c46a; font-size: 22px; font-weight: 300; letter-spacing: 0.1em; margin: 0;">
            ${isIt ? 'Grazie, ' + name : 'Thank you, ' + name}
          </h1>
        </div>
        <div style="padding: 36px; background: #faf7f2; border: 1px solid #ede7db;">
          <p style="font-size: 18px; line-height: 1.8; color: #6b5d4f; margin-top: 0;">
            ${isIt
              ? `La sua prenotazione per <strong>${covers}</strong> ${Number(covers) === 1 ? 'persona' : 'persone'} è confermata per il <strong>${date}</strong> alle ore <strong>${time}</strong>.`
              : `Your table for <strong>${covers}</strong> ${Number(covers) === 1 ? 'guest' : 'guests'} is confirmed for <strong>${date}</strong> at <strong>${time}</strong>.`}
          </p>

          <div style="border-left: 3px solid #b5522a; padding: 16px 24px; margin: 28px 0; background: white;">
            <table style="width: 100%; border-collapse: collapse; font-size: 16px; line-height: 2;">
              <tr>
                <td style="color: #6b5d4f; width: 120px;">${isIt ? 'Data' : 'Date'}</td>
                <td><strong>${date}</strong></td>
              </tr>
              <tr>
                <td style="color: #6b5d4f;">${isIt ? 'Ora' : 'Time'}</td>
                <td><strong>${time}</strong></td>
              </tr>
              <tr>
                <td style="color: #6b5d4f;">${isIt ? 'Coperti' : 'Guests'}</td>
                <td><strong>${covers}</strong></td>
              </tr>
            </table>
          </div>

          <p style="font-size: 16px; line-height: 1.8; color: #6b5d4f;">
            ${isIt
              ? 'Nel frattempo, se ha domande può contattarci direttamente:'
              : 'In the meantime, if you have any questions please reach us directly:'}
          </p>
          <p style="font-size: 16px; line-height: 1.8; color: #181410;">
            📞 <a href="tel:+393520415653" style="color: #b5522a; text-decoration: none;">+39 352 041 5653</a><br>
            💬 <a href="https://wa.me/393520415653" style="color: #b5522a; text-decoration: none;">WhatsApp</a>
          </p>
        </div>
        <div style="padding: 20px 36px; background: #181410; color: rgba(255,255,255,0.4); font-size: 12px; font-family: Arial, sans-serif;">
          Osteria Le Tre Vie · Via Crocifisso 4, Taormina 98039 · +39 352 041 5653
        </div>
      </div>
    `

    // Send both emails in parallel
    await Promise.all([
      resend.emails.send({
        from:    `Le Tre Vie <${FROM_EMAIL}>`,
        to:      RESTAURANT_EMAIL,
        replyTo: email,
        subject: `Prenotazione: ${name} — ${date} ore ${time} — ${covers} ${Number(covers) === 1 ? 'coperto' : 'coperti'}`,
        html:    restaurantHtml,
      }),
      resend.emails.send({
        from:    `Le Tre Vie <${FROM_EMAIL}>`,
        to:      email,
        subject: isIt
          ? `Prenotazione confermata — Le Tre Vie, ${date} ore ${time}`
          : `Booking confirmed — Le Tre Vie, ${date} at ${time}`,
        html:    customerHtml,
      }),
    ])

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Booking email error:', err)
    return NextResponse.json({ success: false, error: 'Failed to send' }, { status: 500 })
  }
}

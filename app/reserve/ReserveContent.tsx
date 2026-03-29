'use client'

import { T }           from '@/components/T'
import { FadeIn }      from '@/components/FadeIn'
import BookingForm from './BookingForm'

const TRUST = [
  {
    icon: '🕐',
    label: 'Dinner hours',    labelIt: 'Orario cena',
    value: '19:00 – 22:30',  valueIt: '19:00 – 22:30',
    note:  'Daily except Wednesday', noteIt: 'Tutti i giorni eccetto mercoledì',
  },
  {
    icon: '☀️',
    label: 'Sunday lunch',   labelIt: 'Pranzo domenicale',
    value: '12:00 – 14:00',  valueIt: '12:00 – 14:00',
    note:  'Sundays only',   noteIt: 'Solo la domenica',
  },
  {
    icon: '📍',
    label: 'Address',        labelIt: 'Indirizzo',
    value: 'Via Crocifisso 4, Taormina',
    valueIt: 'Via Crocifisso 4, Taormina',
    note: '6 min from Porta Catania · Free parking',
    noteIt: '6 min da Porta Catania · Parcheggio gratuito',
  },
]

export function ReserveContent() {
  return (
    <div className="min-h-screen bg-cream">

      <div className="bg-ink pt-36 pb-16 px-6 text-center">
        <FadeIn>
          <span className="block text-gold text-[10px] tracking-[0.38em] uppercase font-normal mb-5">
            Osteria Le Tre Vie — Taormina
          </span>
          <h1
            className="font-cormorant font-light text-white leading-[1.08] mb-5"
            style={{ fontSize: 'clamp(38px, 6vw, 72px)' }}
          >
            <T
              en={<>Reserve<br /><em>your table.</em></>}
              it={<>Prenota<br /><em>il tuo tavolo.</em></>}
            />
          </h1>
          <p className="text-white/70 text-[17px] font-light leading-relaxed max-w-md mx-auto">
            <T
              en="Choose your date and time below. We confirm by email within a few hours."
              it="Scegli data e orario qui sotto. Confermiamo via email entro poche ore."
            />
          </p>
        </FadeIn>
      </div>

      <div className="bg-terra">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/15">
          {TRUST.map(({ icon, label, labelIt, value, valueIt, note, noteIt }) => (
            <div key={label} className="px-8 py-5 text-center">
              <span className="text-[18px] mb-2 block">{icon}</span>
              <span className="block text-white/60 text-[9px] tracking-[0.28em] uppercase mb-1">
                <T en={label} it={labelIt} />
              </span>
              <span className="block text-white font-cormorant text-[17px] leading-snug">
                <T en={value} it={valueIt} />
              </span>
              <span className="block text-white/80 text-[14px] mt-0.5">
                <T en={note} it={noteIt} />
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-20">
        <FadeIn>
          <BookingForm />
        </FadeIn>
      </div>

      <div className="border-t border-black/8 py-14 px-6">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-ink-mid text-[15px]">
            <T
              en="Prefer to call or message us directly?"
              it="Preferisce chiamarci o scriverci direttamente?"
            />
          </p>
          <div className="flex gap-3 flex-wrap">
            <a href="tel:+393520415653"
              className="flex items-center gap-2 bg-ink text-white text-[11px] tracking-[0.18em] uppercase px-6 py-3 no-underline hover:bg-ink/80 transition-colors duration-200">
              📞 +39 352 041 5653
            </a>
            <a href="https://wa.me/393520415653" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-terra text-white text-[11px] tracking-[0.18em] uppercase px-6 py-3 no-underline hover:bg-terra-deep transition-colors duration-200">
              💬 WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="bg-cream-dark py-16 px-6">
        <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
          {[
            { heading: 'Free cancellation', headingIt: 'Cancellazione gratuita',
              body: 'Plans change. Let us know 24 hours ahead.',
              bodyIt: 'I piani cambiano. Avvisaci con 24 ore di anticipo.' },
            { heading: 'Confirmed by email', headingIt: 'Conferma via email',
              body: "You'll hear from us within a few hours of your request.",
              bodyIt: 'Riceverai una risposta entro poche ore dalla richiesta.' },
            { heading: 'Free parking', headingIt: 'Parcheggio gratuito',
              body: 'One of the few restaurants in Taormina with on-site parking.',
              bodyIt: "Uno dei pochi ristoranti di Taormina con parcheggio in loco." },
          ].map(({ heading, headingIt, body, bodyIt }) => (
            <div key={heading}>
              <span className="block text-terra text-[9px] tracking-[0.32em] uppercase mb-3">
                <T en={heading} it={headingIt} />
              </span>
              <p className="text-ink-mid text-[15px] leading-relaxed font-light">
                <T en={body} it={bodyIt} />
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

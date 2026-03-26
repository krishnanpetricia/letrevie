'use client'

import { T } from './T'

export function BookingWidget() {
  return (
    <section id="reserve" className="bg-cream px-12 py-28 text-center border-t border-black/6">
      {/* Eyebrow */}
      <span className="block text-terra text-[9px] tracking-[0.34em] uppercase font-normal mb-5">
        <T en="Make a Reservation" it="Prenota un Tavolo" />
      </span>

      {/* Heading */}
      <h2
        className="font-cormorant font-light leading-[1.12] mb-4"
        style={{ fontSize: 'clamp(34px, 3.8vw, 54px)' }}
      >
        <T en="Book Your Table Online" it="Prenota Online" />
      </h2>

      {/* Sub */}
      <p className="text-ink-mid text-[17px] font-light leading-[1.8] max-w-[480px] mx-auto mb-14">
        <T
          en="Choose your date, party size and preferred time. Instant confirmation."
          it="Scegli la data, il numero di ospiti e l'orario preferito. Conferma immediata."
        />
      </p>

      {/*
       * ═══════════════════════════════════════════════════════════════
       * BOOKING WIDGET — replace this entire block when widget is ready
       *
       * Example embed (TheFork / ResDiary / Sevenrooms / etc.):
       *   <div id="booking-widget" data-restaurant-id="YOUR_ID" />
       *   <Script src="https://widget.provider.com/loader.js" />
       *
       * ═══════════════════════════════════════════════════════════════
       */}
      <div className="max-w-[760px] mx-auto border-2 border-dashed border-terra/22 bg-terra/[0.02] px-12 py-[72px]">
        <div className="text-4xl mb-5 opacity-55" aria-hidden="true">🗓</div>

        <p className="font-cormorant text-[24px] italic text-ink-mid mb-2.5">
          <T en="Online booking coming soon" it="Prenotazione online in arrivo" />
        </p>
        <p className="text-[11px] tracking-[0.14em] uppercase text-ink-mid/55 mb-10">
          <T
            en="Widget integration pending — reserve by phone in the meantime"
            it="Integrazione in corso — prenota per telefono nel frattempo"
          />
        </p>

        {/* Fallback CTAs */}
        <div className="flex gap-4 justify-center flex-wrap">
          <a
            href="tel:+393520415653"
            className="inline-block bg-terra hover:bg-terra-deep text-white text-[11px] tracking-[0.24em] uppercase px-10 py-[18px] transition-all duration-200 hover:-translate-y-0.5 no-underline"
          >
            <T en="Call +39 352 041 5653" it="Chiama +39 352 041 5653" />
          </a>
          <a
            href="https://wa.me/393520415653"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border border-terra text-terra hover:bg-terra hover:text-white text-[11px] tracking-[0.24em] uppercase px-10 py-[18px] transition-all duration-200 no-underline"
          >
            <T en="WhatsApp Us" it="WhatsApp" />
          </a>
        </div>
      </div>
    </section>
  )
}

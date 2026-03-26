'use client'

import { T } from './T'

export function BookingCTA() {
  return (
    <section className="relative bg-terra px-12 py-28 text-center overflow-hidden">
      {/* Texture overlay */}
      <div className="absolute inset-0 cta-texture" aria-hidden="true" />

      <div className="relative">
        <h2
          className="font-cormorant font-light text-white leading-[1.1] mb-4"
          style={{ fontSize: 'clamp(38px, 5.5vw, 72px)' }}
        >
          <T
            en={<>Taormina fills up fast.<br /><em>Especially in season.</em></>}
            it={<>Taormina si riempie in fretta.<br /><em>Soprattutto in stagione.</em></>}
          />
        </h2>

        <p className="text-white/80 text-[19px] font-light leading-[1.78] max-w-[500px] mx-auto mb-14">
          <T
            en="Tables go quickly during summer. Secure yours before you arrive."
            it="I tavoli vanno in fretta in estate. Prenota il tuo prima di arrivare."
          />
        </p>

        {/* Primary CTA */}
        <a
          href="/reserve"
          className="inline-block bg-white text-terra hover:bg-cream font-medium text-[11px] tracking-[0.24em] uppercase px-[68px] py-5 transition-all duration-200 hover:-translate-y-0.5 no-underline"
        >
          <T en="Reserve Online" it="Prenota Online" />
        </a>

        {/* Secondary options */}
        <div className="mt-8 flex justify-center gap-9 flex-wrap">
          <a
            href="tel:+393520415653"
            className="text-white hover:text-white text-[11px] tracking-[0.18em] uppercase border-b border-white hover:border-white pb-0.5 transition-all duration-200 no-underline"
          >
            <T en="Call us: +39 352 041 5653" it="Chiamaci: +39 352 041 5653" />
          </a>
          <a
            href="https://wa.me/393520415653"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-white text-[11px] tracking-[0.18em] uppercase border-b border-white hover:border-white pb-0.5 transition-all duration-200 no-underline"
          >
            <T en="WhatsApp us" it="Scrivici su WhatsApp" />
          </a>
        </div>
      </div>
    </section>
  )
}

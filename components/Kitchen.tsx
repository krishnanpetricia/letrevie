'use client'

import { T } from './T'
import { FadeIn } from './FadeIn'

export function Kitchen() {
  return (
    <section id="kitchen" className="bg-ink grid grid-cols-1 min-h-[520px]">
      {/* Copy */}
      <FadeIn className="flex flex-col justify-center px-8 py-14 md:px-20 md:py-[90px]">
        <span className="text-gold text-[9px] tracking-[0.34em] uppercase font-normal mb-5">
          <T en="The Kitchen" it="La Cucina" />
        </span>

        <h2
          className="font-cormorant font-light text-white leading-[1.12] mb-6"
          style={{ fontSize: 'clamp(34px, 3.8vw, 54px)' }}
        >
          <T
            en={<>Forty years<br /><em>at the stove.</em></>}
            it={<>Quarant&apos;anni<br /><em>di cucina.</em></>}
          />
        </h2>

        <T
          en={
            <div className="space-y-5">
              <p className="text-[19px] leading-[1.85] text-white/75">
                Rosario, owner and chef, has spent forty years mastering the art of fine cuisine in Taormina.
                He doesn&apos;t follow current trends; his passion lies in the quality of the ingredients
                and the meticulous preparation.
              </p>
              <p className="text-[19px] leading-[1.85] text-white/75">
                The kind of food that makes you slow down and order another glass.
              </p>
            </div>
          }
          it={
            <div className="space-y-5">
              <p className="text-[19px] leading-[1.85] text-white/75">
                Rosario, Proprietario e Chef, ha dedicato una vita intera a imparare l&apos;arte della buona
                cucina. Non insegue le mode del momento; la sua passione è tutta per la qualità degli
                ingredienti e la cura nella preparazione.
              </p>
              <p className="text-[19px] leading-[1.85] text-white/75">
                È quel tipo di cucina che ti spinge a rallentare e ad ordinare un altro calice.
              </p>
            </div>
          }
        />

        <a
          href="/reserve"
          className="mt-9 self-start text-[11px] tracking-[0.22em] uppercase kitchen-link border-b pb-0.5 transition-colors duration-200 no-underline"
        >
          <T en="Book Your Table →" it="Prenota il Tuo Tavolo →" />
        </a>
        <a
          href="/reserve"
          className="mt-4 self-start text-[11px] tracking-[0.22em] uppercase text-white/50 hover:text-white/90 border-b border-white/20 hover:border-white/50 pb-0.5 transition-colors duration-200 no-underline"
        >
          <T en="About Rosario & the restaurant →" it="La nostra storia →" />
        </a>
      </FadeIn>
    </section>
  )
}

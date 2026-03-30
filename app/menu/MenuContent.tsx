'use client'

import { PageHero } from '@/components/PageHero'
import { T }        from '@/components/T'
import { FadeIn }   from '@/components/FadeIn'

const MENU_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/menus/menu.pdf`

export function MenuContent() {
  return (
    <>
      <PageHero
        eyebrow="Osteria Le Tre Vie — Taormina"
        title={<T en={<><em>What we</em><br />cook today.</>} it={<><em>Quello che</em><br />cuciniamo oggi.</>} />}
        subtitle={
          <T
            en="Our menu follows the season and the market. Dishes may change without notice — that is how we like it."
            it="Il nostro menù segue la stagione e il mercato. I piatti possono variare — è così che ci piace."
          />
        }
        bgImage="/images/dish-tuna.jpg"
      />

      <section className="bg-cream pt-20 pb-24 px-6">
        <div className="max-w-3xl mx-auto text-center">

          <FadeIn delay={0}>
            <p className="font-cormorant text-[22px] italic text-ink-mid mb-10">
              <T
                en="Our full menu is available to download below."
                it="Il nostro menù completo è disponibile qui sotto."
              />
            </p>

            
              href={MENU_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-terra hover:bg-terra-deep text-white text-[11px] tracking-[0.24em] uppercase px-14 py-5 transition-all duration-200 hover:-translate-y-0.5 no-underline"
            >
              <T en="View the Menu" it="Scarica il Menù" />
            </a>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="mt-20 pt-10 border-t border-black/8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-[14px] text-ink-mid leading-relaxed text-left">
              <p>
                <span className="block text-[9px] tracking-[0.28em] uppercase text-terra mb-2">
                  <T en="Dietary" it="Diete" />
                </span>
                <T
                  en="Please inform your server of any allergies before ordering."
                  it="Informate il vostro cameriere di eventuali allergie prima di ordinare."
                />
              </p>
              <p>
                <span className="block text-[9px] tracking-[0.28em] uppercase text-terra mb-2">
                  <T en="Covers" it="Coperto" />
                </span>
                <T
                  en="Cover charge €2.50 per person."
                  it="Coperto €2.50 a persona."
                />
              </p>
              <p>
                <span className="block text-[9px] tracking-[0.28em] uppercase text-terra mb-2">
                  <T en="Seasonal" it="Stagionalità" />
                </span>
                <T
                  en="Menus change with the season. Prices include VAT."
                  it="I menù cambiano con le stagioni. I prezzi includono l'IVA."
                />
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.2} className="mt-16">
            <p className="font-cormorant text-[22px] italic text-ink-mid mb-6">
              <T en="Ready to sit down?" it="Pronti a sedervi?" />
            </p>
            
              href="/reserve"
              className="inline-block bg-terra hover:bg-terra-deep text-white text-[11px] tracking-[0.24em] uppercase px-14 py-5 transition-all duration-200 hover:-translate-y-0.5 no-underline"
            >
              <T en="Reserve Your Table" it="Prenota il Tuo Tavolo" />
            </a>
          </FadeIn>

        </div>
      </section>
    </>
  )
}

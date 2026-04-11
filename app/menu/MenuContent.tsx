'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { PageHero } from '@/components/PageHero'
import { T } from '@/components/T'
import { FadeIn } from '@/components/FadeIn'

const STORAGE_BASE = process.env.NEXT_PUBLIC_SUPABASE_URL + '/storage/v1/object/public/menus/'

const BASE_URLS = {
  menu:   STORAGE_BASE + 'menu.pdf',
  piatti: STORAGE_BASE + 'piatti-del-giorno.pdf',
  vini:   STORAGE_BASE + 'carta-dei-vini.pdf',
}

export function MenuContent() {
  const [urls, setUrls] = useState(BASE_URLS)

  useEffect(() => {
    supabase
      .from('site_settings')
      .select('key, value')
      .in('key', ['menu_last_updated', 'piatti_last_updated', 'vini_last_updated'])
      .then(({ data }) => {
        if (!data) return
        const byKey = Object.fromEntries(data.map(r => [r.key, r.value]))
        setUrls({
          menu:   byKey.menu_last_updated   ? `${BASE_URLS.menu}?v=${byKey.menu_last_updated}`     : BASE_URLS.menu,
          piatti: byKey.piatti_last_updated ? `${BASE_URLS.piatti}?v=${byKey.piatti_last_updated}` : BASE_URLS.piatti,
          vini:   byKey.vini_last_updated   ? `${BASE_URLS.vini}?v=${byKey.vini_last_updated}`     : BASE_URLS.vini,
        })
      })
  }, [])

  const btnClass = 'inline-block bg-terra hover:bg-terra-deep text-white text-[11px] tracking-[0.24em] uppercase px-14 py-5 transition-all duration-200 hover:-translate-y-0.5 no-underline'

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
                en="Our menus are available to download below."
                it="I nostri menù sono disponibili qui sotto."
              />
            </p>

            <div className="flex flex-col items-center gap-5">
              <div className="text-center">
                <p className="text-[9px] tracking-[0.28em] uppercase text-terra mb-3">
                  <T en="Menu" it="Menù" />
                </p>
                <a href={urls.menu} target="_blank" rel="noopener noreferrer" className={btnClass}>
                  <T en="View the Menu" it="Scarica il Menù" />
                </a>
              </div>

              <div className="text-center">
                <p className="text-[9px] tracking-[0.28em] uppercase text-terra mb-3">
                  <T en="Daily Dishes" it="Piatti del Giorno" />
                </p>
                <a href={urls.piatti} target="_blank" rel="noopener noreferrer" className={btnClass}>
                  <T en="View Today's Dishes" it="Piatti del Giorno" />
                </a>
              </div>

              <div className="text-center">
                <p className="text-[9px] tracking-[0.28em] uppercase text-terra mb-3">
                  <T en="Wine List" it="Carta dei Vini" />
                </p>
                <a href={urls.vini} target="_blank" rel="noopener noreferrer" className={btnClass}>
                  <T en="View the Wine List" it="Carta dei Vini" />
                </a>
              </div>
            </div>
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
            <a
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

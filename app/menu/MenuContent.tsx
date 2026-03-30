'use client'

import { PageHero } from '@/components/PageHero'
import { T } from '@/components/T'
import { FadeIn } from '@/components/FadeIn'

const MENU_URL = process.env.NEXT_PUBLIC_SUPABASE_URL + '/storage/v1/object/public/menus/menu.pdf'

export function MenuContent() {
  return (
    <div>
      <PageHero
        eyebrow="Osteria Le Tre Vie - Taormina"
        title={<T en="Our Menu" it="Il nostro Menu" />}
        subtitle={<T en="Our menu follows the season and the market." it="Il nostro menu segue la stagione e il mercato." />}
        bgImage="/images/dish-tuna.jpg"
      />
      <section className="bg-cream pt-20 pb-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <FadeIn delay={0}>
            <p className="font-cormorant text-[22px] italic text-ink-mid mb-10">
              <T en="Our full menu is available below." it="Il nostro menu completo e disponibile qui sotto." />
            </p>
            
              href={MENU_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-terra hover:bg-terra-deep text-white text-[11px] tracking-[0.24em] uppercase px-14 py-5 transition-all duration-200 hover:-translate-y-0.5 no-underline"
            >
              <T en="View the Menu" it="Scarica il Menu" />
            </a>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}

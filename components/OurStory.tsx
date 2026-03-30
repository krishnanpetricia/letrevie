'use client'

import Image from 'next/image'
import { T } from './T'
import { FadeIn } from './FadeIn'

const STORY_IMG = '/images/dining-room.jpg.jpeg'

export function OurStory() {
  return (
    <section id="story" className="grid grid-cols-1 md:grid-cols-2 min-h-[560px]">
      {/* Image */}
      <div className="relative overflow-hidden min-h-[320px] md:min-h-0 group">
        <Image
          src={STORY_IMG}
          alt="Osteria Le Tre Vie interior"
          fill
          className="object-cover object-center transition-transform duration-[1100ms] ease-out group-hover:scale-[1.04]"
          sizes="(max-width: 768px) 100vw, 50vw"
          loading="lazy"
        />
      </div>

      {/* Copy */}
      <FadeIn className="flex flex-col justify-center px-8 py-14 md:px-20 md:py-[90px] bg-cream">
        <span className="text-terra text-[9px] tracking-[0.34em] uppercase font-normal mb-5">
          <T en="About the Osteria" it="La Nostra Storia" />
        </span>

        <h2
          className="font-cormorant font-light leading-[1.12] mb-6"
          style={{ fontSize: 'clamp(34px, 3.8vw, 54px)' }}
        >
          <T
            en={<>Pull up<br /><em>a chair.</em></>}
            it={<>Siediti<br /><em>comodo.</em></>}
          />
        </h2>

        <div className="en-body space-y-5">
          <T
            en={
              <>
                <p className="text-[19px] leading-[1.85] text-ink-mid">
                  Le Tre Vie takes its name from the three ancient roads that once led into Taormina.
                  We liked the idea of being the place where those paths meet — somewhere to finally
                  sit down, share a bottle of wine, and let the evening go wherever it wants.
                </p>
                <p className="text-[19px] leading-[1.85] text-ink-mid">
                  Santi and Rosario opened the doors in 2018. For them, hospitality is not a strategy.
                  It is simply what they have done their entire lives. Whether you live down the street
                  or you are here for the first time, our door is open.
                </p>
              </>
            }
            it={
              <>
                <p className="text-[19px] leading-[1.85] text-ink-mid">
                  Le Tre Vie non è solo un ristorante, ma il sogno condiviso di tre cognati uniti da
                  un legame indissolubile e dall&apos;amore viscerale per la cucina autentica e il buon vino.
                  In questo angolo di Sicilia, il tempo sembra rallentare.
                </p>
                <p className="text-[19px] leading-[1.85] text-ink-mid">
                  Il calore umano di Santi e la maestria di Rosario nel trasformare le materie prime
                  locali in piatti sinceri e generosi — qui, ogni gesto segue il ritmo naturale di una
                  vita intera dedicata all&apos;ospitalità.
                </p>
              </>
            }
          />
        </div>

        <a
          href="/reserve"
          className="mt-9 self-start text-[11px] tracking-[0.22em] uppercase text-terra border-b border-terra pb-0.5 hover:text-terra-deep hover:border-terra-deep transition-colors duration-200 no-underline"
        >
          <T en="Reserve a Table →" it="Prenota un Tavolo →" />
        </a>
      </FadeIn>
    </section>
  )
}

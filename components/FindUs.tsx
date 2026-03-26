'use client'

import { T } from './T'
import { FadeIn } from './FadeIn'

export function FindUs() {
  return (
    <section id="find-us" className="grid grid-cols-1 md:grid-cols-2 min-h-[480px] bg-white">
      {/* Copy */}
      <FadeIn className="flex flex-col justify-center px-8 py-14 md:px-20 md:py-[90px]">
        <span className="text-terra text-[9px] tracking-[0.34em] uppercase font-normal mb-5">
          <T en="How to Find Us" it="Dove Siamo" />
        </span>

        <h2
          className="font-cormorant font-light leading-[1.12] mb-6"
          style={{ fontSize: 'clamp(34px, 3.8vw, 54px)' }}
        >
          <T
            en={<>You will find us<br /><em>easily.</em></>}
            it={<>Siamo facili<br /><em>da trovare.</em></>}
          />
        </h2>

        <T
          en={
            <p className="text-[19px] leading-[1.85] text-ink-mid">
              A six-minute walk from Porta Catania. Comfortable shoes are all you need.
              Coming by car, parking is free and right at our entrance — one of the few
              in Taormina. Coming by taxi, most local drivers know us well and will bring
              you straight to the door.
            </p>
          }
          it={
            <p className="text-[19px] leading-[1.85] text-ink-mid">
              Siamo a soli sei minuti a piedi da Porta Catania. Se venite in auto,
              disponiamo di un parcheggio gratuito proprio davanti all&apos;ingresso, una
              vera rarità a Taormina. La maggior parte dei conducenti locali ci conosce
              bene e vi porterà esattamente davanti alla porta.
            </p>
          }
        />

        {/* Contact rows */}
        <div className="mt-9 flex flex-col gap-4">
          {/* Address */}
          <div className="flex items-start gap-3.5">
            <svg
              className="w-[18px] shrink-0 text-terra mt-[3px]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            <div className="text-[17px] text-ink-mid leading-[1.7]">
              <strong className="block text-ink font-normal mb-0.5">
                Via Crocifisso 4, 98039 Taormina
              </strong>
              <T
                en="6 min walk from Porta Catania · Free parking on site"
                it="6 min a piedi da Porta Catania · Parcheggio gratuito"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-start gap-3.5">
            <svg
              className="w-[18px] shrink-0 text-terra mt-[3px]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
            <div className="text-[17px] text-ink-mid leading-[1.7]">
              <a
                href="tel:+393520415653"
                className="block text-ink font-normal hover:text-terra transition-colors duration-200 no-underline mb-0.5"
              >
                +39 352 041 5653
              </a>
              <T en="Phone &amp; WhatsApp" it="Telefono e WhatsApp" />
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Map */}
      <div className="relative min-h-[320px] md:min-h-0">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d994.5!2d15.2876!3d37.8519!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1312718c0a8d2f2f%3A0x0!2sVia+Crocifisso+4%2C+98039+Taormina+ME%2C+Italy!5e0!3m2!1sen!2sit!4v1"
          className="w-full h-full min-h-[320px] border-0 grayscale-[15%]"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Le Tre Vie on Google Maps"
        />
      </div>
    </section>
  )
}

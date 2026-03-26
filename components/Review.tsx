'use client'

import { T } from './T'

export function Review() {
  return (
    <section className="relative bg-cream-dark px-12 py-28 text-center overflow-hidden">
      {/* Decorative quote mark */}
      <div
        aria-hidden="true"
        className="absolute top-[-40px] left-1/2 -translate-x-1/2 font-cormorant italic text-terra/7 leading-none pointer-events-none select-none"
        style={{ fontSize: '320px' }}
      >
        &ldquo;
      </div>

      {/* Stars */}
      <span className="relative block text-terra text-[18px] tracking-[6px] mb-9">
        ★★★★★
      </span>

      {/* Quote */}
      <blockquote
        className="relative font-cormorant italic font-light text-ink leading-[1.48] max-w-[820px] mx-auto mb-7"
        style={{ fontSize: 'clamp(26px, 3.6vw, 46px)' }}
      >
        <T
          en='"The best meal we had in all of Sicily. We came back the next night and brought friends."'
          it='"Il miglior pasto di tutta la Sicilia. Siamo tornati la sera dopo e abbiamo portato gli amici."'
        />
      </blockquote>

      {/* Source */}
      <p className="relative text-ink-mid text-[11px] tracking-[0.24em] uppercase">
        TripAdvisor &nbsp;&middot;&nbsp; 4.8 / 5 &nbsp;&middot;&nbsp; 324{' '}
        <T en="reviews" it="recensioni" />
      </p>
    </section>
  )
}

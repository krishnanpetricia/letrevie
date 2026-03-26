'use client'

import { FadeIn } from './FadeIn'
import { T } from './T'

const items = [
  {
    delay: 0,
    label: <T en="Dinner" it="Cena" />,
    value: (
      <T
        en={<>19:00 – 22:30<br />Daily, except Wednesday</>}
        it={<>19:00 – 22:30<br />Tutti i giorni, eccetto mercoledì</>}
      />
    ),
  },
  {
    delay: 0.1,
    label: <T en="Sunday Lunch" it="Pranzo Domenicale" />,
    value: (
      <T
        en={<>12:00 – 14:00<br />Sundays only</>}
        it={<>12:00 – 14:00<br />Solo la domenica</>}
      />
    ),
  },
  {
    delay: 0.2,
    label: <T en="Closed" it="Giorno di Chiusura" />,
    value: <T en="Wednesdays" it="Il mercoledì" />,
  },
  {
    delay: 0.3,
    label: <T en="Reservations" it="Prenotazioni" />,
    value: (
      <a href="tel:+393520415653" className="text-white hover:text-gold transition-colors duration-200">
        +39 352 041 5653
      </a>
    ),
  },
]

export function Essentials() {
  return (
    <div className="bg-ink grid grid-cols-2 md:grid-cols-4">
      {items.map(({ delay, label, value }, i) => (
        <FadeIn key={i} delay={delay}>
          <div
            className={[
              'px-11 py-8',
              i < items.length - 1 ? 'border-r border-white/6' : '',
            ].join(' ')}
          >
            <span className="block text-gold text-[9px] tracking-[0.32em] uppercase font-normal mb-2.5">
              {label}
            </span>
            <div className="font-cormorant text-[18px] text-white leading-[1.65]">
              {value}
            </div>
          </div>
        </FadeIn>
      ))}
    </div>
  )
}

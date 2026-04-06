'use client'

import { T } from './T'

const SOCIAL = [
  { label: 'Instagram',   href: 'https://www.instagram.com/explore/locations/1948009408849490/osteria-pizzeria-le-tre-vie/' },
  { label: 'Facebook',    href: 'https://www.facebook.com/osterialetrevie/' },
  { label: 'TripAdvisor', href: 'https://www.tripadvisor.com/Restaurant_Review-g187892-d13944570-Reviews-Osteria_Pizzeria_Le_Tre_Vie-Taormina_Province_of_Messina_Sicily.html' },
]

export function Footer() {
  return (
    <footer className="bg-ink px-12 pt-16 pb-11">
      {/* Three-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 items-start">

        {/* Logo */}
        <div>
          <div className="font-cormorant text-[24px] font-light text-white tracking-[0.1em]">
            <em>Le</em> Tre Vie
          </div>
          <span className="block font-jost text-[10px] tracking-[0.28em] uppercase text-gold mt-2 font-light">
            Osteria · Taormina, Sicily
          </span>
        </div>

        {/* Address / hours */}
        <div className="md:text-center">
          <p className="text-[15px] text-white/80 leading-[1.9]">
            Via Crocifisso 4, Taormina 98039
            <br />
            <a
              href="tel:+393520415653"
              className="text-white/80 hover:text-white transition-colors duration-200 no-underline"
            >
              +39 352 041 5653
            </a>
            <br /><br />
            <T
              en={<>Dinner: 19:00–22:30 · Closed Wednesdays<br />Sunday Lunch: 12:00–14:00</>}
              it={<>Cena: 19:00–22:30 · Chiuso il mercoledì<br />Pranzo domenicale: 12:00–14:00</>}
            />
          </p>
        </div>

        {/* Social links */}
        <div className="md:text-right">
          <ul className="flex flex-col gap-2.5 md:items-end list-none">
            {SOCIAL.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] tracking-[0.18em] uppercase text-white/75 hover:text-white transition-colors duration-200 no-underline"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/12 pt-7 flex justify-between items-center gap-4 flex-wrap">
        <p className="text-[11px] text-white/60 tracking-[0.06em]">
          &copy; {new Date().getFullYear()} Osteria Le Tre Vie · Taormina, Sicily
        </p>
        <a
          href="/reserve"
          className="inline-block bg-terra hover:bg-terra-deep text-white text-[10px] tracking-[0.22em] uppercase px-7 py-3 transition-colors duration-200 no-underline"
        >
          <T en="Reserve a Table" it="Prenota un Tavolo" />
        </a>
      </div>
    </footer>
  )
}

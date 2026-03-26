'use client'

import Image from 'next/image'
import { T } from './T'

const dishes = [
  {
    src:  'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=700&q=80',
    alt:  'Pasta alle Sarde',
    cat:  <T en="First Course" it="Primo Piatto" />,
    name: 'Pasta alle Sarde',
  },
  {
    src:  '/images/dish-tuna.jpg',
    alt:  'Tonno in crosta di pistacchio',
    cat:  <T en="From the Sea" it="Dal Mare" />,
    name: <T en="Pistachio-Crusted Tuna" it="Tonno in Crosta di Pistacchio" />,
  },
  {
    src:  '/images/dish-dessert.jpg',
    alt:  'Semifreddo alla nocciola',
    cat:  <T en="Dessert" it="Dolce" />,
    name: <T en="Hazelnut Semifreddo" it="Semifreddo alla Nocciola" />,
  },
]

export function FoodGrid() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      {dishes.map(({ src, alt, cat, name }) => (
        <div key={src} className="relative overflow-hidden aspect-[4/3] group">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover object-center transition-transform duration-[900ms] ease-out group-hover:scale-[1.07]"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            loading="lazy"
          />
          {/* Gradient label */}
          <div
            className="absolute inset-x-0 bottom-0 pt-14 px-7 pb-6 z-10"
            style={{ background: 'linear-gradient(transparent, rgba(24,20,16,0.86))' }}
          >
            <span className="block text-gold text-[9px] tracking-[0.28em] uppercase font-normal mb-1.5">
              {cat}
            </span>
            <span className="block font-cormorant text-[22px] italic font-light text-white">
              {name}
            </span>
          </div>
        </div>
      ))}
    </section>
  )
}

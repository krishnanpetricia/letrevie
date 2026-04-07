'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { T } from './T'

const HERO_IMG = '/images/exterior.jpg'

export function Hero() {
  return (
    <section className="relative h-screen min-h-[640px] flex items-center justify-center text-center overflow-hidden">

      {/* Background — zooms out slowly */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.07 }}
          animate={{ scale: 1 }}
          transition={{ duration: 16, ease: 'easeOut' }}
        >
          <Image
            src={HERO_IMG}
            alt="Le Tre Vie — terrace and Sicilian cuisine"
            fill
            className="object-cover object-right md:object-center"
            priority
            sizes="100vw"
          />
        </motion.div>
        {/* Gradient overlay */}
        <div className="absolute inset-0 z-10 hero-overlay" />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-20 px-8 max-w-[960px]"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
      >
        {/* Eyebrow */}
        <p className="text-gold text-[11px] tracking-[0.38em] uppercase font-normal mb-7">
          Osteria Le Tre Vie &nbsp;·&nbsp; Taormina, Sicilia
        </p>

        {/* Headline */}
        <h1 className="font-cormorant font-light text-white leading-[1.07] mb-8"
          style={{ fontSize: 'clamp(44px, 7.5vw, 92px)' }}
        >
          <T
            en={<>The restaurant the locals have been<br /><em>sending their friends to for years.</em></>}
            it={<>L&apos;Osteria dove non solo torni,<br /><em>mandi anche gli amici.</em></>}
          />
        </h1>

        {/* Sub */}
        <p className="text-white text-[17px] font-light leading-[1.8] max-w-[540px] mx-auto mb-14" style={{textShadow: '0 1px 12px rgba(0,0,0,0.5)'}}>
          <T
            en="Six minutes from the arch of Porta Catania. A terrace, a view over Taormina's hillside, and food that makes you stay longer than you planned."
            it="Oltre Porta Catania, dove la vista si apre sulle colline e i sapori ti convincono a dimenticare l'orologio. Il posto perfetto per rilassarsi e godere di un'atmosfera unica."
          />
        </p>

        {/* CTAs */}
        <div className="flex gap-4 justify-center flex-wrap">
          <a
            href="/reserve"
            className="inline-block bg-terra hover:bg-terra-deep text-white text-[11px] tracking-[0.24em] uppercase px-14 py-5 transition-all duration-200 hover:-translate-y-0.5 no-underline"
          >
            <T en="Reserve Your Table" it="Prenota Ora" />
          </a>
          <a
            href="#story"
            className="inline-block border border-white/65 hover:border-white hover:bg-white/10 text-white text-[11px] tracking-[0.24em] uppercase px-14 py-5 transition-all duration-200 no-underline"
          >
            <T en="Our Story" it="La Nostra Storia" />
          </a>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-9 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        <div className="w-px h-12 bg-gradient-to-b from-white/60 to-transparent scroll-pulse" />
      </motion.div>
    </section>
  )
}

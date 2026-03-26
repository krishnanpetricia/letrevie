'use client'

import { motion } from 'framer-motion'

interface PageHeroProps {
  eyebrow: string
  title: React.ReactNode
  subtitle?: React.ReactNode
  bgImage?: string
  /** defaults to a dark cream if no image */
  darkOverlay?: boolean
}

export function PageHero({ eyebrow, title, subtitle, bgImage, darkOverlay = true }: PageHeroProps) {
  return (
    <div
      className="relative flex items-end justify-start overflow-hidden"
      style={{ minHeight: '42vh' }}
    >
      {/* Background */}
      {bgImage ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${bgImage})` }}
          />
          {darkOverlay && (
            <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/40 to-ink/80" />
          )}
        </>
      ) : (
        <div className="absolute inset-0 bg-ink" />
      )}

      {/* Content — bottom-left anchored */}
      <motion.div
        className="relative z-10 px-12 pb-16 pt-36 max-w-3xl"
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="block text-gold text-[10px] tracking-[0.38em] uppercase font-normal mb-5">
          {eyebrow}
        </span>
        <h1
          className="font-cormorant font-light text-white leading-[1.08] mb-4"
          style={{ fontSize: 'clamp(42px, 6vw, 80px)' }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="text-white/75 text-[19px] font-light leading-[1.78] max-w-xl">
            {subtitle}
          </p>
        )}
      </motion.div>
    </div>
  )
}

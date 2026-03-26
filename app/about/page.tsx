import { Nav }          from '@/components/Nav'
import { Footer }       from '@/components/Footer'
import { AboutContent } from './AboutContent'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Story — Osteria Le Tre Vie, Taormina',
  description: 'Le Tre Vie was opened in 2018 by Santi and Rosario. The story of a family, a name, and forty years at the stove.',
}

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main>
        <AboutContent />
      </main>
      <Footer />
    </>
  )
}

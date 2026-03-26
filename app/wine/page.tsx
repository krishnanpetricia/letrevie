import { Nav }         from '@/components/Nav'
import { Footer }      from '@/components/Footer'
import { WineContent } from './WineContent'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Wine List — Osteria Le Tre Vie, Taormina',
  description: 'A carefully chosen selection of Sicilian and Italian wines. Etna DOC, Nero d\'Avola, Nerello Mascalese, and more.',
}

export default function WinePage() {
  return (
    <>
      <Nav />
      <main>
        <WineContent />
      </main>
      <Footer />
    </>
  )
}

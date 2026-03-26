import { Nav }            from '@/components/Nav'
import { Footer }         from '@/components/Footer'
import { ReserveContent } from './ReserveContent'
import type { Metadata }  from 'next'

export const metadata: Metadata = {
  title: 'Reserve a Table — Osteria Le Tre Vie, Taormina',
  description: 'Book your table at Osteria Le Tre Vie in Taormina. Dinner nightly except Wednesday. Sunday lunch available.',
  // Prevent indexing of the booking step itself if preferred
  // robots: { index: false },
}

export default function ReservePage() {
  return (
    <>
      <Nav />
      <main>
        <ReserveContent />
      </main>
      <Footer />
    </>
  )
}

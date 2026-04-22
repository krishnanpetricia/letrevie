import { Nav }            from '@/components/Nav'
import { Footer }         from '@/components/Footer'
import { ReserveContent } from './ReserveContent'
import type { Metadata }  from 'next'

export const metadata: Metadata = {
  title: 'Book a Table · Osteria Le Tre Vie Taormina',
  description:
    "Reserve your table at Osteria Le Tre Vie, one of Taormina's most loved restaurants. Dinner nightly except Wednesday. Sunday lunch available. Free parking on site.",
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

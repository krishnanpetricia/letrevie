import { Nav }        from '@/components/Nav'
import { Footer }     from '@/components/Footer'
import { MenuContent} from './MenuContent'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Menu — Osteria Le Tre Vie, Taormina',
  description: 'Our seasonal Sicilian menu. Antipasti, primi, secondi and dolci — all prepared with local Sicilian ingredients by Chef Rosario.',
}

export default function MenuPage() {
  return (
    <>
      <Nav />
      <main>
        <MenuContent />
      </main>
      <Footer />
    </>
  )
}

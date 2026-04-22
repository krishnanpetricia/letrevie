import type { Metadata } from 'next'
import { Nav }          from '@/components/Nav'
import { Hero }         from '@/components/Hero'
import { Essentials }   from '@/components/Essentials'
import { OurStory }     from '@/components/OurStory'
import { FoodGrid }     from '@/components/FoodGrid'
import { Kitchen }      from '@/components/Kitchen'
import { Review }       from '@/components/Review'
import { BookingCTA }   from '@/components/BookingCTA'
import { FindUs }       from '@/components/FindUs'
import { Footer }       from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Osteria Le Tre Vie · Restaurant in Taormina, Sicily',
  description:
    "Authentic Italian cuisine in Taormina, Sicily. Chef Rosario's osteria near Porta Catania, where local ingredients, honest cooking and genuine hospitality have kept guests returning for forty years.",
}

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Essentials />
        <OurStory />
        <FoodGrid />
        <Kitchen />
        <Review />
        <BookingCTA />
        <FindUs />
      </main>
      <Footer />
    </>
  )
}

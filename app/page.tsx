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

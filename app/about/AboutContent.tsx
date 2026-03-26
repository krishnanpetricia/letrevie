'use client'

import Image from 'next/image'
import { PageHero } from '@/components/PageHero'
import { T }        from '@/components/T'
import { FadeIn }   from '@/components/FadeIn'

export function AboutContent() {
  return (
    <>
      {/* Hero */}
      <PageHero
        eyebrow="Osteria Le Tre Vie — Dal 2018"
        title={<T en={<>The place where<br /><em>three roads meet.</em></>} it={<>Il luogo dove<br /><em>tre vie si incontrano.</em></>} />}
        subtitle={
          <T
            en="A family, a name, and a kitchen that has been running for forty years."
            it="Una famiglia, un nome, e una cucina che lavora da quarant'anni."
          />
        }
        bgImage="/images/exterior.jpg"
      />

      {/* The Name */}
      <section className="bg-cream py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <span className="block text-terra text-[9px] tracking-[0.34em] uppercase font-normal mb-5">
              <T en="The Name" it="Il Nome" />
            </span>
            <h2
              className="font-cormorant font-light text-ink leading-[1.1] mb-8"
              style={{ fontSize: 'clamp(32px, 4vw, 52px)' }}
            >
              <T
                en={<>Three ancient roads,<br /><em>one table.</em></>}
                it={<>Tre vie antiche,<br /><em>un tavolo.</em></>}
              />
            </h2>
            <div className="space-y-6 text-[19px] leading-[1.85] text-ink-mid max-w-2xl">
              <T
                en={
                  <>
                    <p>Le Tre Vie takes its name from the three ancient roads that once converged at the edge of Taormina — the paths that travellers, traders, and pilgrims would walk to enter the old town. We liked the idea of being the place where those paths still meet.</p>
                    <p>Somewhere to finally sit down. To put your bag by the door. To share a bottle of wine and let the evening go wherever it wants.</p>
                  </>
                }
                it={
                  <>
                    <p>Le Tre Vie prende il nome dai tre antichi percorsi che un tempo convergevano ai margini di Taormina — le strade che viaggiatori, mercanti e pellegrini percorrevano per entrare nella città vecchia. Ci è piaciuta l'idea di essere il luogo in cui quei percorsi si incontrano ancora.</p>
                    <p>Un posto dove finalmente sedersi. Appoggiare la borsa vicino alla porta. Condividere una bottiglia di vino e lasciare che la sera vada dove vuole.</p>
                  </>
                }
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Santi */}
      <section className="bg-ink py-24 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <FadeIn>
            <span className="block text-gold text-[9px] tracking-[0.34em] uppercase font-normal mb-5">
              <T en="The Host" it="Il Padrone di Casa" />
            </span>
            <h2
              className="font-cormorant font-light text-white leading-[1.1] mb-7"
              style={{ fontSize: 'clamp(30px, 3.5vw, 48px)' }}
            >
              <T en={<>Santi runs<br /><em>the room.</em></>} it={<>Santi gestisce<br /><em>la sala.</em></>} />
            </h2>
            <div className="space-y-5 text-[19px] leading-[1.85] text-white/75">
              <T
                en={
                  <>
                    <p>Santi has been in hospitality his entire life — not because he chose a career, but because it is simply how he moves through the world. He remembers faces. He remembers what you ordered the last time you were in. He will tell you when a bottle is not quite right tonight and suggest something better.</p>
                    <p>On a busy Friday in August, when every table is full and a cruise ship has just docked in Giardini, Santi is the reason the room stays calm. He is quiet, unhurried, and always seems to have exactly the right table for whoever walks through the door.</p>
                  </>
                }
                it={
                  <>
                    <p>Santi è nell'ospitalità da tutta la vita — non perché abbia scelto una carriera, ma perché è semplicemente il modo in cui si muove nel mondo. Ricorda i volti. Ricorda cosa hai ordinato l'ultima volta che eri qui. Ti dirà quando una bottiglia non è perfetta quella sera e ne suggerirà una migliore.</p>
                    <p>In un venerdì affollato di agosto, quando ogni tavolo è occupato e una nave da crociera è appena arrivata a Giardini, Santi è il motivo per cui la sala rimane calma. Tranquillo, senza fretta, e ha sempre il tavolo giusto per chiunque entri dalla porta.</p>
                  </>
                }
              />
            </div>
          </FadeIn>
          <FadeIn delay={0.1} className="relative aspect-[4/5] overflow-hidden">
            <Image
              src="/images/exterior.jpg"
              alt="Le Tre Vie — the restaurant from outside"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </FadeIn>
        </div>
      </section>

      {/* Rosario */}
      <section className="bg-cream-dark py-24 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <FadeIn delay={0.1} className="relative aspect-[4/5] overflow-hidden order-last md:order-first">
            <Image
              src="/images/dish-tuna.jpg"
              alt="Chef Rosario's cooking — pistachio-crusted tuna"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </FadeIn>
          <FadeIn>
            <span className="block text-terra text-[9px] tracking-[0.34em] uppercase font-normal mb-5">
              <T en="The Chef" it="Lo Chef" />
            </span>
            <h2
              className="font-cormorant font-light text-ink leading-[1.1] mb-7"
              style={{ fontSize: 'clamp(30px, 3.5vw, 48px)' }}
            >
              <T en={<>Forty years<br /><em>at the stove.</em></>} it={<>Quarant&apos;anni<br /><em>ai fornelli.</em></>} />
            </h2>
            <div className="space-y-5 text-[19px] leading-[1.85] text-ink-mid">
              <T
                en={
                  <>
                    <p>Rosario began cooking at fourteen, in the kitchen of a small trattoria near his family home in Messina. He has spent the four decades since refining a single idea: that the quality of what you put in front of someone is the only thing that matters.</p>
                    <p>He does not chase trends. He does not send dishes out with tweezers and foam. He cooks Sicilian food — seriously, carefully, with ingredients he knows and producers he trusts — and he does it in a way that makes the person eating slow down and order another glass.</p>
                    <p>The pasta is made fresh. The fish comes from the same boats it always has. The olive oil is from a grove he has been visiting for fifteen years.</p>
                  </>
                }
                it={
                  <>
                    <p>Rosario ha iniziato a cucinare a quattordici anni, nella cucina di una piccola trattoria vicino alla sua casa di famiglia a Messina. Ha trascorso i quattro decenni successivi a perfezionare una singola idea: che la qualità di ciò che metti davanti a qualcuno è l'unica cosa che conta.</p>
                    <p>Non insegue le mode. Non manda i piatti con pinzette e schiume. Cucina cibo siciliano — con serietà, cura, con ingredienti che conosce e produttori di cui si fida — e lo fa in un modo che fa rallentare chi mangia e ordinare un altro calice.</p>
                    <p>La pasta è fatta fresca. Il pesce proviene dalle stesse barche di sempre. L'olio d'oliva è da un uliveto che visita da quindici anni.</p>
                  </>
                }
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 2018 */}
      <section className="bg-cream py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <span className="block text-terra text-[9px] tracking-[0.34em] uppercase font-normal mb-5">
              <T en="Since 2018" it="Dal 2018" />
            </span>
            <h2
              className="font-cormorant font-light text-ink leading-[1.1] mb-8"
              style={{ fontSize: 'clamp(32px, 4vw, 52px)' }}
            >
              <T
                en={<>The day we<br /><em>opened the door.</em></>}
                it={<>Il giorno in cui<br /><em>abbiamo aperto la porta.</em></>}
              />
            </h2>
            <div className="space-y-6 text-[19px] leading-[1.85] text-ink-mid max-w-2xl">
              <T
                en={
                  <>
                    <p>Le Tre Vie opened in the spring of 2018. Santi, Rosario, and their brother-in-law had been talking about it for years — a place of their own, outside the historic centre, with its own parking, its own terrace, and a kitchen that could finally do things properly.</p>
                    <p>The first summer was a leap of faith. They had no marketing, no tour operator relationships, no TripAdvisor profile. What they had was a terrace facing Etna, a kitchen ready to cook, and a belief that if the food and the welcome were right, people would find them.</p>
                    <p>They were right. Six years on, most of the tables are filled by word of mouth. By visitors who came once and came back three times in the same trip. By locals who send their friends. By the kind of guests who leave a restaurant thinking — that was exactly what I needed.</p>
                  </>
                }
                it={
                  <>
                    <p>Le Tre Vie ha aperto nella primavera del 2018. Santi, Rosario e il loro cognato ne parlavano da anni — un posto loro, fuori dal centro storico, con il proprio parcheggio, la propria terrazza e una cucina che potesse finalmente fare le cose per bene.</p>
                    <p>La prima estate è stata un salto nel vuoto. Non avevano marketing, nessun rapporto con i tour operator, nessun profilo TripAdvisor. Quello che avevano era una terrazza che guarda l'Etna, una cucina pronta a cucinare e la convinzione che se il cibo e l'accoglienza fossero giusti, le persone li avrebbero trovati.</p>
                    <p>Avevano ragione. Sei anni dopo, la maggior parte dei tavoli si riempie grazie al passaparola. Da visitatori che sono venuti una volta e sono tornati tre volte nello stesso viaggio. Da locali che mandano i loro amici. Dal tipo di ospiti che lasciano un ristorante pensando — era esattamente quello di cui avevo bisogno.</p>
                  </>
                }
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Values strip */}
      <section className="bg-ink py-20 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-12">
          {[
            {
              label: 'The Ingredients',
              labelIt: 'Gli Ingredienti',
              body: 'We buy from producers we know. Fish from the same boats, vegetables from the same farms, wine from growers who answer their phone.',
              bodyIt: 'Acquistiamo da produttori che conosciamo. Pesce dalle stesse barche, verdure dalle stesse aziende, vino da vignaioli che rispondono al telefono.',
            },
            {
              label: 'The Welcome',
              labelIt: 'L\'Accoglienza',
              body: "Whether it's your first visit or your fifth, you'll be treated the same way. Warmly, honestly, without theatre.",
              bodyIt: "Che sia la tua prima visita o la quinta, sarai trattato allo stesso modo. Con calore, onestà, senza teatralità.",
            },
            {
              label: 'The Place',
              labelIt: 'Il Posto',
              body: 'Six minutes from Porta Catania, a terrace with a view of Etna, and parking right at the door. Some things are just practical.',
              bodyIt: "Sei minuti da Porta Catania, una terrazza con vista sull'Etna e il parcheggio davanti alla porta. Alcune cose sono semplicemente pratiche.",
            },
          ].map(({ label, labelIt, body, bodyIt }) => (
            <FadeIn key={label}>
              <span className="block text-gold text-[9px] tracking-[0.34em] uppercase font-normal mb-4">
                <T en={label} it={labelIt} />
              </span>
              <p className="text-white/70 text-[19px] leading-[1.82] font-light">
                <T en={body} it={bodyIt} />
              </p>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="bg-terra py-24 text-center px-6">
        <FadeIn>
          <h2
            className="font-cormorant font-light text-white mb-4 leading-[1.1]"
            style={{ fontSize: 'clamp(32px, 4.5vw, 58px)' }}
          >
            <T
              en={<>Come and see<br /><em>for yourself.</em></>}
              it={<>Venite a vederlo<br /><em>di persona.</em></>}
            />
          </h2>
          <p className="text-white/80 text-[18px] font-light mb-12 max-w-sm mx-auto leading-relaxed">
            <T
              en="Tables fill quickly in season. Reserve yours before you arrive."
              it="I tavoli si riempiono in fretta in stagione. Prenota il tuo prima di arrivare."
            />
          </p>
          <a
            href="/reserve"
            className="inline-block bg-white text-terra hover:bg-cream font-medium text-[11px] tracking-[0.24em] uppercase px-14 py-5 transition-all duration-200 hover:-translate-y-0.5 no-underline"
          >
            <T en="Reserve a Table" it="Prenota un Tavolo" />
          </a>
        </FadeIn>
      </div>
    </>
  )
}

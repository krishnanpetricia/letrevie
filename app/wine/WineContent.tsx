'use client'

import { PageHero } from '@/components/PageHero'
import { T }        from '@/components/T'
import { FadeIn }   from '@/components/FadeIn'

/* ─── Types ─── */
interface Wine {
  name:     string
  producer: string
  region:   string
  note:     string
  noteIt:   string
  glass?:   string
  bottle:   string
  year?:    string
}

/* ─── Data ─── */

const BIANCHI: Wine[] = [
  {
    name: 'Etna Bianco DOC',
    producer: 'Benanti',
    region: 'Etna, Sicilia',
    note: 'Volcanic minerality, white peach, flint, long finish. The mountain in a glass.',
    noteIt: 'Mineralità vulcanica, pesca bianca, selce, lungo finale. La montagna in un bicchiere.',
    glass: '€8',
    bottle: '€36',
    year: '2022',
  },
  {
    name: 'Grillo Parlante',
    producer: 'Donnafugata',
    region: 'Sicilia DOC',
    note: 'Bright citrus, Mediterranean herbs, fresh almond. Excellent with fish and antipasti.',
    noteIt: 'Agrumi vivaci, erbe mediterranee, mandorla fresca. Eccellente con pesce e antipasti.',
    glass: '€7',
    bottle: '€28',
    year: '2023',
  },
  {
    name: 'Catarratto Superiore',
    producer: 'Firriato',
    region: 'Trapani, Sicilia',
    note: 'Straw-gold, apple blossom, pear, subtle spice. Honest and versatile.',
    noteIt: 'Giallo paglierino, fiori di melo, pera, spezie sottili. Onesto e versatile.',
    glass: '€6',
    bottle: '€24',
    year: '2023',
  },
  {
    name: 'Carricante "Contrada Calderara"',
    producer: 'Cornelissen',
    region: 'Etna, Sicilia',
    note: 'Biodynamic. Saline, mineral, extraordinary tension. One of Etna\'s finest whites.',
    noteIt: 'Biodinamico. Salino, minerale, straordinaria tensione. Uno dei migliori bianchi dell\'Etna.',
    bottle: '€55',
    year: '2021',
  },
  {
    name: 'Insolia',
    producer: 'Planeta',
    region: 'Menfi, Sicilia',
    note: 'Delicate, floral, stone fruit with a clean dry finish. Our house white.',
    noteIt: 'Delicato, floreale, frutta a nocciolo con finale secco e pulito. Il nostro bianco della casa.',
    glass: '€6',
    bottle: '€22',
    year: '2023',
  },
]

const ROSSI: Wine[] = [
  {
    name: 'Etna Rosso DOC',
    producer: 'Passopisciaro',
    region: 'Etna, Sicilia',
    note: 'Nerello Mascalese. Wild cherry, pomegranate, volcanic earth, elegant tannins.',
    noteIt: 'Nerello Mascalese. Ciliegia selvatica, melograno, terra vulcanica, tannini eleganti.',
    glass: '€9',
    bottle: '€42',
    year: '2020',
  },
  {
    name: 'Nero d\'Avola "Saia"',
    producer: 'Feudo Maccari',
    region: 'Noto, Sicilia',
    note: 'Deep ruby. Dark cherry, liquorice, chocolate, warm spice. Sicily at full expression.',
    noteIt: 'Rosso rubino intenso. Ciliegia scura, liquirizia, cioccolato, spezie calde. La Sicilia nella sua massima espressione.',
    glass: '€8',
    bottle: '€34',
    year: '2020',
  },
  {
    name: 'Nerello Mascalese',
    producer: 'Terre Nere',
    region: 'Etna, Sicilia',
    note: 'Silky, perfumed, Pinot-like in its delicacy. Red berries, rose, mineral. Superb with lamb.',
    noteIt: 'Setoso, profumato, delicato come un Pinot. Frutti rossi, rosa, minerale. Superbo con l\'agnello.',
    glass: '€9',
    bottle: '€40',
    year: '2021',
  },
  {
    name: 'Cerasuolo di Vittoria DOCG',
    producer: 'COS',
    region: 'Ragusa, Sicilia',
    note: 'Sicily\'s only DOCG. Nero d\'Avola and Frappato. Bright, complex, food-perfect.',
    noteIt: 'L\'unica DOCG siciliana. Nero d\'Avola e Frappato. Vivace, complesso, perfetto a tavola.',
    glass: '€8',
    bottle: '€36',
    year: '2021',
  },
  {
    name: 'Frappato "Vittoria"',
    producer: 'Occhipinti',
    region: 'Vittoria, Sicilia',
    note: 'Light, luminous, strawberry, violet, a touch of pepper. Perfect slightly chilled.',
    noteIt: 'Leggero, luminoso, fragola, violetta, un tocco di pepe. Perfetto leggermente fresco.',
    bottle: '€38',
    year: '2022',
  },
]

const ROSATI: Wine[] = [
  {
    name: 'Nerello Rosato',
    producer: 'Benanti',
    region: 'Etna, Sicilia',
    note: 'Pale copper, wild strawberry, hibiscus, saline finish. Beautiful with the antipasto selection.',
    noteIt: 'Rame tenue, fragola selvatica, ibisco, finale salino. Bellissimo con gli antipasti.',
    glass: '€7',
    bottle: '€28',
    year: '2023',
  },
  {
    name: 'Cerasuolo d\'Abruzzo',
    producer: 'Valentini',
    region: 'Abruzzo',
    note: 'A legendary Italian rosé. Vivid, structured, complex — more than you expect from pink.',
    noteIt: 'Un leggendario rosato italiano. Vivido, strutturato, complesso — più di quanto ti aspetti.',
    bottle: '€45',
    year: '2022',
  },
]

const DOLCI: Wine[] = [
  {
    name: 'Passito di Pantelleria DOC',
    producer: 'Donnafugata "Ben Ryé"',
    region: 'Pantelleria, Sicilia',
    note: 'Sun-dried Zibibbo grapes. Apricot, fig, orange blossom, honey. The island\'s great dessert wine.',
    noteIt: 'Uve Zibibbo appassite al sole. Albicocca, fico, fior d\'arancio, miele. Il grande vino dolce dell\'isola.',
    glass: '€9',
    bottle: '€44',
    year: '2021',
  },
  {
    name: 'Malvasia delle Lipari',
    producer: 'Hauner',
    region: 'Isole Eolie, Sicilia',
    note: 'Amber, crystalline. Dried apricot, bitter almond, citrus peel. Rare and beautiful.',
    noteIt: 'Ambrato, cristallino. Albicocca essiccata, mandorla amara, scorza di agrumi. Raro e bellissimo.',
    glass: '€10',
    bottle: '€48',
    year: '2020',
  },
]

const BOLLICINE: Wine[] = [
  {
    name: 'Prosecco Superiore DOCG',
    producer: 'Bisol',
    region: 'Valdobbiadene, Veneto',
    note: 'Fine perlage, green apple, white pear, acacia. Clean and celebratory.',
    noteIt: 'Perlage fine, mela verde, pera bianca, acacia. Pulito e festoso.',
    glass: '€7',
    bottle: '€28',
  },
  {
    name: 'Franciacorta Brut DOCG',
    producer: 'Ca\' del Bosco',
    region: 'Brescia, Lombardia',
    note: 'Italy\'s finest sparkling. Brioche, citrus, stone fruit, persistent mousse.',
    noteIt: 'Il miglior spumante italiano. Brioche, agrumi, frutta a nocciolo, perlage persistente.',
    glass: '€10',
    bottle: '€52',
  },
]

/* ─── Wine Row ─── */
function WineRow({ wine }: { wine: Wine }) {
  return (
    <div className="py-7 border-b border-black/7 last:border-0">
      <div className="flex items-start justify-between gap-6 mb-2">
        <div>
          <h3 className="font-cormorant text-[20px] italic font-light text-ink">
            {wine.name}
          </h3>
          <p className="text-[12px] tracking-[0.12em] text-ink-mid mt-0.5">
            {wine.producer} &nbsp;·&nbsp; {wine.region}
            {wine.year && <span className="ml-2 text-ink-mid/60">{wine.year}</span>}
          </p>
        </div>
        <div className="text-right shrink-0 pt-0.5 space-y-0.5">
          {wine.glass && (
            <p className="text-[15px] text-ink-mid">
              <span className="text-[9px] tracking-[0.15em] uppercase mr-1.5 text-ink-mid/60">Glass</span>
              {wine.glass}
            </p>
          )}
          <p className="text-[13px] text-ink font-cormorant text-[17px]">
            <span className="text-[9px] tracking-[0.15em] uppercase mr-1.5 text-ink-mid/60 font-jost">Bottle</span>
            {wine.bottle}
          </p>
        </div>
      </div>
      <p className="text-[16px] text-ink-mid leading-relaxed font-light">
        <T en={wine.note} it={wine.noteIt} />
      </p>
    </div>
  )
}

/* ─── Section ─── */
interface WineSectionProps {
  eyebrow: string
  eyebrowIt: string
  title: string
  titleIt: string
  wines: Wine[]
  delay?: number
  dark?: boolean
}

function WineSection({ eyebrow, eyebrowIt, title, titleIt, wines, delay = 0, dark }: WineSectionProps) {
  return (
    <FadeIn delay={delay}>
      <div className={`py-20 px-6 ${dark ? 'bg-ink' : 'bg-cream'}`}>
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <span className={`block text-[9px] tracking-[0.34em] uppercase font-normal mb-3 ${dark ? 'text-gold' : 'text-terra'}`}>
              <T en={eyebrow} it={eyebrowIt} />
            </span>
            <h2
              className={`font-cormorant font-light ${dark ? 'text-white' : 'text-ink'}`}
              style={{ fontSize: 'clamp(28px, 3vw, 40px)' }}
            >
              <T en={title} it={titleIt} />
            </h2>
          </div>
          <div className={dark ? '[&_.border-b]:border-white/10 [&_h3]:text-white [&_.text-ink-mid]:text-white/65 [&_.text-ink]:text-white' : ''}>
            {wines.map((w) => <WineRow key={w.name} wine={w} />)}
          </div>
        </div>
      </div>
    </FadeIn>
  )
}

/* ─── Page ─── */
export function WineContent() {
  return (
    <>
      <PageHero
        eyebrow="La Cantina — Le Tre Vie"
        title={<T en={<>Good food deserves<br /><em>good wine.</em></>} it={<>Buon cibo merita<br /><em>buon vino.</em></>} />}
        subtitle={
          <T
            en="A focused selection of Sicilian bottles and a few Italian guests. We pour what we enjoy drinking."
            it="Una selezione ragionata di bottiglie siciliane e qualche ospite italiano. Versiamo ciò che amiamo bere."
          />
        }
        bgImage="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1400&q=80"
      />

      <WineSection
        eyebrow="Sparkling"  eyebrowIt="Bollicine"
        title="Bollicine"   titleIt="Bollicine"
        wines={BOLLICINE}   delay={0}
      />
      <WineSection
        eyebrow="White wines" eyebrowIt="Vini bianchi"
        title="Bianchi"       titleIt="Bianchi"
        wines={BIANCHI}       delay={0} dark
      />
      <WineSection
        eyebrow="Red wines" eyebrowIt="Vini rossi"
        title="Rossi"       titleIt="Rossi"
        wines={ROSSI}       delay={0}
      />
      <WineSection
        eyebrow="Rosé"    eyebrowIt="Rosati"
        title="Rosati"    titleIt="Rosati"
        wines={ROSATI}    delay={0} dark
      />
      <WineSection
        eyebrow="Dessert wines" eyebrowIt="Vini dolci"
        title="Dolci"           titleIt="Dolci"
        wines={DOLCI}           delay={0}
      />

      {/* CTA */}
      <div className="bg-terra py-24 text-center px-6">
        <FadeIn>
          <h2
            className="font-cormorant font-light text-white mb-4 leading-[1.1]"
            style={{ fontSize: 'clamp(32px, 4.5vw, 58px)' }}
          >
            <T
              en={<>Best enjoyed<br /><em>at the table.</em></>}
              it={<>Meglio gustato<br /><em>a tavola.</em></>}
            />
          </h2>
          <p className="text-white/80 text-[18px] font-light mb-12 max-w-sm mx-auto leading-relaxed">
            <T
              en="Reserve your table and let us guide you through the list."
              it="Prenota il tuo tavolo e lasciati guidare attraverso la lista."
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

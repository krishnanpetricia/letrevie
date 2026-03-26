'use client'

import { PageHero }  from '@/components/PageHero'
import { T }         from '@/components/T'
import { FadeIn }    from '@/components/FadeIn'

/* ─── Data ─── */

interface Dish {
  name:    string
  nameIt?: string
  desc:    string
  descIt:  string
  price:   string
  note?:   string   // e.g. "V" vegetarian, "VG" vegan
}

const ANTIPASTI: Dish[] = [
  {
    name:   'Acciughe e burro',
    desc:   'Cantabrian anchovies, cultured butter, house-baked bread',
    descIt: 'Alici del Cantabrico, burro artigianale, pane casereccio',
    price:  '€12',
  },
  {
    name:   'Tonno in crosta di pistacchio',
    desc:   'Pistachio-crusted seared tuna, shaved fennel, watermelon granita, chilli flakes',
    descIt: 'Trancio di tonno in crosta di pistacchio, finocchio crudo, granita di anguria, peperoncino',
    price:  '€16',
  },
  {
    name:   'Caponata di melanzane',
    desc:   'Sweet and sour aubergine, toasted almonds, golden raisins, fresh basil',
    descIt: 'Melanzane in agrodolce, mandorle tostate, uvetta, basilico fresco',
    price:  '€11',
    note:   'V',
  },
  {
    name:   'Arancini al ragù',
    desc:   'Saffron rice croquettes, slow-braised beef ragù, peas, caciocavallo',
    descIt: 'Arancini di riso allo zafferano, ragù di manzo, piselli, caciocavallo',
    price:  '€10',
  },
  {
    name:   'Gamberi rossi di Mazara',
    desc:   'Raw red prawns from Mazara del Vallo, sea salt, extra virgin olive oil, lemon',
    descIt: 'Gamberi rossi di Mazara crudi, sale marino, olio extravergine, limone',
    price:  '€18',
  },
]

const PRIMI: Dish[] = [
  {
    name:   'Pasta alla Norma',
    desc:   'Rigatoni, fried aubergine, fresh tomato, salted ricotta, basil — the classic of Catania',
    descIt: 'Rigatoni, melanzane fritte, pomodoro fresco, ricotta salata, basilico',
    price:  '€15',
    note:   'V',
  },
  {
    name:   'Pasta alle Sarde',
    desc:   'Bucatini, fresh sardines, wild fennel, pine nuts, raisins, saffron, toasted breadcrumbs',
    descIt: 'Bucatini, sarde fresche, finocchietto selvatico, pinoli, uva passa, zafferano, mollica tostata',
    price:  '€16',
  },
  {
    name:   'Tagliolini ai ricci di mare',
    desc:   'Hand-cut pasta, fresh sea urchin, lemon zest, bottarga, parsley',
    descIt: 'Tagliolini fatti a mano, ricci di mare freschi, scorza di limone, bottarga, prezzemolo',
    price:  '€22',
  },
  {
    name:   'Risotto al nero di seppia',
    desc:   'Carnaroli risotto, cuttlefish ink, grilled cuttlefish, gremolata, lemon',
    descIt: 'Risotto Carnaroli al nero di seppia, seppie grigliate, gremolata, limone',
    price:  '€18',
  },
  {
    name:   'Pasta al pomodoro del Piennolo',
    desc:   'Spaghetti, slow-cooked Piennolo tomatoes from Vesuvius, basil, Sicilian olive oil',
    descIt: 'Spaghetti, pomodorini del Piennolo al forno, basilico, olio extravergine siciliano',
    price:  '€13',
    note:   'V',
  },
]

const SECONDI: Dish[] = [
  {
    name:   'Pesce del giorno',
    desc:   'Today\'s catch from the Ionian Sea — ask your server for preparation and price',
    descIt: 'Il pesce del giorno dal Mar Ionio — chiedete al vostro cameriere',
    price:  'market price',
  },
  {
    name:   'Involtini di pesce spada',
    desc:   'Swordfish rolls, breadcrumbs, capers, pine nuts, currants, tomato sauce, Sicilian olives',
    descIt: 'Involtini di pesce spada, pangrattato, capperi, pinoli, ribes, sugo, olive siciliane',
    price:  '€24',
  },
  {
    name:   'Agnello alla griglia con salsa verde',
    desc:   'Grilled rack of local lamb, salsa verde, roasted cherry tomatoes, seasonal greens',
    descIt: 'Costolette di agnello locale alla griglia, salsa verde, pomodorini arrosto, verdure di stagione',
    price:  '€26',
  },
  {
    name:   'Petto di maiale alle erbe aromatiche',
    desc:   'Slow-roasted pork belly, wild herbs, lemon, roasted potatoes, braised fennel',
    descIt: 'Pancetta di maiale arrosto lenta, erbe aromatiche, limone, patate al forno, finocchio brasato',
    price:  '€22',
  },
  {
    name:   'Parmigiana di melanzane',
    desc:   'Layered aubergine bake, San Marzano tomato, fior di latte, basil — baked to order',
    descIt: 'Parmigiana di melanzane al forno, pomodoro San Marzano, fior di latte, basilico',
    price:  '€17',
    note:   'V',
  },
]

const DOLCI: Dish[] = [
  {
    name:   'Semifreddo alla nocciola',
    desc:   'House-made hazelnut semifreddo, dark chocolate sauce, crushed praline, meringue',
    descIt: 'Semifreddo alla nocciola fatto in casa, salsa al cioccolato fondente, pralinato sbriciolato, meringa',
    price:  '€9',
  },
  {
    name:   'Cannolo artigianale',
    desc:   'Crisp pastry shell, sheep\'s ricotta, candied orange peel, pistachio, chocolate — filled to order',
    descIt: 'Guscio di pasta fritta, ricotta di pecora, scorza di arancia candita, pistacchio, cioccolato',
    price:  '€8',
  },
  {
    name:   'Cassata Siciliana',
    desc:   'Traditional Sicilian ricotta cake, almond sponge, candied fruit, royal icing',
    descIt: 'Cassata Siciliana tradizionale, pan di spagna alle mandorle, frutta candita, glassa reale',
    price:  '€9',
  },
  {
    name:   'Granita al limone con brioche',
    desc:   'Artisan lemon granita from Etna-slope lemons, served with warm broche col tuppo',
    descIt: 'Granita artigianale al limone dell\'Etna, servita con brioche col tuppo calda',
    price:  '€7',
    note:   'V',
  },
  {
    name:   'Formaggi Siciliani',
    desc:   'Selection of three Sicilian cheeses, seasonal honey, toasted walnuts, house-made crackers',
    descIt: 'Selezione di tre formaggi siciliani, miele di stagione, noci tostate, crackers fatti in casa',
    price:  '€14',
  },
]

/* ─── Dish Row ─── */
function DishRow({ dish }: { dish: Dish }) {
  return (
    <div className="flex items-start justify-between gap-8 py-7 border-b border-black/8 last:border-0 group">
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-3 mb-2 flex-wrap">
          <h3 className="font-cormorant text-[20px] italic font-light text-ink leading-snug">
            {dish.name}
          </h3>
          {dish.note && (
            <span className="text-[9px] tracking-[0.2em] uppercase text-terra border border-terra px-1.5 py-0.5 leading-none">
              {dish.note}
            </span>
          )}
        </div>
        <p className="text-ink-mid text-[16px] leading-relaxed font-light">
          <T en={dish.desc} it={dish.descIt} />
        </p>
      </div>
      <span className="font-cormorant text-[18px] text-ink-mid shrink-0 pt-0.5">
        {dish.price}
      </span>
    </div>
  )
}

/* ─── Menu Section ─── */
interface SectionProps {
  eyebrow: string
  eyebrowIt: string
  title: string
  titleIt: string
  dishes: Dish[]
  delay?: number
}

function MenuSection({ eyebrow, eyebrowIt, title, titleIt, dishes, delay = 0 }: SectionProps) {
  return (
    <FadeIn delay={delay} className="mb-20">
      <div className="mb-8">
        <span className="block text-terra text-[9px] tracking-[0.34em] uppercase font-normal mb-3">
          <T en={eyebrow} it={eyebrowIt} />
        </span>
        <h2 className="font-cormorant font-light text-ink" style={{ fontSize: 'clamp(28px, 3vw, 40px)' }}>
          <T en={title} it={titleIt} />
        </h2>
      </div>
      <div>
        {dishes.map((d) => <DishRow key={d.name} dish={d} />)}
      </div>
    </FadeIn>
  )
}

/* ─── Page ─── */
export function MenuContent() {
  return (
    <>
      <PageHero
        eyebrow="Osteria Le Tre Vie — Taormina"
        title={<T en={<><em>What we</em><br />cook today.</>} it={<><em>Quello che</em><br />cuciniamo oggi.</>} />}
        subtitle={
          <T
            en="Our menu follows the season and the market. Dishes may change without notice — that is how we like it."
            it="Il nostro menù segue la stagione e il mercato. I piatti possono variare — è così che ci piace."
          />
        }
        bgImage="/images/dish-tuna.jpg"
      />

      {/* Menu body */}
      <section className="bg-cream pt-20 pb-24 px-6">
        <div className="max-w-3xl mx-auto">

          <MenuSection
            eyebrow="To start"       eyebrowIt="Per iniziare"
            title="Antipasti"        titleIt="Antipasti"
            dishes={ANTIPASTI}       delay={0}
          />
          <MenuSection
            eyebrow="First course"   eyebrowIt="Primo piatto"
            title="Primi"            titleIt="Primi"
            dishes={PRIMI}           delay={0.05}
          />
          <MenuSection
            eyebrow="Main course"    eyebrowIt="Piatto principale"
            title="Secondi"          titleIt="Secondi"
            dishes={SECONDI}         delay={0.1}
          />
          <MenuSection
            eyebrow="To finish"      eyebrowIt="Per finire"
            title="Dolci"            titleIt="Dolci"
            dishes={DOLCI}           delay={0.15}
          />

          {/* Notes */}
          <FadeIn delay={0.2}>
            <div className="mt-4 pt-10 border-t border-black/8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-[14px] text-ink-mid leading-relaxed">
              <p>
                <span className="block text-[9px] tracking-[0.28em] uppercase text-terra mb-2">
                  <T en="Dietary" it="Diete" />
                </span>
                <T
                  en="V — vegetarian. Please inform your server of any allergies before ordering."
                  it="V — vegetariano. Informate il vostro cameriere di eventuali allergie prima di ordinare."
                />
              </p>
              <p>
                <span className="block text-[9px] tracking-[0.28em] uppercase text-terra mb-2">
                  <T en="Covers" it="Coperto" />
                </span>
                <T
                  en="Cover charge €3 per person. Includes house bread and olive oil."
                  it="Coperto €3 a persona. Include pane casereccio e olio extravergine."
                />
              </p>
              <p>
                <span className="block text-[9px] tracking-[0.28em] uppercase text-terra mb-2">
                  <T en="Seasonal" it="Stagionalità" />
                </span>
                <T
                  en="Menus change with the season. Prices include VAT."
                  it="I menù cambiano con le stagioni. I prezzi includono l'IVA."
                />
              </p>
            </div>
          </FadeIn>

          {/* CTA */}
          <FadeIn delay={0.25} className="mt-16 text-center">
            <p className="font-cormorant text-[22px] italic text-ink-mid mb-6">
              <T en="Ready to sit down?" it="Pronti a sedervi?" />
            </p>
            <a
              href="/reserve"
              className="inline-block bg-terra hover:bg-terra-deep text-white text-[11px] tracking-[0.24em] uppercase px-14 py-5 transition-all duration-200 hover:-translate-y-0.5 no-underline"
            >
              <T en="Reserve Your Table" it="Prenota il Tuo Tavolo" />
            </a>
          </FadeIn>
        </div>
      </section>
    </>
  )
}

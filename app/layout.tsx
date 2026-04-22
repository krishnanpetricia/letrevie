import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import { LangProvider } from '@/context/LangContext'

const SITE_URL = 'https://www.osterialetvie.it'

export const metadata: Metadata = {
  title: 'Osteria Le Tre Vie — Taormina',
  description:
    'Authentic Sicilian cuisine just outside Porta Catania. Terrace dining with views over Taormina. Book your table online.',
  keywords: ['Le Tre Vie', 'Taormina', 'osteria', 'ristorante', 'Sicilian food', 'restaurant Sicily'],
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Osteria Le Tre Vie — Taormina',
    description: 'The restaurant the locals have been sending their friends to for years.',
    siteName: 'Osteria Le Tre Vie',
    url: SITE_URL,
    locale: 'it_IT',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Osteria Le Tre Vie — Taormina',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Osteria Le Tre Vie — Taormina',
    description: 'The restaurant the locals have been sending their friends to for years.',
    images: ['/og-image.jpg'],
  },
  verification: {
    google: 'BPinjXfqTK_XUgY_Ppub5y8ZNzy_tnbigYw-QKTX9cs',
  },
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: 'Osteria Pizzeria Le Tre Vie',
  image: `${SITE_URL}/og-image.jpg`,
  url: SITE_URL,
  telephone: '+39 352 041 5653',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Via Crocefisso, 4',
    addressLocality: 'Taormina',
    addressRegion: 'ME',
    postalCode: '98039',
    addressCountry: 'IT',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 37.8526,
    longitude: 15.2889,
  },
  servesCuisine: 'Sicilian',
  priceRange: '€€',
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '12:00',
      closes: '22:30',
    },
  ],
  hasMap: 'https://maps.google.com/?q=Osteria+Le+Tre+Vie+Taormina',
  reservations: `${SITE_URL}/reserve`,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Jost:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
        <Script
          id="local-business-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body className="font-jost font-light">
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  )
}

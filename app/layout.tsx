import type { Metadata } from 'next'
import './globals.css'
import { LangProvider } from '@/context/LangContext'

export const metadata: Metadata = {
  title: 'Osteria Le Tre Vie — Taormina',
  description:
    'Authentic Sicilian cuisine just outside Porta Catania. Terrace dining with views over Taormina. Book your table online.',
  keywords: ['Le Tre Vie', 'Taormina', 'osteria', 'ristorante', 'Sicilian food', 'restaurant'],
  openGraph: {
    title: 'Osteria Le Tre Vie — Taormina',
    description: 'The restaurant the locals have been sending their friends to for years.',
    siteName: 'Osteria Le Tre Vie',
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Jost:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-jost font-light">
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  )
}

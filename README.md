# Osteria Le Tre Vie — Next.js Website

Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion

---

## Getting Started

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run start      # serve production build
```

---

## Project Structure

```
letrevie/
├── app/
│   ├── layout.tsx          # Root layout: fonts (Cormorant Garamond + Jost), metadata
│   ├── page.tsx            # Page: composes all sections in order
│   └── globals.css         # Tailwind base + custom CSS (hero overlay, animations)
├── components/
│   ├── T.tsx               # Translation helper — <T en="..." it="..." />
│   ├── FadeIn.tsx          # Scroll-triggered fade-in (Framer Motion)
│   ├── LangBar.tsx         # EN / IT language toggle bar
│   ├── Nav.tsx             # Sticky nav with shrink-on-scroll
│   ├── Hero.tsx            # Full-height hero with animated background
│   ├── Essentials.tsx      # Hours / phone bar (dark)
│   ├── OurStory.tsx        # 2-col: image + story copy
│   ├── FoodGrid.tsx        # 3-up food image grid
│   ├── Kitchen.tsx         # 2-col: Rosario copy + image (dark bg)
│   ├── Review.tsx          # TripAdvisor pull quote
│   ├── BookingCTA.tsx      # Terracotta urgency section
│   ├── FindUs.tsx          # 2-col: directions + Google Maps embed
│   ├── BookingWidget.tsx   # ← BOOKING WIDGET LIVES HERE
│   └── Footer.tsx          # Logo, address, social, persistent reserve CTA
├── context/
│   └── LangContext.tsx     # React context for EN/IT language state
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── postcss.config.mjs
```

---

## Language System

The site ships with full EN/IT bilingual support.

- **`LangContext`** holds the active language (`'en' | 'it'`) as React state.
- **`<T en="..." it="..." />`** renders the correct string inline.
- The `LangBar` component switches language globally — no page reload.
- To add a third language, extend the `Lang` type in `LangContext.tsx` and add a new `LangBar` button.

---

## Adding the Booking Widget

Open `components/BookingWidget.tsx`. Replace the placeholder `<div>` block (clearly commented) with your widget embed. Example for common providers:

### TheFork / LaFourchette
```tsx
import Script from 'next/script'

// Inside the component:
<div id="thefork-widget" data-restaurant-id="YOUR_ID" />
<Script src="https://www.theforkmanager.com/widget/loader.js" strategy="lazyOnload" />
```

### Sevenrooms
```tsx
<iframe
  src="https://sevenrooms.com/reservations/YOUR_VENUE_ID"
  width="100%"
  height="600"
  frameBorder="0"
/>
```

### ResDiary / Dish Cult
```tsx
<Script
  src="https://booking.resdiary.com/widget/Standard/YOUR_RESTAURANT/YOUR_ID"
  strategy="lazyOnload"
/>
<div id="resdiary-widget" />
```

Once embedded, delete the placeholder `<div>` and the fallback phone/WhatsApp buttons (or keep the WhatsApp button as a mobile fallback — recommended).

---

## Customisation Notes

| Thing to change          | File                          |
|--------------------------|-------------------------------|
| Hero image               | `components/Hero.tsx` → `HERO_IMG` |
| Story image              | `components/OurStory.tsx` → `STORY_IMG` |
| Kitchen / chef image     | `components/Kitchen.tsx` → `KITCHEN_IMG` |
| Food grid images         | `components/FoodGrid.tsx` → `dishes` array |
| Opening hours            | `components/Essentials.tsx` + `components/Footer.tsx` |
| Phone / WhatsApp number  | Search `+393520415653` across all components |
| Colours                  | `tailwind.config.ts` → `theme.extend.colors` + `app/globals.css` |
| Fonts                    | `app/layout.tsx` → `next/font/google` imports |
| SEO metadata             | `app/layout.tsx` → `export const metadata` |
| Social links             | `components/Footer.tsx` → `SOCIAL` array |
| Google Maps embed        | `components/FindUs.tsx` → `<iframe src=...>` |

---

## Images

All images currently source from Unsplash (CDN, no auth required). To use owned photography:

1. Place images in `/public/images/`
2. Replace the URL strings with `/images/your-image.jpg`
3. Update the `next.config.ts` `remotePatterns` if hosting images on an external CDN

---

## Deployment

This is a standard Next.js 14 App Router project. Deploy to:

- **Vercel** (recommended): connect repo, zero config
- **Netlify**: add `@netlify/plugin-nextjs`
- **Self-hosted**: `npm run build && npm run start` (Node 18+)

Ensure the domain is added to `next.config.ts` `remotePatterns` if you switch image hosts.

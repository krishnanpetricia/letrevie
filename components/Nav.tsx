'use client'

import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { T } from './T'
import { useLang, type Lang } from '@/context/LangContext'
import { supabase } from '@/lib/supabase'

const STORAGE_BASE = process.env.NEXT_PUBLIC_SUPABASE_URL + '/storage/v1/object/public/menus/'

const BASE_MENU_PDFS = {
  menu:   STORAGE_BASE + 'menu.pdf',
  giorno: STORAGE_BASE + 'piatti-del-giorno.pdf',
  vini:   STORAGE_BASE + 'carta-dei-vini.pdf',
}

export function Nav() {
  const [scrolled,   setScrolled]   = useState(false)
  const [menuOpen,   setMenuOpen]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [foodOpen,   setFoodOpen]   = useState(false)
  const [menuPdfs,   setMenuPdfs]   = useState(BASE_MENU_PDFS)
  const pathname                    = usePathname()
  const isHome                      = pathname === '/'
  const { lang, setLang }           = useLang()
  const dropdownRef                 = useRef<HTMLLIElement>(null)

  useEffect(() => {
    supabase
      .from('site_settings')
      .select('key, value')
      .in('key', ['menu_last_updated', 'piatti_last_updated', 'vini_last_updated'])
      .then(({ data, error }) => {
        if (error || !data) return
        const byKey = Object.fromEntries(data.map(r => [r.key, r.value]))
        setMenuPdfs({
          menu:   byKey.menu_last_updated   ? `${BASE_MENU_PDFS.menu}?v=${byKey.menu_last_updated}`     : BASE_MENU_PDFS.menu,
          giorno: byKey.piatti_last_updated ? `${BASE_MENU_PDFS.giorno}?v=${byKey.piatti_last_updated}` : BASE_MENU_PDFS.giorno,
          vini:   byKey.vini_last_updated   ? `${BASE_MENU_PDFS.vini}?v=${byKey.vini_last_updated}`     : BASE_MENU_PDFS.vini,
        })
      })
  }, [])

  useEffect(() => {
    setScrolled(window.scrollY > 80)
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const transparent = isHome && !scrolled

  const linkCls = [
    'text-[11px] tracking-[0.18em] uppercase no-underline transition-colors duration-300',
    transparent ? 'text-white/85 hover:text-white' : 'text-ink-mid hover:text-ink',
  ].join(' ')

  return (
    <>
      <nav
        className={[
          'fixed top-0 inset-x-0 z-50 transition-all duration-300',
          'flex items-center justify-between px-6 md:px-12',
          transparent
            ? 'bg-transparent border-b border-transparent py-5'
            : 'bg-white border-b border-black/8 shadow-[0_4px_28px_rgba(0,0,0,0.08)] py-3.5',
        ].join(' ')}
      >
        {/* Logo */}
        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          className={[
            'font-cormorant text-[22px] font-normal tracking-[0.12em] no-underline',
            'flex items-center leading-none transition-colors duration-300 shrink-0',
            transparent ? 'text-white' : 'text-ink',
          ].join(' ')}
        >
          <em>Le</em>&nbsp;Tre Vie
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-5 md:gap-8">

          {/* DESKTOP NAV */}
          <ul className="hidden md:flex items-center gap-7 list-none">

            {/* Menu PDF dropdown */}
            <li ref={dropdownRef} className="relative flex items-center">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className={['flex items-center gap-1.5 bg-transparent border-0 cursor-pointer p-0', linkCls].join(' ')}
              >
                <T en="Menu" it="Menu" />
                <svg
                  className={`w-2.5 h-2.5 transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`}
                  viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.8"
                >
                  <path d="M1 1l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {menuOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-white shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-black/6 min-w-[200px] py-2 z-50">
                  <a
                    href={menuPdfs.menu}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMenuOpen(false)}
                    className="block px-5 py-3 text-[11px] tracking-[0.18em] uppercase text-ink-mid hover:text-ink hover:bg-cream no-underline transition-colors duration-150"
                  >
                    <T en="Menu" it="Menù" />
                  </a>
                  <a
                    href={menuPdfs.giorno}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMenuOpen(false)}
                    className="block px-5 py-3 text-[11px] tracking-[0.18em] uppercase text-ink-mid hover:text-ink hover:bg-cream no-underline transition-colors duration-150"
                  >
                    <T en="Daily Specials" it="Piatti del Giorno" />
                  </a>
                  <a
                    href={menuPdfs.vini}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMenuOpen(false)}
                    className="block px-5 py-3 text-[11px] tracking-[0.18em] uppercase text-ink-mid hover:text-ink hover:bg-cream no-underline transition-colors duration-150"
                  >
                    <T en="Wine List" it="Carta dei Vini" />
                  </a>
                </div>
              )}
            </li>

            <li className="flex items-center">
              <Link href="/#find-us" className={linkCls}>
                <T en="Contact" it="Contatti" />
              </Link>
            </li>
          </ul>

          {/* Book Now — desktop only */}
          <Link href="/reserve"
            className={[
              'hidden md:flex items-center text-[11px] tracking-[0.2em] uppercase px-6 py-2.5',
              'transition-all duration-200 hover:-translate-y-px no-underline shrink-0',
              transparent ? 'bg-white text-terra hover:bg-cream' : 'bg-terra hover:bg-terra-deep text-white',
            ].join(' ')}
          >
            <T en="Book Now" it="Prenota" />
          </Link>

          {/* Language toggle */}
          <div className={['flex items-center rounded-full p-0.5 gap-0.5 transition-all duration-300', transparent ? 'bg-white/15' : 'bg-black/6'].join(' ')}>
            {(['en', 'it'] as Lang[]).map((l) => (
              <button key={l} onClick={() => setLang(l)}
                className={[
                  'text-[10px] tracking-[0.18em] uppercase font-normal px-3 py-1.5 rounded-full transition-all duration-200 leading-none',
                  lang === l
                    ? transparent ? 'bg-white text-terra shadow-sm' : 'bg-terra text-white shadow-sm'
                    : transparent ? 'text-white/70 hover:text-white' : 'text-ink-mid hover:text-ink',
                ].join(' ')}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          {/* BURGER — mobile only */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            className={[
              'md:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5 shrink-0',
              'bg-transparent border-0 cursor-pointer',
            ].join(' ')}
          >
            <span className={[
              'block w-5 h-px transition-all duration-300 origin-center',
              transparent ? 'bg-white' : 'bg-ink',
              mobileOpen ? 'rotate-45 translate-y-[7px]' : '',
            ].join(' ')} />
            <span className={[
              'block w-5 h-px transition-all duration-300',
              transparent ? 'bg-white' : 'bg-ink',
              mobileOpen ? 'opacity-0' : '',
            ].join(' ')} />
            <span className={[
              'block w-5 h-px transition-all duration-300 origin-center',
              transparent ? 'bg-white' : 'bg-ink',
              mobileOpen ? '-rotate-45 -translate-y-[7px]' : '',
            ].join(' ')} />
          </button>

        </div>
      </nav>

      {/* MOBILE DRAWER */}
      <div
        className={[
          'fixed inset-0 z-[100] md:hidden transition-all duration-300',
          mobileOpen ? 'pointer-events-auto' : 'pointer-events-none',
        ].join(' ')}
      >
        {/* Backdrop */}
        <div
          onClick={() => setMobileOpen(false)}
          className={[
            'absolute inset-0 bg-ink/60 transition-opacity duration-300',
            mobileOpen ? 'opacity-100' : 'opacity-0',
          ].join(' ')}
        />

        {/* Panel */}
        <div
          className={[
            'absolute top-[4.5rem] right-0 bottom-0 w-72 bg-white flex flex-col',
            'transition-transform duration-300 ease-out shadow-2xl',
            mobileOpen ? 'translate-x-0' : 'translate-x-full',
          ].join(' ')}
        >
          {/* Panel header */}
          <div className="flex items-center justify-between px-7 py-5 border-b border-black/8">
            <span className="font-cormorant text-[20px] font-light text-ink tracking-[0.1em]">
              <em>Le</em> Tre Vie
            </span>
            <button
              onClick={() => setMobileOpen(false)}
              className="text-ink-mid hover:text-ink transition-colors duration-200"
              aria-label="Close menu"
            >
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 4l12 12M16 4L4 16" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Panel links */}
          <nav className="flex flex-col flex-1 px-7 py-8 gap-1 overflow-y-auto">

            {/* Menu PDF accordion */}
            <div>
              <button
                onClick={() => setFoodOpen((v) => !v)}
                className="w-full flex items-center justify-between py-4 text-[12px] tracking-[0.22em] uppercase text-ink font-normal border-b border-black/6 bg-transparent border-x-0 border-t-0 cursor-pointer"
              >
                <T en="Menu" it="Menu" />
                <svg
                  className={`w-3 h-3 transition-transform duration-200 text-ink-mid ${foodOpen ? 'rotate-180' : ''}`}
                  viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.8"
                >
                  <path d="M1 1l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {foodOpen && (
                <div className="pl-4 py-2 flex flex-col gap-1">
                  <a
                    href={menuPdfs.menu}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileOpen(false)}
                    className="block py-3 text-[11px] tracking-[0.18em] uppercase text-ink-mid hover:text-ink no-underline transition-colors duration-150"
                  >
                    <T en="Menu" it="Menù" />
                  </a>
                  <a
                    href={menuPdfs.giorno}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileOpen(false)}
                    className="block py-3 text-[11px] tracking-[0.18em] uppercase text-ink-mid hover:text-ink no-underline transition-colors duration-150"
                  >
                    <T en="Daily Specials" it="Piatti del Giorno" />
                  </a>
                  <a
                    href={menuPdfs.vini}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileOpen(false)}
                    className="block py-3 text-[11px] tracking-[0.18em] uppercase text-ink-mid hover:text-ink no-underline transition-colors duration-150"
                  >
                    <T en="Wine List" it="Carta dei Vini" />
                  </a>
                </div>
              )}
            </div>

            <Link href="/#find-us" onClick={() => setMobileOpen(false)}
              className="py-4 text-[12px] tracking-[0.22em] uppercase text-ink border-b border-black/6 no-underline hover:text-terra transition-colors duration-200">
              <T en="Contact" it="Contatti" />
            </Link>
          </nav>

          {/* Panel footer */}
          <div className="px-7 py-6 border-t border-black/8">
            <Link
              href="/reserve"
              onClick={() => setMobileOpen(false)}
              className="block w-full bg-terra hover:bg-terra-deep text-white text-[11px] tracking-[0.24em] uppercase text-center py-4 no-underline transition-colors duration-200"
            >
              <T en="Book Now" it="Prenota" />
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

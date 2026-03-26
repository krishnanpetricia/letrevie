'use client'

import { useLang } from '@/context/LangContext'

interface TProps {
  en: React.ReactNode
  it: React.ReactNode
}

/**
 * Renders the correct copy based on the active language.
 * Usage: <T en="Our Story" it="La Nostra Storia" />
 */
export function T({ en, it }: TProps) {
  const { lang } = useLang()
  return <>{lang === 'en' ? en : it}</>
}

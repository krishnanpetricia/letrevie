'use client'

import { useLang, type Lang } from '@/context/LangContext'

export function LangBar() {
  const { lang, setLang } = useLang()

  const btn = (l: Lang, label: string) => (
    <button
      key={l}
      onClick={() => setLang(l)}
      aria-pressed={lang === l}
      className={[
        'font-jost text-[11px] tracking-[0.22em] uppercase px-3.5 py-1 transition-all duration-200',
        lang === l
          ? 'bg-terra text-white'
          : 'bg-transparent text-white/45 hover:text-white',
      ].join(' ')}
    >
      {label}
    </button>
  )

  return (
    <div className="bg-ink flex justify-end items-center gap-1.5 px-12 py-2.5">
      {btn('en', 'EN')}
      <span className="text-white/18 text-xs">/</span>
      {btn('it', 'IT')}
    </div>
  )
}

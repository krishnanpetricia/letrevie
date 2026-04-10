'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function BookingForm() {
  const [lang, setLang] = useState<'en' | 'it'>('en')
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [form, setForm] = useState({
    name: '', email: '', phone: '', date: '', time: '', covers: '', notes: ''
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const t = {
    en: {
      step1Title: 'Choose a date',
      step2Title: 'Choose a time',
      step3Title: 'Your details',
      stepOf: (n: number) => `Step ${n} of 3`,
      name: 'Full Name', email: 'Email', phone: 'Phone (optional)',
      covers: 'Number of Guests',
      notes: 'Special requests (optional)',
      next: 'Continue', back: 'Back', submit: 'Confirm Reservation',
      success: "Your reservation is confirmed. We'll see you soon.",
      noSlots: 'No availability for this date. Please try another day.',
      loading: 'Checking availability…',
      required: 'Please fill in all required fields.',
      selectDate: 'Select a date to see available times.',
    },
    it: {
      step1Title: 'Scegli una data',
      step2Title: 'Scegli un orario',
      step3Title: 'I tuoi dati',
      stepOf: (n: number) => `Passo ${n} di 3`,
      name: 'Nome e Cognome', email: 'Email', phone: 'Telefono (opzionale)',
      covers: 'Numero di Ospiti',
      notes: 'Richieste speciali (opzionale)',
      next: 'Continua', back: 'Indietro', submit: 'Conferma Prenotazione',
      success: 'La sua prenotazione è confermata. A presto.',
      noSlots: 'Nessuna disponibilità per questa data. Provi un altro giorno.',
      loading: 'Verifica disponibilità…',
      required: 'Si prega di compilare tutti i campi obbligatori.',
      selectDate: 'Seleziona una data per vedere gli orari disponibili.',
    }
  }[lang]

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    if (!form.date) return
    setLoadingSlots(true)
    setAvailableSlots([])
    setForm(f => ({ ...f, time: '' }))
    fetch(`/api/availability?date=${form.date}`)
      .then(r => r.json())
      .then(data => {
        setAvailableSlots(data.slots || [])
        setLoadingSlots(false)
      })
      .catch(() => setLoadingSlots(false))
  }, [form.date])

  const update = (field: string, value: string) =>
    setForm(f => ({ ...f, [field]: value }))

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.date || !form.time || !form.covers) {
      setErrorMsg(t.required)
      return
    }
    setStatus('loading')
    setErrorMsg('')
    const res = await fetch('/api/booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, lang }),
    })
    const data = await res.json()
    if (res.ok && data.success) {
      setStatus('success')
    } else {
      setStatus('error')
      setErrorMsg(data.error || 'Something went wrong. Please try again.')
    }
  }

  const inputClass = "w-full bg-transparent border-b border-[#c4a882] py-3 text-[#181410] placeholder-[#a89070] focus:outline-none focus:border-[#181410] transition-colors text-base"
  const selectClass = "w-full bg-transparent border-b border-[#c4a882] py-3 text-[#181410] focus:outline-none focus:border-[#181410] transition-colors text-base appearance-none cursor-pointer"

  if (status === 'success') {
    return (
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="text-center py-12 px-6">
        <div className="text-4xl mb-6">✓</div>
        <p className="text-[#181410] text-lg leading-relaxed">{t.success}</p>
      </motion.div>
    )
  }

  const stepTitles = [t.step1Title, t.step2Title, t.step3Title]

  return (
    <div className="w-full max-w-md mx-auto px-6 py-10">

      {/* Language toggle */}
      <div className="flex justify-end gap-3 mb-8 text-sm">
        {(['en', 'it'] as const).map(l => (
          <button key={l} onClick={() => setLang(l)}
            className={`uppercase tracking-widest transition-colors ${lang === l ? 'text-[#181410] font-semibold' : 'text-[#a89070]'}`}>
            {l}
          </button>
        ))}
      </div>

      {/* Step indicator */}
      <div className="mb-8">
        <p className="text-[#a89070] text-[11px] tracking-[0.28em] uppercase mb-3">
          {t.stepOf(step)}
        </p>
        <div className="flex gap-1.5">
          {[1, 2, 3].map(n => (
            <div key={n} className={`h-0.5 flex-1 transition-colors duration-300 ${n <= step ? 'bg-[#181410]' : 'bg-[#c4a882]'}`} />
          ))}
        </div>
        <h2 className="text-2xl font-light tracking-wide text-[#181410] mt-5">
          {stepTitles[step - 1]}
        </h2>
      </div>

      <AnimatePresence mode="wait">

        {/* ── Step 1: Date ── */}
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }} className="space-y-8">

            <input
              className={inputClass}
              type="date"
              min={today}
              value={form.date}
              onChange={e => update('date', e.target.value)}
            />

            {errorMsg && <p className="text-[#b5522a] text-sm">{errorMsg}</p>}

            <button
              onClick={() => {
                if (!form.date) { setErrorMsg(lang === 'it' ? 'Seleziona una data.' : 'Please select a date.'); return }
                setErrorMsg('')
                setStep(2)
              }}
              className="w-full py-4 bg-[#181410] text-[#f5e6d3] tracking-widest uppercase text-sm hover:bg-[#2d2420] transition-colors">
              {t.next}
            </button>
          </motion.div>
        )}

        {/* ── Step 2: Time slot ── */}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }} className="space-y-8">

            {loadingSlots ? (
              <p className="text-[#a89070] text-sm py-3">{t.loading}</p>
            ) : availableSlots.length === 0 ? (
              <p className="text-[#b5522a] text-sm py-3">{t.noSlots}</p>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {availableSlots.map(slot => (
                  <button
                    key={slot}
                    onClick={() => { update('time', slot); setStep(3) }}
                    className={`py-3.5 px-2 text-sm border transition-colors duration-150 ${
                      form.time === slot
                        ? 'bg-[#181410] text-[#f5e6d3] border-[#181410]'
                        : 'border-[#c4a882] text-[#181410] hover:border-[#181410]'
                    }`}>
                    {slot}
                  </button>
                ))}
              </div>
            )}

            {errorMsg && <p className="text-[#b5522a] text-sm">{errorMsg}</p>}

            <button
              onClick={() => { setErrorMsg(''); setStep(1) }}
              className="w-full py-4 border border-[#c4a882] text-[#181410] tracking-widest uppercase text-sm hover:border-[#181410] transition-colors">
              {t.back}
            </button>
          </motion.div>
        )}

        {/* ── Step 3: Guest details ── */}
        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }} className="space-y-8">

            {/* Summary of chosen date + time */}
            <div className="bg-[#f0e8df] px-5 py-4 text-sm text-[#6b5d4f] leading-relaxed">
              <span className="font-medium text-[#181410]">
                {new Date(`${form.date}T12:00:00`).toLocaleDateString(
                  lang === 'it' ? 'it-IT' : 'en-GB',
                  { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
                )}
              </span>
              {' · '}
              <span className="font-medium text-[#181410]">{form.time}</span>
            </div>

            <input className={inputClass} placeholder={t.name} value={form.name}
              onChange={e => update('name', e.target.value)} />
            <input className={inputClass} type="email" placeholder={t.email} value={form.email}
              onChange={e => update('email', e.target.value)} />
            <input className={inputClass} type="tel" placeholder={t.phone} value={form.phone}
              onChange={e => update('phone', e.target.value)} />

            <select className={selectClass} value={form.covers}
              onChange={e => update('covers', e.target.value)}>
              <option value="">{t.covers}</option>
              {[1, 2, 3, 4, 5, 6].map(n => (
                <option key={n} value={n}>
                  {n} {n === 1 ? (lang === 'it' ? 'ospite' : 'guest') : (lang === 'it' ? 'ospiti' : 'guests')}
                </option>
              ))}
            </select>

            <textarea className={`${inputClass} resize-none`} rows={2}
              placeholder={t.notes} value={form.notes}
              onChange={e => update('notes', e.target.value)} />

            {errorMsg && <p className="text-[#b5522a] text-sm">{errorMsg}</p>}

            <div className="flex gap-4 mt-4">
              <button
                onClick={() => { setErrorMsg(''); setStep(2) }}
                className="flex-1 py-4 border border-[#c4a882] text-[#181410] tracking-widest uppercase text-sm hover:border-[#181410] transition-colors">
                {t.back}
              </button>
              <button
                onClick={handleSubmit}
                disabled={status === 'loading'}
                className="flex-1 py-4 bg-[#181410] text-[#f5e6d3] tracking-widest uppercase text-sm hover:bg-[#2d2420] transition-colors disabled:opacity-50">
                {status === 'loading' ? '…' : t.submit}
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}

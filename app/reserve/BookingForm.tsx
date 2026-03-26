'use client'

import { useState, useMemo } from 'react'
import { T }      from '@/components/T'
import { FadeIn } from '@/components/FadeIn'
import { useLang } from '@/context/LangContext'

/* ─── Opening rules ──────────────────────────────────────────── */

function isDinnerDay(d: Date) {
  return d.getDay() !== 3 // closed Wednesday (3)
}

function isSundayLunch(d: Date) {
  return d.getDay() === 0
}

function isOpen(d: Date) {
  return isDinnerDay(d)
}

function getSlotsForDate(d: Date): string[] {
  const slots: string[] = []
  const addSlots = (startH: number, startM: number, endH: number, endM: number) => {
    let h = startH, m = startM
    while (h < endH || (h === endH && m <= endM)) {
      slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
      m += 15
      if (m >= 60) { m -= 60; h++ }
    }
  }
  if (isSundayLunch(d)) addSlots(12, 0, 13, 45) // lunch 12:00–13:45 last seating
  if (isDinnerDay(d))   addSlots(19, 0, 22, 15) // dinner 19:00–22:15 last seating
  return slots
}

/* ─── Date helpers ────────────────────────────────────────────── */

function toDateStr(d: Date) {
  return d.toISOString().slice(0, 10)
}

function addDays(d: Date, n: number) {
  const r = new Date(d)
  r.setDate(r.getDate() + n)
  return r
}

const DAYS_IT   = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab']
const DAYS_EN   = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS_IT = ['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic']
const MONTHS_EN = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function formatDate(d: Date, lang: string) {
  const day   = lang === 'it' ? DAYS_IT[d.getDay()]   : DAYS_EN[d.getDay()]
  const month = lang === 'it' ? MONTHS_IT[d.getMonth()]: MONTHS_EN[d.getMonth()]
  return `${day} ${d.getDate()} ${month}`
}

function formatDateLong(d: Date, lang: string) {
  const day   = lang === 'it' ? DAYS_IT[d.getDay()]   : DAYS_EN[d.getDay()]
  const month = lang === 'it' ? MONTHS_IT[d.getMonth()]: MONTHS_EN[d.getMonth()]
  return `${day} ${d.getDate()} ${month} ${d.getFullYear()}`
}

/* ─── Available dates — next 60 days, open days only ─────────── */
function getAvailableDates() {
  const dates: Date[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  // Start from tomorrow
  for (let i = 1; i <= 60; i++) {
    const d = addDays(today, i)
    if (isOpen(d)) dates.push(d)
  }
  return dates
}

/* ─── Sub-components ─────────────────────────────────────────── */

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="block text-[9px] tracking-[0.3em] uppercase text-terra font-normal mb-3">
      {children}
    </span>
  )
}

function Input({ id, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { id: string }) {
  return (
    <input
      id={id}
      {...props}
      className="w-full border border-black/15 bg-white px-4 py-3.5 text-[16px] text-ink placeholder-ink-mid/40 focus:outline-none focus:border-terra transition-colors duration-200"
    />
  )
}

/* ─── Main form ──────────────────────────────────────────────── */

type Step = 'date' | 'time' | 'details' | 'success'

export function BookingForm() {
  const { lang }                  = useLang()
  const [step, setStep]           = useState<Step>('date')
  const [selectedDate, setDate]   = useState<Date | null>(null)
  const [selectedTime, setTime]   = useState<string | null>(null)
  const [covers, setCovers]       = useState(2)
  const [name, setName]           = useState('')
  const [email, setEmail]         = useState('')
  const [phone, setPhone]         = useState('')
  const [notes, setNotes]         = useState('')
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')

  const availableDates = useMemo(() => getAvailableDates(), [])
  const slots          = useMemo(() => selectedDate ? getSlotsForDate(selectedDate) : [], [selectedDate])

  const lunchSlots  = slots.filter(s => parseInt(s) < 15)
  const dinnerSlots = slots.filter(s => parseInt(s) >= 19)

  // Group dates by month for display
  const datesByMonth = useMemo(() => {
    const map: Record<string, Date[]> = {}
    availableDates.forEach(d => {
      const key = `${d.getFullYear()}-${d.getMonth()}`
      if (!map[key]) map[key] = []
      map[key].push(d)
    })
    return map
  }, [availableDates])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedDate || !selectedTime) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, email, phone, notes, covers,
          date: formatDateLong(selectedDate, lang),
          time: selectedTime,
          lang,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setStep('success')
      } else {
        setError(lang === 'it'
          ? 'Errore nell\'invio. Prova a chiamarci direttamente.'
          : 'Something went wrong. Please call us directly.')
      }
    } catch {
      setError(lang === 'it'
        ? 'Errore di rete. Riprova o chiamaci.'
        : 'Network error. Please try again or call us.')
    } finally {
      setLoading(false)
    }
  }

  /* Progress indicator */
  const steps = [
    { id: 'date',    en: 'Date',    it: 'Data'    },
    { id: 'time',    en: 'Time',    it: 'Orario'  },
    { id: 'details', en: 'Details', it: 'Dettagli'},
  ]

  if (step === 'success') {
    return (
      <FadeIn className="text-center py-16 px-6">
        <div className="text-5xl mb-6">🍝</div>
        <h2 className="font-cormorant text-[32px] italic font-light text-ink mb-4">
          <T en="Request sent." it="Richiesta inviata." />
        </h2>
        <p className="text-[17px] text-ink-mid leading-relaxed max-w-md mx-auto mb-3">
          <T
            en={`Thank you, ${name}. We've emailed you the details and will confirm your table at ${selectedTime} on ${selectedDate ? formatDateLong(selectedDate, lang) : ''} shortly.`}
            it={`Grazie, ${name}. Le abbiamo inviato i dettagli via email e confermeremo il suo tavolo alle ${selectedTime} del ${selectedDate ? formatDateLong(selectedDate, lang) : ''} a breve.`}
          />
        </p>
        <p className="text-[15px] text-ink-mid/70 mb-10">
          <T
            en="Didn't receive an email? Check your spam folder or call us."
            it="Non ha ricevuto l'email? Controlli la posta indesiderata o ci chiami."
          />
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <a href="tel:+393520415653"
            className="inline-block bg-ink text-white text-[11px] tracking-[0.22em] uppercase px-10 py-4 no-underline hover:bg-ink/80 transition-colors duration-200">
            +39 352 041 5653
          </a>
          <button
            onClick={() => { setStep('date'); setDate(null); setTime(null); setName(''); setEmail(''); setPhone(''); setNotes('') }}
            className="inline-block border border-black/20 text-ink-mid text-[11px] tracking-[0.22em] uppercase px-10 py-4 hover:border-terra hover:text-terra transition-colors duration-200 bg-transparent cursor-pointer"
          >
            <T en="New booking" it="Nuova prenotazione" />
          </button>
        </div>
      </FadeIn>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">

      {/* Progress bar */}
      <div className="flex items-center gap-0 mb-10">
        {steps.map(({ id, en, it }, i) => {
          const active  = step === id
          const done    = steps.findIndex(s => s.id === step) > i
          return (
            <div key={id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div className={[
                  'w-7 h-7 rounded-full flex items-center justify-center text-[11px] transition-all duration-300',
                  done  ? 'bg-terra text-white' :
                  active ? 'bg-ink text-white' :
                  'bg-black/8 text-ink-mid',
                ].join(' ')}>
                  {done ? '✓' : i + 1}
                </div>
                <span className={[
                  'text-[9px] tracking-[0.2em] uppercase mt-1.5 transition-colors duration-300',
                  active ? 'text-ink' : 'text-ink-mid/50',
                ].join(' ')}>
                  {lang === 'it' ? it : en}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={[
                  'h-px flex-1 transition-colors duration-300 -mt-4 mx-1',
                  done ? 'bg-terra' : 'bg-black/10',
                ].join(' ')} />
              )}
            </div>
          )
        })}
      </div>

      {/* ── STEP 1: Date ── */}
      {step === 'date' && (
        <FadeIn>
          <Label><T en="Select a date" it="Seleziona una data" /></Label>

          {Object.entries(datesByMonth).map(([key, dates]) => {
            const sample = dates[0]
            const monthLabel = lang === 'it'
              ? `${MONTHS_IT[sample.getMonth()]} ${sample.getFullYear()}`
              : `${MONTHS_EN[sample.getMonth()]} ${sample.getFullYear()}`
            return (
              <div key={key} className="mb-8">
                <p className="text-[11px] tracking-[0.22em] uppercase text-ink-mid mb-3">{monthLabel}</p>
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-2">
                  {dates.map(d => {
                    const isSelected = selectedDate && toDateStr(d) === toDateStr(selectedDate)
                    const dayNames = lang === 'it' ? DAYS_IT : DAYS_EN
                    const monthNames = lang === 'it' ? MONTHS_IT : MONTHS_EN
                    return (
                      <button
                        key={toDateStr(d)}
                        onClick={() => { setDate(d); setTime(null) }}
                        className={[
                          'flex flex-col items-center py-3 px-1 border transition-all duration-150 cursor-pointer',
                          isSelected
                            ? 'bg-terra border-terra text-white'
                            : 'bg-white border-black/10 text-ink hover:border-terra hover:text-terra',
                        ].join(' ')}
                      >
                        <span className="text-[9px] tracking-[0.15em] uppercase opacity-70 mb-0.5">
                          {dayNames[d.getDay()]}
                        </span>
                        <span className="text-[18px] font-cormorant font-light leading-none">
                          {d.getDate()}
                        </span>
                        <span className="text-[9px] opacity-60 mt-0.5">
                          {monthNames[d.getMonth()]}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}

          <div className="mt-8 flex justify-end">
            <button
              onClick={() => setStep('time')}
              disabled={!selectedDate}
              className="bg-terra disabled:opacity-30 disabled:cursor-not-allowed hover:bg-terra-deep text-white text-[11px] tracking-[0.24em] uppercase px-12 py-4 transition-all duration-200 cursor-pointer"
            >
              <T en="Next →" it="Avanti →" />
            </button>
          </div>
        </FadeIn>
      )}

      {/* ── STEP 2: Time ── */}
      {step === 'time' && selectedDate && (
        <FadeIn>
          <button onClick={() => setStep('date')}
            className="flex items-center gap-1.5 text-[11px] tracking-[0.18em] uppercase text-ink-mid hover:text-terra transition-colors duration-200 mb-6 bg-transparent border-0 cursor-pointer p-0">
            ← <T en="Change date" it="Cambia data" />
          </button>

          <div className="mb-2 font-cormorant text-[20px] italic text-ink">
            {formatDateLong(selectedDate, lang)}
          </div>
          <Label><T en="Select a time" it="Seleziona un orario" /></Label>

          {lunchSlots.length > 0 && (
            <div className="mb-8">
              <p className="text-[10px] tracking-[0.24em] uppercase text-ink-mid mb-3">
                <T en="Sunday Lunch · 12:00–14:00" it="Pranzo Domenicale · 12:00–14:00" />
              </p>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {lunchSlots.map(slot => (
                  <button key={slot} onClick={() => setTime(slot)}
                    className={[
                      'py-3 text-[14px] border transition-all duration-150 cursor-pointer font-cormorant',
                      selectedTime === slot
                        ? 'bg-terra border-terra text-white'
                        : 'bg-white border-black/10 text-ink hover:border-terra hover:text-terra',
                    ].join(' ')}>
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}

          {dinnerSlots.length > 0 && (
            <div className="mb-8">
              <p className="text-[10px] tracking-[0.24em] uppercase text-ink-mid mb-3">
                <T en="Dinner · 19:00–22:30" it="Cena · 19:00–22:30" />
              </p>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {dinnerSlots.map(slot => (
                  <button key={slot} onClick={() => setTime(slot)}
                    className={[
                      'py-3 text-[14px] border transition-all duration-150 cursor-pointer font-cormorant',
                      selectedTime === slot
                        ? 'bg-terra border-terra text-white'
                        : 'bg-white border-black/10 text-ink hover:border-terra hover:text-terra',
                    ].join(' ')}>
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-end">
            <button
              onClick={() => setStep('details')}
              disabled={!selectedTime}
              className="bg-terra disabled:opacity-30 disabled:cursor-not-allowed hover:bg-terra-deep text-white text-[11px] tracking-[0.24em] uppercase px-12 py-4 transition-all duration-200 cursor-pointer"
            >
              <T en="Next →" it="Avanti →" />
            </button>
          </div>
        </FadeIn>
      )}

      {/* ── STEP 3: Details ── */}
      {step === 'details' && (
        <FadeIn>
          <button onClick={() => setStep('time')}
            className="flex items-center gap-1.5 text-[11px] tracking-[0.18em] uppercase text-ink-mid hover:text-terra transition-colors duration-200 mb-6 bg-transparent border-0 cursor-pointer p-0">
            ← <T en="Change time" it="Cambia orario" />
          </button>

          {/* Summary pill */}
          {selectedDate && selectedTime && (
            <div className="flex items-center gap-3 mb-8 bg-ink text-white px-5 py-3 text-[13px]">
              <span className="text-gold">📅</span>
              <span>{formatDateLong(selectedDate, lang)}</span>
              <span className="text-white/30">·</span>
              <span className="text-gold font-cormorant text-[16px]">{selectedTime}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Covers */}
            <div>
              <Label><T en="Number of guests" it="Numero di coperti" /></Label>
              <div className="flex items-center gap-3">
                {[1,2,3,4,5,6,7,8,9,10,11,12].map(n => (
                  <button
                    key={n} type="button"
                    onClick={() => setCovers(n)}
                    className={[
                      'w-10 h-10 text-[14px] border transition-all duration-150 cursor-pointer font-cormorant',
                      covers === n
                        ? 'bg-terra border-terra text-white'
                        : 'bg-white border-black/10 text-ink hover:border-terra hover:text-terra',
                    ].join(' ')}>
                    {n}
                  </button>
                ))}
              </div>
              {covers > 8 && (
                <p className="text-[13px] text-terra mt-2">
                  <T
                    en="For large groups please also call us to confirm."
                    it="Per gruppi numerosi si prega di chiamarci anche telefonicamente."
                  />
                </p>
              )}
            </div>

            {/* Name */}
            <div>
              <Label><T en="Full name" it="Nome e cognome" /></Label>
              <Input id="name" type="text" required placeholder={lang === 'it' ? 'Mario Rossi' : 'Your name'}
                value={name} onChange={e => setName(e.target.value)} />
            </div>

            {/* Email */}
            <div>
              <Label><T en="Email address" it="Indirizzo email" /></Label>
              <Input id="email" type="email" required placeholder={lang === 'it' ? 'la-tua@email.com' : 'your@email.com'}
                value={email} onChange={e => setEmail(e.target.value)} />
              <p className="text-[12px] text-ink-mid/60 mt-1.5">
                <T
                  en="We'll send your booking summary here."
                  it="Le invieremo il riepilogo della prenotazione qui."
                />
              </p>
            </div>

            {/* Phone */}
            <div>
              <Label><T en="Phone number (optional)" it="Numero di telefono (facoltativo)" /></Label>
              <Input id="phone" type="tel" placeholder="+39 000 000 0000"
                value={phone} onChange={e => setPhone(e.target.value)} />
            </div>

            {/* Notes */}
            <div>
              <Label><T en="Special requests (optional)" it="Richieste particolari (facoltativo)" /></Label>
              <textarea
                rows={3}
                placeholder={lang === 'it' ? 'Allergie, seggiolone, tavolo esterno...' : 'Allergies, highchair, outdoor table...'}
                value={notes} onChange={e => setNotes(e.target.value)}
                className="w-full border border-black/15 bg-white px-4 py-3.5 text-[16px] text-ink placeholder-ink-mid/40 focus:outline-none focus:border-terra transition-colors duration-200 resize-none"
              />
            </div>

            {error && (
              <p className="text-terra text-[14px] py-3 px-4 border border-terra/30 bg-terra/5">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !name || !email}
              className="w-full bg-terra disabled:opacity-40 disabled:cursor-not-allowed hover:bg-terra-deep text-white text-[11px] tracking-[0.28em] uppercase py-5 transition-all duration-200 cursor-pointer"
            >
              {loading
                ? (lang === 'it' ? 'Invio in corso...' : 'Sending...')
                : <T en="Send Booking Request" it="Invia Richiesta di Prenotazione" />
              }
            </button>

            <p className="text-[12px] text-ink-mid/60 text-center">
              <T
                en="Your table is not confirmed until you receive a reply from us."
                it="Il tavolo non è confermato fino a quando non riceve una risposta da noi."
              />
            </p>
          </form>
        </FadeIn>
      )}
    </div>
  )
}

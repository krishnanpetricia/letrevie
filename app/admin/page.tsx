'use client'

import { useState, useEffect, useRef } from 'react'

type Booking = {
  id: string
  created_at: string
  name: string
  email: string
  phone: string
  date: string
  time: string
  covers: number
  lang: string
  notes: string
  status: string
}

type BlockedSlot = {
  id: string
  date: string
  time: string | null
  reason: string | null
}

type Hours = {
  dinner_open: string
  dinner_close: string
  lunch_open: string
  lunch_close: string
  closed_day: number
  lunch_day: number
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function formatDate(dateStr: string) {
  const [y, m, d] = dateStr.split('-')
  return `${d}/${m}/${y}`
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [ready, setReady] = useState(false)
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [tab, setTab] = useState<'bookings' | 'block' | 'menu' | 'hours' | 'add-booking'>('bookings')

  const [bookings, setBookings] = useState<Booking[]>([])
  const [blocked, setBlocked] = useState<BlockedSlot[]>([])
  const [loading, setLoading] = useState(false)
  const [noteModal, setNoteModal] = useState<{ name: string; note: string } | null>(null)
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null)
  const [cancellingId, setCancellingId] = useState<string | null>(null)

  const [addForm, setAddForm] = useState({ name: '', date: '', time: '', covers: 2, phone: '', email: '', notes: '' })
  const [addSlots, setAddSlots] = useState<string[]>([])
  const [addSlotsLoading, setAddSlotsLoading] = useState(false)
  const [addMsg, setAddMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [addSubmitting, setAddSubmitting] = useState(false)

  const [blockDate, setBlockDate] = useState('')
  const [blockTime, setBlockTime] = useState('')
  const [blockReason, setBlockReason] = useState('')
  const [blockMsg, setBlockMsg] = useState('')

  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [menuMsg, setMenuMsg] = useState<{ ok: boolean; text: string } | null>(null)

  const [hours, setHours] = useState<Hours>({
    dinner_open: '19:00',
    dinner_close: '22:30',
    lunch_open: '12:00',
    lunch_close: '14:00',
    closed_day: 3,
    lunch_day: 0,
  })
  const [hoursLoading, setHoursLoading] = useState(false)
  const [hoursMsg, setHoursMsg] = useState<{ ok: boolean; text: string } | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('ltv_admin')
    if (stored === 'yes') setAuthed(true)
    setReady(true)
  }, [])

  useEffect(() => {
    if (authed) {
      fetchData()
      fetchHours()
    }
  }, [authed])

  useEffect(() => {
    if (!addForm.date) {
      setAddSlots([])
      setAddSlotsLoading(false)
      return
    }
    const controller = new AbortController()
    setAddSlotsLoading(true)
    setAddSlots([])
    fetch(
      `/api/availability?date=${addForm.date}&covers=${addForm.covers}`,
      { signal: controller.signal, cache: 'no-store' },
    )
      .then(r => r.json())
      .then(d => {
        setAddSlots(d.slots ?? [])
        setAddSlotsLoading(false)
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          setAddSlots([])
          setAddSlotsLoading(false)
        }
      })
    return () => controller.abort()
  }, [addForm.date, addForm.covers])

  const login = async () => {
    setAuthError('')
    const res = await fetch('/api/auth-check', {
      method: 'POST',
      headers: { 'x-admin-password': password },
    })
    if (res.ok) {
      localStorage.setItem('ltv_admin', 'yes')
      localStorage.setItem('ltv_admin_pw', password)
      setAuthed(true)
    } else {
      setAuthError('Incorrect password.')
    }
  }

  const logout = () => {
    localStorage.removeItem('ltv_admin')
    localStorage.removeItem('ltv_admin_pw')
    setAuthed(false)
    setBookings([])
    setBlocked([])
    setPassword('')
  }

  const getStoredPassword = () => localStorage.getItem('ltv_admin_pw') || ''

  const fetchData = async () => {
    setLoading(true)
    try {
      const [bRes, blRes] = await Promise.all([
        fetch(`/api/admin/bookings?t=${Date.now()}`),
        fetch(`/api/admin/blocked?t=${Date.now()}`),
      ])
      const bData = await bRes.json()
      const blData = await blRes.json()
      setBookings(bData.bookings || [])
      setBlocked(blData.blocked || [])
    } catch (e) {
      console.error('Fetch error:', e)
    }
    setLoading(false)
  }

  const fetchHours = async () => {
    try {
      const res = await fetch('/api/admin/hours')
      if (res.ok) {
        const data = await res.json()
        if (data.hours) setHours(data.hours)
      }
    } catch (e) {
      console.error('Hours fetch error:', e)
    }
  }

  const handleBlock = async () => {
    if (!blockDate) { setBlockMsg('Date is required.'); return }
    const res = await fetch('/api/admin/block', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: blockDate, time: blockTime || null, reason: blockReason || null }),
    })
    if (res.ok) {
      setBlockMsg('Blocked successfully.')
      setBlockDate(''); setBlockTime(''); setBlockReason('')
      fetchData()
    } else {
      setBlockMsg('Failed to block.')
    }
  }

  const handleUnblock = async (id: string) => {
    await fetch('/api/admin/block', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    fetchData()
  }

  const handleMenuUpload = async () => {
    const file = fileRef.current?.files?.[0]
    if (!file) { setMenuMsg({ ok: false, text: 'Please select a PDF file.' }); return }
    if (file.type !== 'application/pdf') {
      setMenuMsg({ ok: false, text: 'Only PDF files are accepted.' })
      return
    }
    setUploading(true)
    setMenuMsg(null)
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch('/api/upload-menu', {
      method: 'POST',
      headers: { 'x-admin-password': getStoredPassword() },
      body: formData,
    })
    setUploading(false)
    if (res.ok) {
      setMenuMsg({ ok: true, text: 'Menu updated. Changes are live.' })
      if (fileRef.current) fileRef.current.value = ''
    } else {
      setMenuMsg({ ok: false, text: 'Upload failed. Please try again.' })
    }
  }

  const handleSaveHours = async () => {
    setHoursLoading(true)
    setHoursMsg(null)
    const res = await fetch('/api/admin/hours', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': getStoredPassword(),
      },
      body: JSON.stringify({ hours }),
    })
    setHoursLoading(false)
    if (res.ok) {
      setHoursMsg({ ok: true, text: 'Opening hours updated.' })
    } else {
      setHoursMsg({ ok: false, text: 'Failed to save. Please try again.' })
    }
  }

  const handleAddBooking = async () => {
    if (!addForm.name || !addForm.date || !addForm.time || !addForm.covers) {
      setAddMsg({ ok: false, text: 'Name, date, time and covers are required.' })
      return
    }
    setAddSubmitting(true)
    setAddMsg(null)
    try {
      const res = await fetch('/api/admin/add-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': getStoredPassword() },
        body: JSON.stringify({ ...addForm, lang: 'en' }),
      })
      if (res.ok) {
        await fetchData()
        setAddMsg({ ok: true, text: 'Booking added and list refreshed.' })
        setAddForm({ name: '', date: '', time: '', covers: 2, phone: '', email: '', notes: '' })
        setAddSlots([])
      } else {
        const d = await res.json().catch(() => ({}))
        setAddMsg({ ok: false, text: d.error || 'Failed to add booking.' })
      }
    } catch {
      setAddMsg({ ok: false, text: 'Network error — please try again.' })
    } finally {
      setAddSubmitting(false)
    }
  }

  const handleCancel = async (booking: Booking) => {
    setCancellingId(booking.id)
    setCancelTarget(null)
    const res = await fetch('/api/admin/cancel-booking', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': getStoredPassword() },
      body: JSON.stringify({ id: booking.id }),
    })
    setCancellingId(null)
    if (res.ok) {
      await fetchData()
    }
  }

  const _now = new Date()
  const today = [
    _now.getFullYear(),
    String(_now.getMonth() + 1).padStart(2, '0'),
    String(_now.getDate()).padStart(2, '0'),
  ].join('-')
  const upcoming = bookings
    .filter(b => b.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))

  if (!ready) return null

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#fdf8f3] flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-light text-[#181410] mb-1">Le Tre Vie</h1>
          <p className="text-[#a89070] text-sm mb-8 tracking-wide uppercase">Admin</p>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
            className="w-full bg-transparent border-b border-[#c4a882] py-3 text-[#181410] placeholder-[#a89070] focus:outline-none focus:border-[#181410] transition-colors text-base mb-6"
          />
          {authError && <p className="text-[#b5522a] text-sm mb-4">{authError}</p>}
          <button
            onClick={login}
            className="w-full py-4 bg-[#181410] text-[#f5e6d3] tracking-widest uppercase text-sm hover:bg-[#2d2420] transition-colors"
          >
            Enter
          </button>
        </div>
      </div>
    )
  }

  const tabs = [
    { key: 'bookings',    label: 'Bookings' },
    { key: 'block',       label: 'Block Dates' },
    { key: 'menu',        label: 'Menu' },
    { key: 'hours',       label: 'Hours' },
    { key: 'add-booking', label: 'Add Booking' },
  ] as const

  return (
    <div className="min-h-screen bg-[#fdf8f3] px-6 py-10 max-w-3xl mx-auto">

      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-light text-[#181410]">Le Tre Vie</h1>
          <p className="text-[#a89070] text-sm tracking-wide uppercase">Admin</p>
        </div>
        <div className="flex gap-4">
          <button onClick={fetchData} className="text-sm text-[#a89070] hover:text-[#181410] transition-colors">
            Refresh
          </button>
          <button onClick={logout} className="text-sm text-[#a89070] hover:text-[#181410] transition-colors">
            Logout
          </button>
        </div>
      </div>

      <div className="flex gap-6 mb-8 border-b border-[#e8ddd4] overflow-x-auto">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`pb-3 text-sm tracking-wide uppercase whitespace-nowrap transition-colors ${
              tab === t.key ? 'text-[#181410] border-b-2 border-[#181410]' : 'text-[#a89070]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'bookings' && (
        <div className="space-y-4">
          {loading && <p className="text-[#a89070] text-sm">Loading...</p>}
          {!loading && upcoming.length === 0 && (
            <p className="text-[#a89070] text-sm">No upcoming bookings.</p>
          )}
          {upcoming.map(b => (
            <div key={b.id} className="bg-white border border-[#e8ddd4] rounded-lg p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-medium text-[#181410]">{b.name}</p>
                  <p className="text-sm text-[#a89070]">{b.email}{b.phone ? ` · ${b.phone}` : ''}</p>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <p className="text-sm font-medium text-[#181410]">{formatDate(b.date)} · {b.time}</p>
                  <p className="text-sm text-[#a89070]">{b.covers} {Number(b.covers) === 1 ? 'cover' : 'covers'}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {b.notes && (
                      <button
                        onClick={() => setNoteModal({ name: b.name, note: b.notes })}
                        className="text-[#a89070] hover:text-[#6b5d4f] transition-colors"
                        title="View note"
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round">
                          <path d="M14 1H2C1.45 1 1 1.45 1 2v8c0 .55.45 1 1 1h2v3l3-3h7c.55 0 1-.45 1-1V2c0-.55-.45-1-1-1z" />
                        </svg>
                      </button>
                    )}
                    <button
                      onClick={() => setCancelTarget(b)}
                      disabled={cancellingId === b.id}
                      className="text-xs text-[#a89070] hover:text-[#b5522a] transition-colors disabled:opacity-40"
                      title="Cancel booking"
                    >
                      {cancellingId === b.id ? 'Cancelling…' : 'Cancel'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'block' && (
        <div className="space-y-8">
          <div className="bg-white border border-[#e8ddd4] rounded-lg p-6 space-y-5">
            <h3 className="text-sm uppercase tracking-wide text-[#a89070]">Block a date or time slot</h3>
            <div>
              <label className="block text-xs text-[#a89070] uppercase tracking-wide mb-2">Date</label>
              <input
                type="date"
                value={blockDate}
                onChange={e => setBlockDate(e.target.value)}
                className="w-full bg-transparent border-b border-[#c4a882] py-3 text-[#181410] focus:outline-none focus:border-[#181410] transition-colors text-base"
              />
            </div>
            <div>
              <label className="block text-xs text-[#a89070] uppercase tracking-wide mb-2">
                Time <span className="normal-case text-[#a89070]">(leave empty to block the whole day)</span>
              </label>
              <input
                type="time"
                value={blockTime}
                onChange={e => setBlockTime(e.target.value)}
                className="w-full bg-transparent border-b border-[#c4a882] py-3 text-[#181410] focus:outline-none focus:border-[#181410] transition-colors text-base"
              />
            </div>
            <div>
              <label className="block text-xs text-[#a89070] uppercase tracking-wide mb-2">
                Reason <span className="normal-case text-[#a89070]">(optional)</span>
              </label>
              <input
                value={blockReason}
                onChange={e => setBlockReason(e.target.value)}
                placeholder="e.g. Private event, holiday"
                className="w-full bg-transparent border-b border-[#c4a882] py-3 text-[#181410] placeholder-[#a89070] focus:outline-none focus:border-[#181410] transition-colors text-base"
              />
            </div>
            {blockMsg && (
              <p className={`text-sm ${blockMsg.includes('success') ? 'text-green-700' : 'text-[#b5522a]'}`}>
                {blockMsg}
              </p>
            )}
            <button
              onClick={handleBlock}
              className="w-full py-4 bg-[#181410] text-[#f5e6d3] tracking-widest uppercase text-sm hover:bg-[#2d2420] transition-colors"
            >
              Block
            </button>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm uppercase tracking-wide text-[#a89070]">Currently blocked</h3>
            {blocked.length === 0 && <p className="text-sm text-[#a89070]">Nothing blocked.</p>}
            {blocked.map(b => (
              <div key={b.id} className="flex items-center justify-between bg-white border border-[#e8ddd4] rounded-lg px-5 py-4">
                <div>
                  <p className="text-sm text-[#181410]">
                    {formatDate(b.date)}{b.time ? ` · ${b.time}` : ' · All day'}
                  </p>
                  {b.reason && <p className="text-xs text-[#a89070]">{b.reason}</p>}
                </div>
                <button
                  onClick={() => handleUnblock(b.id)}
                  className="text-xs text-[#b5522a] hover:text-[#181410] transition-colors uppercase tracking-wide"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'menu' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#e8ddd4] rounded-lg p-6 space-y-5">
            <h3 className="text-sm uppercase tracking-wide text-[#a89070]">Update menu</h3>
            <p className="text-sm text-[#6b5d4f]">
              Upload a PDF to replace the current menu. The change goes live immediately.
            </p>
            <div>
              <label className="block text-xs text-[#a89070] uppercase tracking-wide mb-3">Select PDF file</label>
              <input
                ref={fileRef}
                type="file"
                accept="application/pdf"
                className="block w-full text-sm text-[#6b5d4f] file:mr-4 file:py-2 file:px-5 file:border file:border-[#c4a882] file:text-xs file:tracking-widest file:uppercase file:bg-transparent file:text-[#181410] file:cursor-pointer hover:file:border-[#181410] transition-colors"
              />
            </div>
            {menuMsg && (
              <p className={`text-sm ${menuMsg.ok ? 'text-green-700' : 'text-[#b5522a]'}`}>
                {menuMsg.text}
              </p>
            )}
            <button
              onClick={handleMenuUpload}
              disabled={uploading}
              className="w-full py-4 bg-[#181410] text-[#f5e6d3] tracking-widest uppercase text-sm hover:bg-[#2d2420] transition-colors disabled:opacity-40"
            >
              {uploading ? 'Uploading...' : 'Upload menu'}
            </button>
          </div>
        </div>
      )}

      {tab === 'hours' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#e8ddd4] rounded-lg p-6 space-y-6">
            <h3 className="text-sm uppercase tracking-wide text-[#a89070]">Dinner service</h3>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-xs text-[#a89070] uppercase tracking-wide mb-2">Opens</label>
                <input
                  type="time"
                  value={hours.dinner_open}
                  onChange={e => setHours(h => ({ ...h, dinner_open: e.target.value }))}
                  className="w-full bg-transparent border-b border-[#c4a882] py-3 text-[#181410] focus:outline-none focus:border-[#181410] transition-colors text-base"
                />
              </div>
              <div>
                <label className="block text-xs text-[#a89070] uppercase tracking-wide mb-2">Last booking</label>
                <input
                  type="time"
                  value={hours.dinner_close}
                  onChange={e => setHours(h => ({ ...h, dinner_close: e.target.value }))}
                  className="w-full bg-transparent border-b border-[#c4a882] py-3 text-[#181410] focus:outline-none focus:border-[#181410] transition-colors text-base"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-[#a89070] uppercase tracking-wide mb-2">Closed day</label>
              <select
                value={hours.closed_day}
                onChange={e => setHours(h => ({ ...h, closed_day: Number(e.target.value) }))}
                className="w-full bg-transparent border-b border-[#c4a882] py-3 text-[#181410] focus:outline-none focus:border-[#181410] transition-colors text-base"
              >
                {DAY_NAMES.map((d, i) => (
                  <option key={i} value={i}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white border border-[#e8ddd4] rounded-lg p-6 space-y-6">
            <h3 className="text-sm uppercase tracking-wide text-[#a89070]">Lunch service</h3>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-xs text-[#a89070] uppercase tracking-wide mb-2">Opens</label>
                <input
                  type="time"
                  value={hours.lunch_open}
                  onChange={e => setHours(h => ({ ...h, lunch_open: e.target.value }))}
                  className="w-full bg-transparent border-b border-[#c4a882] py-3 text-[#181410] focus:outline-none focus:border-[#181410] transition-colors text-base"
                />
              </div>
              <div>
                <label className="block text-xs text-[#a89070] uppercase tracking-wide mb-2">Last booking</label>
                <input
                  type="time"
                  value={hours.lunch_close}
                  onChange={e => setHours(h => ({ ...h, lunch_close: e.target.value }))}
                  className="w-full bg-transparent border-b border-[#c4a882] py-3 text-[#181410] focus:outline-none focus:border-[#181410] transition-colors text-base"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-[#a89070] uppercase tracking-wide mb-2">Lunch day</label>
              <select
                value={hours.lunch_day}
                onChange={e => setHours(h => ({ ...h, lunch_day: Number(e.target.value) }))}
                className="w-full bg-transparent border-b border-[#c4a882] py-3 text-[#181410] focus:outline-none focus:border-[#181410] transition-colors text-base"
              >
                {DAY_NAMES.map((d, i) => (
                  <option key={i} value={i}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          {hoursMsg && (
            <p className={`text-sm ${hoursMsg.ok ? 'text-green-700' : 'text-[#b5522a]'}`}>
              {hoursMsg.text}
            </p>
          )}

          <button
            onClick={handleSaveHours}
            disabled={hoursLoading}
            className="w-full py-4 bg-[#181410] text-[#f5e6d3] tracking-widest uppercase text-sm hover:bg-[#2d2420] transition-colors disabled:opacity-40"
          >
            {hoursLoading ? 'Saving...' : 'Save hours'}
          </button>

          <p className="text-xs text-[#a89070]">
            Changes update the booking system and website display immediately.
          </p>
        </div>
      )}

      {tab === 'add-booking' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#e8ddd4] rounded-lg p-6 space-y-5">
            <h3 className="text-sm uppercase tracking-wide text-[#a89070]">Log a phone or walk-in booking</h3>

            {/* Name */}
            <div>
              <label className="block text-xs text-[#a89070] uppercase tracking-wide mb-2">Name <span className="text-[#b5522a]">*</span></label>
              <input
                value={addForm.name}
                onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))}
                className="w-full bg-transparent border-b border-[#c4a882] py-3 text-[#181410] placeholder-[#a89070] focus:outline-none focus:border-[#181410] transition-colors text-base"
                placeholder="Guest name"
              />
            </div>

            {/* Date + Covers side by side */}
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-xs text-[#a89070] uppercase tracking-wide mb-2">Date <span className="text-[#b5522a]">*</span></label>
                <input
                  type="date"
                  value={addForm.date}
                  min={today}
                  onChange={e => setAddForm(f => ({ ...f, date: e.target.value, time: '' }))}
                  className="w-full bg-transparent border-b border-[#c4a882] py-3 text-[#181410] focus:outline-none focus:border-[#181410] transition-colors text-base"
                />
              </div>
              <div>
                <label className="block text-xs text-[#a89070] uppercase tracking-wide mb-2">Covers <span className="text-[#b5522a]">*</span></label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={addForm.covers}
                  onChange={e => setAddForm(f => ({ ...f, covers: Number(e.target.value), time: '' }))}
                  className="w-full bg-transparent border-b border-[#c4a882] py-3 text-[#181410] focus:outline-none focus:border-[#181410] transition-colors text-base"
                />
              </div>
            </div>

            {/* Time */}
            <div>
              <label className="block text-xs text-[#a89070] uppercase tracking-wide mb-2">Time <span className="text-[#b5522a]">*</span></label>
              {addSlotsLoading && (
                <p className="text-sm text-[#a89070] animate-pulse">Fetching available times…</p>
              )}
              {!addSlotsLoading && addForm.date && addSlots.length === 0 && (
                <p className="text-sm text-[#b5522a]">
                  No slots available — the restaurant may be closed this day, or all times are fully booked.
                </p>
              )}
              {!addSlotsLoading && addSlots.length > 0 && (
                <select
                  value={addForm.time}
                  onChange={e => setAddForm(f => ({ ...f, time: e.target.value }))}
                  className="w-full bg-transparent border-b border-[#c4a882] py-3 text-[#181410] focus:outline-none focus:border-[#181410] transition-colors text-base"
                >
                  <option value="">Select a time</option>
                  {addSlots.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              )}
            </div>

            {/* Phone + Email side by side */}
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-xs text-[#a89070] uppercase tracking-wide mb-2">Phone</label>
                <input
                  type="tel"
                  value={addForm.phone}
                  onChange={e => setAddForm(f => ({ ...f, phone: e.target.value }))}
                  className="w-full bg-transparent border-b border-[#c4a882] py-3 text-[#181410] placeholder-[#a89070] focus:outline-none focus:border-[#181410] transition-colors text-base"
                  placeholder="Optional"
                />
              </div>
              <div>
                <label className="block text-xs text-[#a89070] uppercase tracking-wide mb-2">Email</label>
                <input
                  type="email"
                  value={addForm.email}
                  onChange={e => setAddForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full bg-transparent border-b border-[#c4a882] py-3 text-[#181410] placeholder-[#a89070] focus:outline-none focus:border-[#181410] transition-colors text-base"
                  placeholder="Optional"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs text-[#a89070] uppercase tracking-wide mb-2">Notes</label>
              <textarea
                value={addForm.notes}
                onChange={e => setAddForm(f => ({ ...f, notes: e.target.value }))}
                rows={3}
                className="w-full bg-transparent border-b border-[#c4a882] py-3 text-[#181410] placeholder-[#a89070] focus:outline-none focus:border-[#181410] transition-colors text-base resize-none"
                placeholder="e.g. called to book, wants outside table"
              />
            </div>

            {addMsg && (
              <p className={`text-sm ${addMsg.ok ? 'text-green-700' : 'text-[#b5522a]'}`}>
                {addMsg.text}
              </p>
            )}

            <button
              onClick={handleAddBooking}
              disabled={addSubmitting}
              className="w-full py-4 bg-[#181410] text-[#f5e6d3] tracking-widest uppercase text-sm hover:bg-[#2d2420] transition-colors disabled:opacity-40"
            >
              {addSubmitting ? 'Saving…' : 'Add Booking'}
            </button>
          </div>
        </div>
      )}

      {cancelTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/30"
          onClick={() => setCancelTarget(null)}
        >
          <div
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <p className="font-medium text-[#181410]">Cancel this booking?</p>
            <p className="text-sm text-[#6b5d4f] leading-relaxed">
              {cancelTarget.name} &mdash; {formatDate(cancelTarget.date)} at {cancelTarget.time}
              <br />
              This cannot be undone.
            </p>
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setCancelTarget(null)}
                className="flex-1 py-2 rounded-lg border border-[#c4a882] text-sm text-[#6b5d4f] hover:bg-[#fdf8f3] transition-colors"
              >
                Keep booking
              </button>
              <button
                onClick={() => handleCancel(cancelTarget)}
                className="flex-1 py-2 rounded-lg bg-[#b5522a] text-white text-sm hover:bg-[#9a4424] transition-colors"
              >
                Yes, cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {noteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/30"
          onClick={() => setNoteModal(null)}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="font-medium text-[#181410]">{noteModal.name}</p>
              <button
                onClick={() => setNoteModal(null)}
                className="text-[#a89070] hover:text-[#181410] transition-colors"
                aria-label="Close"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M3 3l10 10M13 3L3 13" />
                </svg>
              </button>
            </div>
            <p className="text-sm text-[#6b5d4f] leading-relaxed">{noteModal.note}</p>
          </div>
        </div>
      )}

    </div>
  )
}

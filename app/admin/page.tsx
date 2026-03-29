'use client'

import { useState, useEffect, useCallback } from 'react'

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
}

type BlockedSlot = {
  id: string
  date: string
  time: string | null
  reason: string | null
}

export default function AdminPage() {
  const [auth, setAuth] = useState(false)
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [blocked, setBlocked] = useState<BlockedSlot[]>([])
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState<'bookings' | 'block'>('bookings')
  const [blockDate, setBlockDate] = useState('')
  const [blockTime, setBlockTime] = useState('')
  const [blockReason, setBlockReason] = useState('')
  const [blockMsg, setBlockMsg] = useState('')

  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'letrevie2024'

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [bRes, blRes] = await Promise.all([
        fetch('/api/admin/bookings', { cache: 'no-store' }),
        fetch('/api/admin/blocked', { cache: 'no-store' }),
      ])
      const bData = await bRes.json()
      const blData = await blRes.json()
      setBookings(bData.bookings || [])
      setBlocked(blData.blocked || [])
    } catch (e) {
      console.error('Failed to load data', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (auth) {
      loadData()
    }
  }, [auth, loadData])

  const login = () => {
    if (password === ADMIN_PASSWORD) {
      setAuth(true)
    } else {
      setAuthError('Incorrect password.')
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
      loadData()
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
    loadData()
  }

  const today = new Date().toISOString().split('T')[0]
  const upcoming = bookings
    .filter(b => b.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))

  const formatDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-')
    return `${d}/${m}/${y}`
  }

  if (!auth) {
    return (
      <div className="min-h-screen bg-[#fdf8f3] flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-light text-[#181410] mb-2">Le Tre Vie</h1>
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
          <button onClick={login}
            className="w-full py-4 bg-[#181410] text-[#f5e6d3] tracking-widest uppercase text-sm hover:bg-[#2d2420] transition-colors">
            Enter
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fdf8f3] px-6 py-10 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-light text-[#181410]">Le Tre Vie</h1>
          <p className="text-[#a89070] text-sm tracking-wide uppercase">Admin Dashboard</p>
        </div>
        <button onClick={loadData} className="text-sm text-[#a89070] hover:text-[#181410] transition-colors">
          Refresh
        </button>
      </div>

      <div className="flex gap-6 mb-8 border-b border-[#e8ddd4]">
        {(['bookings', 'block'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`pb-3 text-sm tracking-wide uppercase transition-colors ${tab === t ? 'text-[#181410] border-b-2 border-[#181410]' : 'text-[#a89070]'}`}>
            {t === 'bookings' ? 'Bookings' : 'Block Dates'}
          </button>
        ))}
      </div>

      {loading && <p className="text-[#a89070] text-sm">Loading...</p>}

      {tab === 'bookings' && !loading && (
        <div className="space-y-4">
          {upcoming.length === 0 && (
            <p className="text-[#a89070] text-sm">No upcoming bookings.</p>
          )}
          {upcoming.map(b => (
            <div key={b.id} className="bg-white border border-[#e8ddd4] rounded-lg p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-medium text-[#181410]">{b.name}</p>
                  <p className="text-sm text-[#a89070]">{b.email} {b.phone ? `· ${b.phone}` : ''}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-[#181410]">{formatDate(b.date)} · {b.time}</p>
                  <p className="text-sm text-[#a89070]">{b.covers} {Number(b.covers) === 1 ? 'cover' : 'covers'}</p>
                </div>
              </div>
              {b.notes && <p className="text-sm text-[#6b5d4f] border-t border-[#f0e8df] pt-3 mt-2">{b.notes}</p>}
            </div>
          ))}
        </div>
      )}

      {tab === 'block' && !loading && (
        <div className="space-y-8">
          <div className="bg-white border border-[#e8ddd4] rounded-lg p-6 space-y-5">
            <h3 className="text-sm uppercase tracking-wide text-[#a89070]">Block a date or slot</h3>
            <input type="date" value={blockDate} onChange={e => setBlockDate(e.target.value)}
              className="w-full bg-transparent border-b border-[#c4a882] py-3 text-[#181410] focus:outline-none focus:border-[#181410] transition-colors text-base" />
            <input type="time" value={blockTime} onChange={e => setBlockTime(e.target.value)}
              placeholder="Leave empty to block entire day"
              className="w-full bg-transparent border-b border-[#c4a882] py-3 text-[#181410] placeholder-[#a89070] focus:outline-none focus:border-[#181410] transition-colors text-base" />
            <input value={blockReason} onChange={e => setBlockReason(e.target.value)}
              placeholder="Reason (optional)"
              className="w-full bg-transparent border-b border-[#c4a882] py-3 text-[#181410] placeholder-[#a89070] focus:outline-none focus:border-[#181410] transition-colors text-base" />
            {blockMsg && <p className="text-sm text-[#b5522a]">{blockMsg}</p>}
            <button onClick={handleBlock}
              className="w-full py-4 bg-[#181410] text-[#f5e6d3] tracking-widest uppercase text-sm hover:bg-[#2d2420] transition-colors">
              Block
            </button>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm uppercase tracking-wide text-[#a89070]">Currently blocked</h3>
            {blocked.length === 0 && <p className="text-sm text-[#a89070]">Nothing blocked.</p>}
            {blocked.map(b => (
              <div key={b.id} className="flex items-center justify-between bg-white border border-[#e8ddd4] rounded-lg px-5 py-4">
                <div>
                  <p className="text-sm text-[#181410]">{formatDate(b.date)} {b.time ? `· ${b.time}` : '· All day'}</p>
                  {b.reason && <p className="text-xs text-[#a89070]">{b.reason}</p>}
                </div>
                <button onClick={() => handleUnblock(b.id)}
                  className="text-xs text-[#b5522a] hover:text-[#181410] transition-colors uppercase tracking-wide">
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

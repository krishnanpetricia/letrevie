'use client'

import { useState, useRef } from 'react'

export default function EditPage() {
  const [password,    setPassword]    = useState('')
  const [authed,      setAuthed]      = useState(false)
  const [authError,   setAuthError]   = useState(false)
  const [uploading,   setUploading]   = useState(false)
  const [menuMessage, setMenuMessage] = useState<{ ok: boolean; text: string } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleAuth() {
    const res = await fetch('/api/auth-check', {
      method: 'POST',
      headers: { 'x-admin-password': password },
    })
    if (res.ok) {
      setAuthed(true)
      setAuthError(false)
    } else {
      setAuthError(true)
    }
  }

  async function handleMenuUpload() {
    const file = fileRef.current?.files?.[0]
    if (!file) return
    if (file.type !== 'application/pdf') {
      setMenuMessage({ ok: false, text: 'Seleziona un file PDF.' })
      return
    }

    setUploading(true)
    setMenuMessage(null)

    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('/api/upload-menu', {
      method: 'POST',
      headers: { 'x-admin-password': password },
      body: formData,
    })

    setUploading(false)

    if (res.ok) {
      setMenuMessage({ ok: true, text: 'Menu aggiornato. Le modifiche sono live.' })
      if (fileRef.current) fileRef.current.value = ''
    } else {
      setMenuMessage({ ok: false, text: 'Errore durante il caricamento. Riprova.' })
    }
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <p className="font-cormorant text-[32px] italic text-ink mb-8 text-center">
            Aggiorna il sito
          </p>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAuth()}
            placeholder="Password"
            className="w-full border border-black/20 bg-transparent px-4 py-3 text-[14px] text-ink placeholder:text-ink-mid outline-none focus:border-terra mb-4"
          />
          {authError && (
            <p className="text-[12px] text-red-600 mb-4">Password errata.</p>
          )}
          <button
            onClick={handleAuth}
            className="w-full bg-terra text-white text-[11px] tracking-[0.24em] uppercase px-6 py-4 hover:bg-terra-deep transition-colors"
          >
            Entra
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream px-6 py-20">
      <div className="max-w-lg mx-auto">

        <p className="font-cormorant text-[36px] italic text-ink mb-2">Aggiorna il sito</p>
        <p className="text-[14px] text-ink-mid mb-16">Solo per uso interno.</p>

        <div className="border border-black/10 p-8">
          <p className="text-[9px] tracking-[0.28em] uppercase text-terra mb-2">Menu</p>
          <p className="text-[14px] text-ink-mid mb-6">Carica un nuovo PDF per aggiornare il menu sul sito.</p>

          <input
            ref={fileRef}
            type="file"
            accept="application/pdf"
            className="block w-full text-[13px] text-ink-mid mb-6 file:mr-4 file:py-2 file:px-4 file:border file:border-black/20 file:text-[11px] file:tracking-[0.2em] file:uppercase file:bg-transparent file:text-ink file:cursor-pointer"
          />

          <button
            onClick={handleMenuUpload}
            disabled={uploading}
            className="bg-terra text-white text-[11px] tracking-[0.24em] uppercase px-10 py-4 hover:bg-terra-deep transition-colors disabled:opacity-50"
          >
            {uploading ? 'Caricamento in corso...' : 'Carica nuovo menu'}
          </button>

          {menuMessage && (
            <p className={`mt-4 text-[13px] ${menuMessage.ok ? 'text-green-700' : 'text-red-600'}`}>
              {menuMessage.text}
            </p>
          )}
        </div>

      </div>
    </div>
  )
}

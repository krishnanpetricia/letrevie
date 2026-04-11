#!/usr/bin/env node
/**
 * Menu Upload API smoke test
 *
 * For each of the three menu types this script:
 *   1. Reads the current timestamp from site_settings (DB baseline)
 *   2. POSTs a minimal PDF to /api/upload-menu with the correct menu_type
 *   3. Re-reads site_settings and asserts the timestamp increased
 *   4. Asserts the DB value matches the version returned in the JSON response
 *
 * Prerequisites:
 *   - Create .env.local in the project root (see below)
 *   - Run `npm run dev` in a separate terminal first
 *
 * .env.local must contain:
 *   ADMIN_PASSWORD=<your admin password>
 *   NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY=<service role key>
 *
 * Run:
 *   npm run test:menu
 *   — or —
 *   node scripts/test-menu-upload.mjs
 *   node scripts/test-menu-upload.mjs --url https://your-preview.vercel.app
 */

import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'

// ─── paths ────────────────────────────────────────────────────────────────────

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

// ─── env loading ──────────────────────────────────────────────────────────────
// Parses KEY=VALUE lines from .env.local (or .env) without any extra packages.

function loadEnv () {
  for (const filename of ['.env.local', '.env']) {
    try {
      const raw = readFileSync(join(ROOT, filename), 'utf8')
      for (const line of raw.split('\n')) {
        const trimmed = line.trim()
        if (!trimmed || trimmed.startsWith('#')) continue
        const eq = trimmed.indexOf('=')
        if (eq === -1) continue
        const key = trimmed.slice(0, eq).trim()
        const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '')
        if (!process.env[key]) process.env[key] = val
      }
      console.log(`  env loaded from ${filename}`)
      return
    } catch {
      // file doesn't exist — try the next one
    }
  }
}

loadEnv()

// ─── config ───────────────────────────────────────────────────────────────────

// Override the target URL with --url <value> to test staging / production.
const urlFlag = process.argv.indexOf('--url')
const BASE_URL = urlFlag !== -1
  ? process.argv[urlFlag + 1]
  : (process.env.TEST_BASE_URL || 'http://localhost:3000')

const ADMIN_PASSWORD      = process.env.ADMIN_PASSWORD
const SUPABASE_URL        = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

// ─── env validation ───────────────────────────────────────────────────────────

const missing = [
  !ADMIN_PASSWORD       && 'ADMIN_PASSWORD',
  !SUPABASE_URL         && 'NEXT_PUBLIC_SUPABASE_URL',
  !SUPABASE_SERVICE_KEY && 'SUPABASE_SERVICE_ROLE_KEY',
].filter(Boolean)

if (missing.length) {
  console.error('\n  Missing environment variables:')
  for (const v of missing) console.error(`    • ${v}`)
  console.error('\n  Create .env.local in the project root with these values.')
  console.error('  See the comment at the top of this file for the required keys.\n')
  process.exit(1)
}

// ─── Supabase client (service role — bypasses RLS for authoritative reads) ───

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// ─── minimal valid PDF ────────────────────────────────────────────────────────
// The API validates file.type only, not the content. This is the smallest
// byte sequence that satisfies both the MIME check and is a parseable PDF.

const PDF_BYTES = Buffer.from(
  '%PDF-1.0\n' +
  '1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n' +
  '2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n' +
  '3 0 obj<</Type/Page/MediaBox[0 0 3 3]>>endobj\n' +
  'xref\n0 4\n' +
  '0000000000 65535 f \n' +
  '0000000009 00000 n \n' +
  '0000000052 00000 n \n' +
  '0000000101 00000 n \n' +
  'trailer<</Size 4/Root 1 0 R>>\n' +
  'startxref\n9\n%%EOF\n'
)

// ─── menu type definitions ────────────────────────────────────────────────────

const MENU_TYPES = [
  { type: 'menu',               settingsKey: 'menu_last_updated',   label: 'Main Menu'         },
  { type: 'piatti-del-giorno',  settingsKey: 'piatti_last_updated', label: 'Piatti del Giorno' },
  { type: 'carta-dei-vini',     settingsKey: 'vini_last_updated',   label: 'Carta dei Vini'    },
]

// ─── helpers ──────────────────────────────────────────────────────────────────

let passed = 0
let failed = 0

function pass (msg) {
  console.log(`    ✓  ${msg}`)
  passed++
}

function fail (msg) {
  console.error(`    ✗  ${msg}`)
  failed++
}

function assert (condition, passMsg, failMsg) {
  condition ? pass(passMsg) : fail(failMsg)
}

async function getTimestamp (key) {
  const { data, error } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', key)
    .single()
  if (error) throw new Error(`DB read failed for "${key}": ${error.message}`)
  return data?.value ? Number(data.value) : null
}

async function uploadMenu (menuType) {
  const blob = new Blob([PDF_BYTES], { type: 'application/pdf' })
  const formData = new FormData()
  formData.append('file', blob, `${menuType}-test.pdf`)
  formData.append('menu_type', menuType)

  const res = await fetch(`${BASE_URL}/api/upload-menu`, {
    method: 'POST',
    headers: { 'x-admin-password': ADMIN_PASSWORD },
    body: formData,
  })
  const body = await res.json().catch(() => ({}))
  return { status: res.status, body }
}

async function checkServer () {
  try {
    await fetch(BASE_URL, { signal: AbortSignal.timeout(4000) })
  } catch {
    console.error(`\n  Cannot reach ${BASE_URL}`)
    console.error('  Start the dev server first:  npm run dev\n')
    process.exit(1)
  }
}

// ─── rejection tests ──────────────────────────────────────────────────────────

async function runRejectionTests () {
  console.log('\n── Rejection tests ──')

  // Wrong password
  {
    const blob = new Blob([PDF_BYTES], { type: 'application/pdf' })
    const fd = new FormData()
    fd.append('file', blob, 'test.pdf')
    fd.append('menu_type', 'menu')
    const res = await fetch(`${BASE_URL}/api/upload-menu`, {
      method: 'POST',
      headers: { 'x-admin-password': 'wrong-password' },
      body: fd,
    })
    assert(res.status === 401, 'Wrong password → 401', `Wrong password → expected 401, got ${res.status}`)
  }

  // Missing menu_type
  {
    const blob = new Blob([PDF_BYTES], { type: 'application/pdf' })
    const fd = new FormData()
    fd.append('file', blob, 'test.pdf')
    // no menu_type appended
    const res = await fetch(`${BASE_URL}/api/upload-menu`, {
      method: 'POST',
      headers: { 'x-admin-password': ADMIN_PASSWORD },
      body: fd,
    })
    assert(res.status === 400, 'Missing menu_type → 400', `Missing menu_type → expected 400, got ${res.status}`)
  }

  // Invalid menu_type
  {
    const blob = new Blob([PDF_BYTES], { type: 'application/pdf' })
    const fd = new FormData()
    fd.append('file', blob, 'test.pdf')
    fd.append('menu_type', 'not-a-valid-type')
    const res = await fetch(`${BASE_URL}/api/upload-menu`, {
      method: 'POST',
      headers: { 'x-admin-password': ADMIN_PASSWORD },
      body: fd,
    })
    assert(res.status === 400, 'Invalid menu_type → 400', `Invalid menu_type → expected 400, got ${res.status}`)
  }

  // Non-PDF file
  {
    const blob = new Blob(['hello world'], { type: 'text/plain' })
    const fd = new FormData()
    fd.append('file', blob, 'test.txt')
    fd.append('menu_type', 'menu')
    const res = await fetch(`${BASE_URL}/api/upload-menu`, {
      method: 'POST',
      headers: { 'x-admin-password': ADMIN_PASSWORD },
      body: fd,
    })
    assert(res.status === 400, 'Non-PDF file → 400', `Non-PDF file → expected 400, got ${res.status}`)
  }
}

// ─── main ─────────────────────────────────────────────────────────────────────

async function main () {
  console.log('\n╔══════════════════════════════════════╗')
  console.log('║     Menu Upload API — smoke test     ║')
  console.log('╚══════════════════════════════════════╝')
  console.log(`\n  Target : ${BASE_URL}`)
  console.log(`  DB     : ${SUPABASE_URL}\n`)

  await checkServer()
  console.log('  Dev server reachable ✓\n')

  // ── upload + DB verification tests ────────────────────────────────────────

  for (const { type, settingsKey, label } of MENU_TYPES) {
    console.log(`\n── ${label}  (menu_type: "${type}") ──`)

    // 1. baseline
    const before = await getTimestamp(settingsKey)
    console.log(`  DB before : ${before ?? '(no row yet)'}`)

    // small gap so Date.now() is guaranteed > before
    await new Promise(r => setTimeout(r, 20))

    // 2. upload
    const { status, body } = await uploadMenu(type)
    console.log(`  Response  : ${status} ${JSON.stringify(body)}`)

    // 3. assertions on the HTTP response
    assert(status === 200,              `HTTP 200`,                         `Expected HTTP 200, got ${status}`)
    assert(body.success === true,       `body.success === true`,            `body.success was ${JSON.stringify(body.success)}`)
    assert(typeof body.version === 'number',
                                        `body.version is a number (${body.version})`,
                                        `body.version missing or wrong type: ${JSON.stringify(body.version)}`)

    // 4. re-read DB and verify
    const after = await getTimestamp(settingsKey)
    console.log(`  DB after  : ${after}`)

    assert(after !== null,
           `"${settingsKey}" row exists in site_settings`,
           `"${settingsKey}" row is null after upload`)

    assert(after > (before ?? 0),
           `timestamp increased  (${before ?? 0} → ${after})`,
           `timestamp did NOT increase  (${before ?? 0} → ${after})`)

    assert(after === body.version,
           `DB value matches response version  (${after})`,
           `DB value (${after}) ≠ response version (${body.version})`)
  }

  // ── rejection tests ───────────────────────────────────────────────────────
  await runRejectionTests()

  // ── summary ───────────────────────────────────────────────────────────────
  const total = passed + failed
  console.log('\n' + '─'.repeat(42))
  console.log(`  ${total} assertions — ${passed} passed, ${failed} failed`)

  if (failed > 0) {
    console.error(`\n  ✗ Some tests failed.\n`)
    process.exit(1)
  } else {
    console.log(`\n  ✓ All tests passed.\n`)
  }
}

main().catch(err => {
  console.error('\nUnexpected error:', err)
  process.exit(1)
})

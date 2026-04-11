import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!

type MenuType = 'menu' | 'piatti-del-giorno' | 'carta-dei-vini'

const MENU_CONFIG: Record<MenuType, { storagePath: string; settingsKey: string }> = {
  'menu':              { storagePath: 'menu.pdf',              settingsKey: 'menu_last_updated'   },
  'piatti-del-giorno': { storagePath: 'piatti-del-giorno.pdf', settingsKey: 'piatti_last_updated' },
  'carta-dei-vini':    { storagePath: 'carta-dei-vini.pdf',    settingsKey: 'vini_last_updated'   },
}

export async function POST(req: NextRequest) {
  const password = req.headers.get('x-admin-password')
  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await req.formData()
  const file     = formData.get('file')      as File   | null
  const menuType = formData.get('menu_type') as string | null

  if (!file || file.type !== 'application/pdf') {
    return NextResponse.json({ error: 'A PDF file is required' }, { status: 400 })
  }

  if (!menuType || !(menuType in MENU_CONFIG)) {
    return NextResponse.json({ error: 'Invalid menu_type' }, { status: 400 })
  }

  const { storagePath, settingsKey } = MENU_CONFIG[menuType as MenuType]

  const bytes  = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const { error } = await supabaseAdmin.storage
    .from('menus')
    .upload(storagePath, buffer, {
      contentType: 'application/pdf',
      upsert: true,
      cacheControl: 'no-cache',
    })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const version = Date.now()

  const { error: dbError } = await supabaseAdmin
    .from('site_settings')
    .upsert({ key: settingsKey, value: String(version) })

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, version })
}

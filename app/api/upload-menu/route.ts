import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
 
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!
 
export async function POST(req: NextRequest) {
  const password = req.headers.get('x-admin-password')
  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
 
  const formData = await req.formData()
  const file = formData.get('file') as File | null
 
  if (!file || file.type !== 'application/pdf') {
    return NextResponse.json({ error: 'A PDF file is required' }, { status: 400 })
  }
 
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
 
  const { error } = await supabaseAdmin.storage
    .from('menus')
    .upload('menu.pdf', buffer, {
      contentType: 'application/pdf',
      upsert: true,
    })
 
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
 
  return NextResponse.json({ success: true })
}
 

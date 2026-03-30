import { NextRequest, NextResponse } from 'next/server'
 
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!
 
export async function POST(req: NextRequest) {
  const password = req.headers.get('x-admin-password')
  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json({ ok: true })
}
 

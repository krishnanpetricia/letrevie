import { NextRequest, NextResponse } from 'next/server'
 
export async function GET(req: NextRequest) {
  const serverPassword = process.env.ADMIN_PASSWORD
  return NextResponse.json({
    passwordLength: serverPassword?.length ?? 0,
    passwordFirstChar: serverPassword?.[0] ?? 'none',
    passwordLastChar: serverPassword?.[serverPassword.length - 1] ?? 'none',
    passwordSet: !!serverPassword,
  })
}
 

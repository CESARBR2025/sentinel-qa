import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { createViewToken } from '@/lib/expediente/v2/view-store'
import { esRefV2, parsearRef } from '@/lib/expediente/v2/ref'

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { ref } = await req.json() as { ref?: string }
  if (!ref) return NextResponse.json({ error: 'ref requerido' }, { status: 400 })

  if (!esRefV2(ref)) {
    return NextResponse.json({ error: 'Solo refs v2 aceptadas' }, { status: 400 })
  }

  const parsed = parsearRef(ref)
  if (!parsed) return NextResponse.json({ error: 'ref inválida' }, { status: 400 })

  const token = createViewToken(ref)
  return NextResponse.json({ token, expiresIn: 300 })
}

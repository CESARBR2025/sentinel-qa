import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { getUserWithRole } from '@/lib/auth/helpers'
import { obtenerKpisGenerales911 } from '@/lib/911/service'

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const user = await getUserWithRole(session.user.id)
  if (!user?.esAdmin) return NextResponse.json({ error: 'Sin permiso' }, { status: 403 })

  const p = req.nextUrl.searchParams
  const desde = p.get('desde')
  const hasta = p.get('hasta')
  if (!desde || !hasta) {
    return NextResponse.json({ error: 'desde y hasta son requeridos' }, { status: 400 })
  }

  const data = await obtenerKpisGenerales911(desde, hasta)
  return NextResponse.json(data)
}

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { sincronizarArmasDelDia } from '@/lib/reportes/formato-n-armas-aseguradas-service'
import { verificarAccesoFormatoNApi } from '@/lib/reportes/permisos'

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoFormatoNApi(session.user.id, 'crear')
  if (chequeo) return chequeo

  const body = await req.json()
  const fecha = body.fecha as string
  if (!fecha) return NextResponse.json({ error: 'Fecha requerida' }, { status: 400 })

  const armas = await sincronizarArmasDelDia(fecha, session.user.id)
  return NextResponse.json(armas)
}

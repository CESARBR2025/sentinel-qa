import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { verificarRolOficial, contarDespachosAsignadosOficial } from '@/lib/oficial/service'

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const esOficial = await verificarRolOficial(session.user.id)
  if (!esOficial) return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 })

  const asignados = await contarDespachosAsignadosOficial(session.user.id)

  return NextResponse.json({ asignados })
}

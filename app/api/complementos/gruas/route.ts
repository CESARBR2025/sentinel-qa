import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { listarGruasActivas } from '@/lib/complementos/repository'

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  try {
    const gruas = await listarGruasActivas()
    return NextResponse.json(gruas)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error al obtener grúas'
    console.error('[GET /api/complementos/gruas]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

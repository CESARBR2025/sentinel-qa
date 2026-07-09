import { NextResponse } from 'next/server'
import { listarGruasActivas } from '@/lib/complementos/repository'

export async function GET() {
  try {
    const gruas = await listarGruasActivas()
    return NextResponse.json(gruas)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error al obtener grúas'
    console.error('[GET /api/complementos/gruas]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

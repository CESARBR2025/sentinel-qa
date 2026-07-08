import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  try {
    const result = await query<{ id: string; nombre: string; activo: boolean }>(
      `SELECT id, nombre, activo FROM via.v2_gruas WHERE activo = true ORDER BY nombre`,
    )
    return NextResponse.json(result.rows)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error al obtener grúas'
    console.error('[GET /api/complementos/gruas]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

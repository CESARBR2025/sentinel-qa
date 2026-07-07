import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { queryVia } from '@/lib/db'

export async function PATCH(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  try {
    const { id } = await req.json()
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    await queryVia(
      `UPDATE v2_infracciones
       SET estatus_dependencia = 'EN_PROCESO_JUZGADO', updated_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [id],
    )

    return NextResponse.json({ success: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error inesperado'
    console.error('[iniciarProcesoJuzgado]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { obtenerDetenidoPorId, enviarSolicitud, marcarCompletado } from '@/lib/monitorista/detenido-service'
import { query } from '@/lib/db'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { id } = await params
  const detenido = await obtenerDetenidoPorId(id)
  if (!detenido) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })

  const fotos = await query<Record<string, unknown>>(
    `SELECT * FROM evidencias_detenido WHERE solicitud_id = $1 ORDER BY tipo_foto`, [id],
  )

  return NextResponse.json({ detenido, fotos: fotos.rows })
}

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { rechazarSolicitud } from '@/lib/monitorista/detenido-service'
import { query } from '@/lib/db'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { id } = await params

  await rechazarSolicitud(id)

  await query(
    `INSERT INTO monitorista_historial (monitorista_id, accion, incidente_id) VALUES ($1,'solicitud_cancelada',$2)`,
    [session.user.id, id],
  )

  return NextResponse.json({ success: true })
}

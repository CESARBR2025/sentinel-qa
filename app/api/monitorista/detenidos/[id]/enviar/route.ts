import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { enviarSolicitud, getDestinos } from '@/lib/monitorista/detenido-service'
import { query } from '@/lib/db'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const destino = body.destino

  const destinos = await getDestinos()
  const clavesValidas = [...destinos.map(d => d.clave), 'AMBOS']

  if (!clavesValidas.includes(destino)) {
    return NextResponse.json({ error: 'Destino inválido' }, { status: 400 })
  }

  await enviarSolicitud(id, destino)

  await query(
    `INSERT INTO monitorista_historial (monitorista_id, accion, incidente_id) VALUES ($1,'solicitud_completada',$2)`,
    [session.user.id, id],
  )

  return NextResponse.json({ success: true })
}

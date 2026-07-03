import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { enviarFoto, getDestinos } from '@/lib/monitorista/detenido-service'
import { query } from '@/lib/db'
import { tienePermiso } from '@/lib/monitorista/permisos'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  if (!(await tienePermiso(session.user.id, 'detenidos', 'editar'))) return NextResponse.json({ error: 'Sin permiso' }, { status: 403 })

  const { id } = await params
  const body = await req.json()
  const { fotoId, destino } = body

  if (!fotoId || !destino) {
    return NextResponse.json({ error: 'fotoId y destino requeridos' }, { status: 400 })
  }

  const destinos = await getDestinos()
  const clavesValidas = [...destinos.map(d => d.clave), 'AMBOS']
  if (!clavesValidas.includes(destino)) {
    return NextResponse.json({ error: 'Destino inválido' }, { status: 400 })
  }

  await enviarFoto(fotoId, destino)

  await query(
    `INSERT INTO monitorista_historial (monitorista_id, accion, incidente_id) VALUES ($1,'evidencia_subida',$2)`,
    [session.user.id, id],
  )

  return NextResponse.json({ success: true })
}

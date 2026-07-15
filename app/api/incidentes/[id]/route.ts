import { NextRequest, NextResponse } from 'next/server'
import { auth }    from '@/lib/auth'
import { headers } from 'next/headers'
import { registrarAudit } from '@/lib/incidentes/audit'
import { verificarAccesoIncidentesApi } from '@/lib/incidentes/permisos'
import { obtenerIncidenteCompleto } from '@/lib/incidentes/repository'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoIncidentesApi(session.user.id, 'ver')
  if (chequeo) return chequeo

  const { id } = await params

  const inc = await obtenerIncidenteCompleto(id)
  if (!inc) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })

  await registrarAudit({ userId: session.user.id, accion: 'VIEW', entidad: 'incidentes', entidadId: id })

  return NextResponse.json(inc)
}

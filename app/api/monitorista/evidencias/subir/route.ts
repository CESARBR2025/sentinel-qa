import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { obtenerGuestToken, subirArchivoExpediente } from '@/lib/monitorista/expediente'
import { obtenerSolicitudFolioIncidente, insertarEvidencia, insertHistorial } from '@/lib/monitorista/repository'
import { tienePermiso } from '@/lib/monitorista/permisos'

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  if (!(await tienePermiso(session.user.id, 'solicitudes', 'crear'))) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const form = await req.formData()
  const file = form.get('file') as File
  const p = new URL(req.url).searchParams
  const solicitudId = p.get('solicitudId')!
  const incidenteId = p.get('incidenteId')!
  const tipo = p.get('tipo') ?? 'foto'
  const nombreOriginal = p.get('nombreOriginal') ?? file.name

  if (!solicitudId || !incidenteId || !file || file.size === 0) {
    return NextResponse.json({ error: 'Datos insuficientes' }, { status: 400 })
  }

  const sol = await obtenerSolicitudFolioIncidente(solicitudId)
  if (!sol) return NextResponse.json({ error: 'Solicitud no encontrada' }, { status: 404 })

  const buffer = Buffer.from(await file.arrayBuffer())
  const folio = sol.folioIncidente ?? incidenteId.substring(0, 8)
  const token = await obtenerGuestToken(session.user.name || 'Monitorista')
  const url = await subirArchivoExpediente(token, { buffer, nombre: nombreOriginal, tipo: file.type }, folio, `EVIDENCIA_${tipo.toUpperCase()}`)

  const ev = await insertarEvidencia(solicitudId, incidenteId, tipo, nombreOriginal, url, session.user.id)
  await insertHistorial(session.user.id, 'evidencia_subida', incidenteId, solicitudId)

  return NextResponse.json(ev, { status: 201 })
}

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { db } from '@/lib/db/index'
import { solicitudesEvidencia, evidencias, monitoristaHistorial } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { obtenerGuestToken, subirArchivoExpediente } from '@/lib/monitorista/expediente'

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

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

  const [sol] = await db
    .select({ id: solicitudesEvidencia.id, folioIncidente: solicitudesEvidencia.folioIncidente })
    .from(solicitudesEvidencia)
    .where(eq(solicitudesEvidencia.id, solicitudId))
    .limit(1)

  if (!sol) return NextResponse.json({ error: 'Solicitud no encontrada' }, { status: 404 })

  const buffer = Buffer.from(await file.arrayBuffer())
  const folio = sol.folioIncidente ?? incidenteId.substring(0, 8)
  const token = await obtenerGuestToken(session.user.name || 'Monitorista')
  const url = await subirArchivoExpediente(token, { buffer, nombre: nombreOriginal, tipo: file.type }, folio, `EVIDENCIA_${tipo.toUpperCase()}`)

  const [ev] = await db.insert(evidencias).values({
    solicitudId, incidenteId, tipo, nombreOriginal, urlExpediente: url, subidoPor: session.user.id,
  }).returning()

  await db.insert(monitoristaHistorial).values({
    monitoristaId: session.user.id, accion: 'evidencia_subida', solicitudId, incidenteId,
  })

  return NextResponse.json(ev, { status: 201 })
}

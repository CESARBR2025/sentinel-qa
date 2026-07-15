import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { obtenerGuestToken, subirArchivoExpediente } from '@/lib/expediente/client'
import { verificarRolFiscalia } from '@/lib/fiscalia/service'
import { insertarFotoFiscalia } from '@/lib/fiscalia/repository'
import { obtenerReporteCampoSimple } from '@/lib/oficial/repository'

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const esValido = await verificarRolFiscalia(session.user.id)
  if (!esValido) return NextResponse.json({ error: 'Sin permiso' }, { status: 403 })

  const form = await req.formData()
  const file = form.get('file') as File
  const reporteCampoId = form.get('reporteCampoId') as string
  const tipoFoto = form.get('tipoFoto') as string
  const tipoContenido = form.get('tipoContenido') as string || 'detenido'
  const detenidoIndex = form.get('detenidoIndex') ? Number(form.get('detenidoIndex')) : null

  if (!file || file.size === 0) {
    return NextResponse.json({ error: 'Archivo requerido' }, { status: 400 })
  }
  if (!reporteCampoId || !tipoFoto) {
    return NextResponse.json({ error: 'reporteCampoId y tipoFoto requeridos' }, { status: 400 })
  }

  const rc = await obtenerReporteCampoSimple(reporteCampoId)
  const folio = rc?.folio_reporte_campo ? String(rc.folio_reporte_campo) : reporteCampoId.substring(0, 8)

  try {
    const buffer = Buffer.from(await file.arrayBuffer())
    const token = await obtenerGuestToken(session.user.name || 'Fiscalía')
    const url = await subirArchivoExpediente(
      token,
      { buffer, nombre: file.name, tipo: file.type },
      folio,
      `FISCALIA_${tipoContenido.toUpperCase()}_${tipoFoto.toUpperCase()}`,
    )

    await insertarFotoFiscalia(reporteCampoId, tipoFoto, url, file.name, session.user.id, detenidoIndex, tipoContenido)

    return NextResponse.json({ success: true, url }, { status: 201 })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error interno'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

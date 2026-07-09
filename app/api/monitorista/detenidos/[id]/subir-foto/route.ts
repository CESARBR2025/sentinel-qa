import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { obtenerGuestToken, subirArchivoExpediente } from '@/lib/expediente/client'
import { tienePermiso } from '@/lib/monitorista/permisos'
import { obtenerFolioReporteCampo } from '@/lib/monitorista/repository'
import { subirFotoDetenido, completarSolicitudFoto } from '@/lib/monitorista/repository'
import { insertHistorial } from '@/lib/monitorista/repository'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  if (!(await tienePermiso(session.user.id, 'detenidos', 'editar'))) return NextResponse.json({ error: 'Sin permiso' }, { status: 403 })

  const { id } = await params
  const form = await req.formData()
  const file = form.get('file') as File
  const tipoFoto = form.get('tipoFoto') as string

  if (!file || file.size === 0) {
    return NextResponse.json({ error: 'Archivo requerido' }, { status: 400 })
  }
  if (!tipoFoto || !['frontal', 'derecho', 'izquierdo'].includes(tipoFoto)) {
    return NextResponse.json({ error: 'tipoFoto inválido' }, { status: 400 })
  }

  const folio = (await obtenerFolioReporteCampo(id)) ?? id.substring(0, 8)

  try {
    const buffer = Buffer.from(await file.arrayBuffer())
    const token = await obtenerGuestToken(session.user.name || 'Monitorista')
    const url = await subirArchivoExpediente(token, { buffer, nombre: file.name, tipo: file.type }, folio, `FOTO_DETENIDO_${tipoFoto.toUpperCase()}`)

    await subirFotoDetenido(id, tipoFoto, url, file.name, session.user.id)
    await completarSolicitudFoto(id, tipoFoto)
    await insertHistorial(session.user.id, 'evidencia_subida', id)

    return NextResponse.json({ success: true, url }, { status: 201 })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error interno'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

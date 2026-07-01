import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { query } from '@/lib/db'
import { obtenerGuestToken, subirArchivoExpediente } from '@/lib/expediente/client'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

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

  const folioResult = await query<{ folio: string | null }>(
    `SELECT folio_reporte_campo as folio FROM ofi_reportes_campo WHERE id = $1 LIMIT 1`,
    [id],
  )
  const folio = folioResult.rows[0]?.folio || id.substring(0, 8)

  try {
    const buffer = Buffer.from(await file.arrayBuffer())
    const token = await obtenerGuestToken(session.user.name || 'Monitorista')
    const url = await subirArchivoExpediente(token, { buffer, nombre: file.name, tipo: file.type }, folio, `FOTO_DETENIDO_${tipoFoto.toUpperCase()}`)

    await query(
      `INSERT INTO evidencias_detenido (reporte_campo_id, tipo_foto, url_archivo, nombre_archivo, subido_por)
       VALUES ($1, $2, $3, $4, $5)`,
      [id, tipoFoto, url, file.name, session.user.id],
    )

    const updResult = await query(
      `UPDATE solicitud_fotos SET estado = 'completado', enviado_a = 'MONITORISTA'
       WHERE reporte_campo_id = $1::uuid AND tipo_foto = $2::varchar`,
      [id, tipoFoto],
    )

    if (updResult.rowCount === 0) {
      await query(
        `INSERT INTO solicitud_fotos (reporte_campo_id, tipo_foto, estado, enviado_a)
         VALUES ($1::uuid, $2::varchar, 'completado', 'MONITORISTA')`,
        [id, tipoFoto],
      )
    }

    await query(
      `INSERT INTO monitorista_historial (monitorista_id, accion, incidente_id) VALUES ($1, 'evidencia_subida', $2)`,
      [session.user.id, id],
    )

    return NextResponse.json({ success: true, url }, { status: 201 })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error interno'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

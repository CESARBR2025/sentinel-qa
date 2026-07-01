import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { query } from '@/lib/db'
import { obtenerGuestToken, subirArchivoExpediente } from '@/lib/expediente/client'

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const form = await req.formData()
  const file = form.get('file') as File
  const reporteCampoId = form.get('reporteCampoId') as string
  const tipoFoto = form.get('tipoFoto') as string

  if (!file || file.size === 0) {
    return NextResponse.json({ error: 'Archivo requerido' }, { status: 400 })
  }
  if (!reporteCampoId || !tipoFoto) {
    return NextResponse.json({ error: 'reporteCampoId y tipoFoto requeridos' }, { status: 400 })
  }
  if (!['frontal', 'derecho', 'izquierdo'].includes(tipoFoto)) {
    return NextResponse.json({ error: 'tipoFoto inválido' }, { status: 400 })
  }

  const rolResult = await query<{ rol: string }>(
    `SELECT r.nombre AS rol FROM users u LEFT JOIN roles r ON u.rol_id = r.id WHERE u.id = $1 LIMIT 1`,
    [session.user.id],
  )
  const rol = rolResult.rows[0]?.rol ?? ''

  let destinosPermitidos: string[]
  if (rol === 'agente_fiscalia') {
    destinosPermitidos = ['FISCALIA', 'AMBOS']
  } else if (rol === 'agente_juzgado') {
    destinosPermitidos = ['JUZGADO_CIVICO', 'AMBOS']
  } else {
    return NextResponse.json({ error: 'Rol sin permisos para subir fotos' }, { status: 403 })
  }

  const sfResult = await query<Record<string, unknown>>(
    `SELECT id, estado, enviado_a FROM solicitud_fotos WHERE reporte_campo_id = $1 AND tipo_foto = $2 LIMIT 1`,
    [reporteCampoId, tipoFoto],
  )
  const sf = sfResult.rows[0] as { id: string; estado: string; enviado_a: string } | undefined
  if (!sf) {
    return NextResponse.json({ error: 'No hay solicitud de foto para este detenido' }, { status: 404 })
  }
  if (sf.estado === 'completado') {
    return NextResponse.json({ error: 'Esta foto ya fue completada' }, { status: 409 })
  }
  if (sf.estado !== 'enviado') {
    return NextResponse.json({ error: 'La solicitud no ha sido enviada a ningún destino' }, { status: 400 })
  }
  if (!destinosPermitidos.includes(sf.enviado_a)) {
    return NextResponse.json({ error: 'Esta solicitud no fue enviada a tu dependencia' }, { status: 403 })
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer())
    const token = await obtenerGuestToken(session.user.name || 'Usuario')
    const url = await subirArchivoExpediente(token, { buffer, nombre: file.name, tipo: file.type }, reporteCampoId, `FOTO_DETENIDO_${tipoFoto.toUpperCase()}`)

    await query(
      `INSERT INTO evidencias_detenido (reporte_campo_id, tipo_foto, url_archivo, nombre_archivo, subido_por)
       VALUES ($1, $2, $3, $4, $5)`,
      [reporteCampoId, tipoFoto, url, file.name, session.user.id],
    )

    await query(
      `UPDATE solicitud_fotos SET estado = 'completado' WHERE id = $1`,
      [sf.id],
    )

    await query(
      `INSERT INTO monitorista_historial (monitorista_id, accion, incidente_id) VALUES ($1, 'evidencia_subida', $2)`,
      [session.user.id, reporteCampoId],
    )

    return NextResponse.json({ success: true, url }, { status: 201 })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error interno'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

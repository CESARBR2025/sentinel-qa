import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { obtenerGuestToken, subirArchivoExpediente } from '@/lib/expediente/client'
import { getRolUsuario, obtenerObtenerSolicitudFoto, insertarEvidenciaDetenido, actualizarSolicitudFotoEstado } from '@/lib/monitorista/repository'
import { insertHistorial } from '@/lib/monitorista/repository'

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

  const rol = await getRolUsuario(session.user.id)

  let destinosPermitidos: string[]
  if (rol === 'agente_fiscalia') {
    destinosPermitidos = ['FISCALIA', 'AMBOS']
  } else if (rol === 'agente_juzgado') {
    destinosPermitidos = ['JUZGADO_CIVICO', 'AMBOS']
  } else {
    return NextResponse.json({ error: 'Rol sin permisos para subir fotos' }, { status: 403 })
  }

  const sf = await obtenerObtenerSolicitudFoto(reporteCampoId, tipoFoto)
  if (!sf) {
    return NextResponse.json({ error: 'No hay solicitud de foto para este detenido' }, { status: 404 })
  }
  if (sf.estado === 'completado') {
    return NextResponse.json({ error: 'Esta foto ya fue completada' }, { status: 409 })
  }
  if (sf.estado !== 'enviado') {
    return NextResponse.json({ error: 'La solicitud no ha sido enviada a ningún destino' }, { status: 400 })
  }
  if (!destinosPermitidos.includes(sf.enviadoA)) {
    return NextResponse.json({ error: 'Esta solicitud no fue enviada a tu dependencia' }, { status: 403 })
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer())
    const token = await obtenerGuestToken(session.user.name || 'Usuario')
    const url = await subirArchivoExpediente(token, { buffer, nombre: file.name, tipo: file.type }, reporteCampoId, `FOTO_DETENIDO_${tipoFoto.toUpperCase()}`)

    await insertarEvidenciaDetenido(reporteCampoId, tipoFoto, url, file.name, session.user.id)
    await actualizarSolicitudFotoEstado(sf.id)
    await insertHistorial(session.user.id, 'evidencia_subida', reporteCampoId)

    return NextResponse.json({ success: true, url }, { status: 201 })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error interno'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

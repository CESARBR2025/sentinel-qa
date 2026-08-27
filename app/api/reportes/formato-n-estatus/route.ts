import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { confirmarSeccion, desconfirmarSeccion, SECCIONES_ESTATUS, SeccionEstatus } from '@/lib/reportes/formato-n-estatus-service'
import { verificarAccesoFormatoNApi } from '@/lib/reportes/permisos'

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoFormatoNApi(session.user.id, 'crear')
  if (chequeo) return chequeo

  const body = await req.json()
  const { fecha, seccion } = body as { fecha?: string; seccion?: string }
  if (!fecha) return NextResponse.json({ error: 'Fecha requerida' }, { status: 400 })
  if (!seccion || !SECCIONES_ESTATUS.includes(seccion as SeccionEstatus)) {
    return NextResponse.json({ error: 'Sección inválida' }, { status: 400 })
  }

  const estatus = await confirmarSeccion(fecha, seccion as SeccionEstatus, session.user.id)
  return NextResponse.json(estatus)
}

export async function DELETE(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoFormatoNApi(session.user.id, 'editar')
  if (chequeo) return chequeo

  const url = new URL(req.url)
  const fecha = url.searchParams.get('fecha')
  const seccion = url.searchParams.get('seccion')
  if (!fecha) return NextResponse.json({ error: 'Fecha requerida' }, { status: 400 })
  if (!seccion || !SECCIONES_ESTATUS.includes(seccion as SeccionEstatus)) {
    return NextResponse.json({ error: 'Sección inválida' }, { status: 400 })
  }

  await desconfirmarSeccion(fecha, seccion as SeccionEstatus, session.user.id)
  return NextResponse.json({ success: true })
}

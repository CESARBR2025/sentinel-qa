import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { upsertSeccion, reemplazarFilas } from '@/lib/novedades/repository'
import { verificarAccesoNovedadesApi } from '@/lib/reportes/permisos'
import { SECCIONES } from '@/lib/novedades/types'
import type { SeccionKey } from '@/lib/novedades/types'

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoNovedadesApi(session.user.id, 'crear')
  if (chequeo) return chequeo

  const body = await req.json()
  const { fecha, seccion, datos } = body as { fecha?: string; seccion?: SeccionKey; datos?: Record<string, unknown> }
  if (!fecha) return NextResponse.json({ error: 'Fecha requerida' }, { status: 400 })
  if (!seccion || !(SECCIONES as readonly string[]).includes(seccion)) {
    return NextResponse.json({ error: 'Sección inválida' }, { status: 400 })
  }

  const payload = { ...(datos ?? {}) }
  const listados = payload.filas as Record<string, { datos: Record<string, unknown> }[]> | undefined
  if (listados) {
    for (const [clave, lista] of Object.entries(listados)) {
      await reemplazarFilas(fecha, clave, lista, session.user.id)
    }
    delete payload.filas
  }
  await upsertSeccion(fecha, seccion, payload, session.user.id)

  return NextResponse.json({ success: true })
}

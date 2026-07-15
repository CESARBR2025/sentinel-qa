import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { obtenerFgr, actualizarFgr } from '@/lib/reportes/formato-n-fgr-service'
import { verificarAccesoFormatoNApi } from '@/lib/reportes/permisos'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoFormatoNApi(session.user.id, 'ver')
  if (chequeo) return chequeo
  const { id } = await params
  const registro = await obtenerFgr(id)
  if (!registro) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  return NextResponse.json(registro)
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoFormatoNApi(session.user.id, 'editar')
  if (chequeo) return chequeo
  const { id } = await params
  const body = await req.json()

  const campos = ['fecha', 'periodo', 'carpetas_iniciadas', 'numero_cateos', 'vehiculos_asegurados', 'domicilios_cateados', 'personas_aseguradas', 'aprehensiones', 'audiencias_iniciales', 'abreviados', 'audiencias_intermedias']
  const data: Record<string, unknown> = {}
  for (const c of campos) {
    if (body[c] !== undefined) data[c] = body[c]
  }

  try {
    await actualizarFgr(id, data)
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const pgErr = err as { code?: string; message?: string }
    const isDuplicate = pgErr?.code === '23505' || (pgErr?.message || '').includes('duplicate key')
    if (isDuplicate) {
      return NextResponse.json({ error: 'Ya existe otro reporte FGR con esa fecha y periodo.' }, { status: 409 })
    }
    return NextResponse.json({ error: pgErr?.message || 'Error desconocido' }, { status: 500 })
  }
}

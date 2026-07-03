import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { obtenerEvento, actualizarEvento } from '@/lib/reportes/formato-n-eventos-service'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const { id } = await params
  const registro = await obtenerEvento(id)
  if (!registro) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  return NextResponse.json(registro)
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const { id } = await params
  const body = await req.json()

  const campos = ['fecha', 'hora', 'region', 'evento', 'ubicacion', 'descripcion', 'atenciones']
  const data: Record<string, unknown> = {}
  for (const c of campos) {
    if (body[c] !== undefined) data[c] = body[c]
  }

  try {
    await actualizarEvento(id, data)
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const pgErr = err as { message?: string }
    return NextResponse.json({ error: pgErr?.message || 'Error desconocido' }, { status: 500 })
  }
}

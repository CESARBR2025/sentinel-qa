import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { consumeViewToken } from '@/lib/expediente/v2/view-store'
import { esRefV2, parsearRef } from '@/lib/expediente/v2/ref'
import { descargar } from '@/lib/expediente/v2/client'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { token } = await params
  const ref = consumeViewToken(token)
  if (!ref) return NextResponse.json({ error: 'Token inválido o expirado' }, { status: 401 })

  if (!esRefV2(ref)) {
    return NextResponse.json({ error: 'Documento no disponible (formato legado no soportado)' }, { status: 410 })
  }

  const parsed = parsearRef(ref)
  if (!parsed) return NextResponse.json({ error: 'Ref inválida' }, { status: 400 })
  try {
    const upstream = await descargar(parsed)
    if (!upstream.ok) return NextResponse.json({ error: 'Documento no encontrado' }, { status: 404 })
    return new NextResponse(upstream.body, {
      status: 200,
      headers: {
        'Content-Type': upstream.headers.get('content-type') || 'application/octet-stream',
        'Content-Disposition': upstream.headers.get('content-disposition') || 'inline',
        'Cache-Control': 'no-store',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Error al obtener documento' }, { status: 500 })
  }
}

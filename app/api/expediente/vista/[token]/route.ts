import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { consumeViewToken } from '@/lib/expediente/v2/view-store'
import { esRefV2, parsearRef } from '@/lib/expediente/v2/ref'
import { getToken, descargar } from '@/lib/expediente/v2/client'

const EXP_LEGACY_HOST = process.env.EXPEDIENTE_DIGITAL_URL ?? 'https://sanjuandelrio.sytes.net:3044'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { token } = await params
  const ref = consumeViewToken(token)
  if (!ref) return NextResponse.json({ error: 'Token inválido o expirado' }, { status: 401 })

  if (esRefV2(ref)) {
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

  let urlParam = ref
  if (!urlParam.startsWith('http://') && !urlParam.startsWith('https://')) {
    urlParam = `${EXP_LEGACY_HOST}${urlParam.startsWith('/') ? '' : '/'}${urlParam}`
  }

  try {
    const targetUrl = new URL(urlParam)
    const legacyHost = new URL(EXP_LEGACY_HOST)
    if (targetUrl.origin !== legacyHost.origin) {
      return NextResponse.json({ error: 'Origen no permitido' }, { status: 400 })
    }
    targetUrl.pathname = targetUrl.pathname.replace(/\/{2,}/g, '/')
    const bearer = await getToken()
    const upstream = await fetch(targetUrl.toString(), { headers: { Authorization: `Bearer ${bearer}` } })
    if (!upstream.ok) return NextResponse.json({ error: 'Documento no encontrado' }, { status: 404 })
    const blob = await upstream.blob()
    return new NextResponse(blob, {
      headers: {
        'Content-Type': upstream.headers.get('content-type') || 'application/octet-stream',
        'Cache-Control': 'no-store',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Error al obtener documento' }, { status: 500 })
  }
}

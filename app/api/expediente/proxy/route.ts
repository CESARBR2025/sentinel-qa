import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { esRefV2, parsearRef } from '@/lib/expediente/v2/ref'
import { getToken, descargar } from '@/lib/expediente/v2/client'
import { decryptRef } from '@/lib/expediente/v2/token'

const EXP_LEGACY_HOST = process.env.EXPEDIENTE_DIGITAL_URL ?? 'https://sanjuandelrio.sytes.net:3044'

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const t = req.nextUrl.searchParams.get('t')
  if (t) {
    const decrypted = decryptRef(t)
    if (!decrypted) return NextResponse.json({ error: 'Token inválido o expirado' }, { status: 401 })
    return servirRef(decrypted.ref)
  }

  const ref = req.nextUrl.searchParams.get('ref') || req.nextUrl.searchParams.get('url') || ''
  if (!ref) return NextResponse.json({ error: 'Parámetro ref requerido' }, { status: 400 })

  return servirRef(ref)

  async function servirRef(valor: string): Promise<NextResponse> {
    if (esRefV2(valor)) {
      const parsed = parsearRef(valor)
      if (!parsed) return NextResponse.json({ error: 'Ref inválida' }, { status: 400 })
      try {
        const upstream = await descargar(parsed)
        if (!upstream.ok) return NextResponse.json({ error: 'Documento no encontrado' }, { status: 404 })
        return new NextResponse(upstream.body, {
          status: 200,
          headers: {
            'Content-Type': upstream.headers.get('content-type') || 'application/octet-stream',
            'Content-Disposition': upstream.headers.get('content-disposition') || 'inline',
            'Cache-Control': 'private, max-age=300',
          },
        })
      } catch {
        return NextResponse.json({ error: 'Error al obtener documento' }, { status: 500 })
      }
    }

    let urlParam = valor
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
      const token = await getToken()
      const upstream = await fetch(targetUrl.toString(), { headers: { Authorization: `Bearer ${token}` } })
      if (!upstream.ok) return NextResponse.json({ error: 'Documento no encontrado' }, { status: 404 })
      const blob = await upstream.blob()
      return new NextResponse(blob, {
        headers: {
          'Content-Type': upstream.headers.get('content-type') || 'application/octet-stream',
          'Cache-Control': 'private, max-age=300',
        },
      })
    } catch {
      return NextResponse.json({ error: 'Error al obtener documento' }, { status: 500 })
    }
  }
}

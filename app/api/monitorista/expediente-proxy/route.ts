import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { obtenerGuestToken } from '@/lib/monitorista/expediente'

const EXP_HOST = process.env.EXPEDIENTE_DIGITAL_URL ?? 'https://sanjuandelrio.sytes.net:3044'

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  let urlParam = req.nextUrl.searchParams.get('url')
  if (!urlParam) return NextResponse.json({ error: 'URL requerida' }, { status: 400 })

  if (urlParam.startsWith('/')) {
    urlParam = `${EXP_HOST}${urlParam}`
  }

  try {
    const token = await obtenerGuestToken(session.user.name || 'Monitorista')
    const upstream = await fetch(urlParam, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!upstream.ok) {
      return NextResponse.json({ error: 'Documento no encontrado' }, { status: 404 })
    }

    const blob = await upstream.blob()
    const contentType = upstream.headers.get('content-type') || 'application/octet-stream'

    return new NextResponse(blob, {
      headers: { 'Content-Type': contentType, 'Cache-Control': 'private, max-age=300' },
    })
  } catch {
    return NextResponse.json({ error: 'Error al obtener documento' }, { status: 500 })
  }
}

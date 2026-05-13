import { betterFetch } from '@better-fetch/fetch'
import type { Session } from '@/lib/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/login', '/api/auth']

function isPublic(pathname: string) {
  return PUBLIC_PATHS.some((p) => pathname.startsWith(p))
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (isPublic(pathname)) return NextResponse.next()

  const origin = request.nextUrl.origin.replace(/^https(?=:\/\/localhost)/, 'http')

  const { data: session } = await betterFetch<Session>('/api/auth/get-session', {
    baseURL:  origin,
    headers:  { cookie: request.headers.get('cookie') ?? '' },
  })

  if (!session) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Bloquea usuarios inactivos
  if (session.user && !(session.user as { activo?: boolean }).activo) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('error', 'cuenta_inactiva')
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  // Excluye: archivos Next internos, imágenes optimizadas, archivos estáticos con extensión
  matcher: ['/((?!_next/static|_next/image|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|woff2?|ttf|otf|css|js|map)$).*)'],
}

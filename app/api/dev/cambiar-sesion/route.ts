import { NextRequest, NextResponse } from 'next/server'
import { crearSesionNueva } from '@/lib/auth/dev-sesiones'

// Temporal (dev): endpoint usado por el dropdown de cambio de usuario. Acepta
// { userId }, responde 200 con Set-Cookie de la nueva sesión y el cliente hace
// navegación completa a /dashboard (window.location) para que la cookie viaje
// en el siguiente request.

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const { userId } = body as { userId?: string }
  if (!userId) return NextResponse.json({ error: 'userId requerido' }, { status: 400 })

  try {
    const { cookies } = await crearSesionNueva(userId, req.headers.get('cookie') ?? undefined)
    const res = NextResponse.json({ ok: true })
    for (const cookie of cookies) res.headers.append('Set-Cookie', cookie)
    return res
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Error al cambiar de sesión' },
      { status: 500 },
    )
  }
}

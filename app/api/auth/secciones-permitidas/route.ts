import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { obtenerPermisosUsuario } from '@/lib/permisos/core'
import { MAPA_SECCIONES } from '@/lib/permisos/mapa-secciones'

// Corre en runtime Node (default de los route handlers) porque
// obtenerPermisosUsuario usa el driver pg de lib/db.ts, no compatible con Edge.
export async function GET(_req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ secciones: [] }, { status: 401 })

  const todasLasSecciones = [...new Set(Object.values(MAPA_SECCIONES).flat())]
  const permisos = await obtenerPermisosUsuario(session.user.id, todasLasSecciones)
  const secciones = todasLasSecciones.filter(s => permisos[s]?.puede_ver)

  return NextResponse.json({ secciones })
}

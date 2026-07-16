import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { iniciarProcesoJuzgadoSvc } from '@/lib/agente_juzgado/service'
import { tienePermiso } from '@/lib/agente_juzgado/permisos'

export async function PATCH(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  if (!(await tienePermiso(session.user.id, 'juzgado', 'editar'))) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  try {
    const { id } = await req.json()
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    await iniciarProcesoJuzgadoSvc(id)

    return NextResponse.json({ success: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error inesperado'
    console.error('[iniciarProcesoJuzgado]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

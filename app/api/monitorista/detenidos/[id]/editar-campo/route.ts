import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { actualizarCampo } from '@/lib/monitorista/repository'
import { tienePermiso } from '@/lib/monitorista/permisos'
import { insertHistorial } from '@/lib/monitorista/repository'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  if (!(await tienePermiso(session.user.id, 'detenidos', 'editar'))) return NextResponse.json({ error: 'Sin permiso' }, { status: 403 })

  const { id } = await params
  const body = await req.json()
  const { campo, valor } = body

  if (!campo || valor === undefined) {
    return NextResponse.json({ error: 'campo y valor requeridos' }, { status: 400 })
  }

  try {
    await actualizarCampo(id, campo, valor)
    await insertHistorial(session.user.id, 'campo_editado', id)
    return NextResponse.json({ success: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error interno'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

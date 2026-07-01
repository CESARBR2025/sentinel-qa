import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { query } from '@/lib/db'
import { actualizarCampo } from '@/lib/monitorista/detenido-service'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const { campo, valor } = body

  if (!campo || valor === undefined) {
    return NextResponse.json({ error: 'campo y valor requeridos' }, { status: 400 })
  }

  try {
    await actualizarCampo(id, campo, valor)

    await query(
      `INSERT INTO monitorista_historial (monitorista_id, accion, incidente_id) VALUES ($1, 'campo_editado', $2)`,
      [session.user.id, id],
    )

    return NextResponse.json({ success: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error interno'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

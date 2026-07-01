import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { query } from '@/lib/db'
import { generarPpt } from '@/lib/monitorista/ppt-service'

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const body = await req.json()
  const desde = body.desde ?? ''
  const hasta = body.hasta ?? ''
  const filtro = body.filtro ?? 'todos'

  try {
    const buf = await generarPpt(session.user.name || 'Monitorista', desde, hasta, filtro)

    await query(
      `INSERT INTO monitorista_historial (monitorista_id, accion) VALUES ($1, 'ppt_generado')`,
      [session.user.id],
    )

    return new NextResponse(new Uint8Array(buf), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'Content-Disposition': `attachment; filename="detenidos_${new Date().toISOString().split('T')[0]}.pptx"`,
      },
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error interno'
    console.error('[generar-ppt]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

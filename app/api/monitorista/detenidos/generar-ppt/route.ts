import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { generarPpt } from '@/lib/monitorista/ppt-service'

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const body = await req.json()
  const periodo = body.periodo ?? 'diario'
  const filtro = body.filtro ?? 'todos'

  const ahora = new Date()
  let desde: Date, hasta: Date

  if (periodo === 'diario') {
    desde = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate())
    hasta = new Date(desde.getTime() + 86400000)
  } else if (periodo === 'semanal') {
    const dia = ahora.getDay()
    desde = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() - (dia === 0 ? 6 : dia - 1))
    hasta = new Date(desde.getTime() + 7 * 86400000)
  } else if (periodo === 'mensual') {
    desde = new Date(ahora.getFullYear(), ahora.getMonth(), 1)
    hasta = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 1)
  } else {
    return NextResponse.json({ error: 'Periodo inválido' }, { status: 400 })
  }

  try {
    const buf = await generarPpt(
      session.user.name || 'Monitorista',
      desde.toISOString(),
      hasta.toISOString(),
      filtro,
    )
    return new NextResponse(buf, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'Content-Disposition': `attachment; filename="detenidos_${periodo}_${ahora.toISOString().split('T')[0]}.pptx"`,
      },
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error interno'
    console.error('[generar-ppt]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

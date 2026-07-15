import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { obtenerFormatoNConsolidadoRango } from '@/lib/reportes/formato-n-consolidado-service'
import { tieneAccesoFormatoN, tienePermiso } from '@/lib/reportes/permisos'

const MAX_DIAS_RANGO = 31

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  if (!(await tieneAccesoFormatoN(session.user.id))) return NextResponse.json({ error: 'Sin acceso' }, { status: 403 })
  if (!(await tienePermiso(session.user.id, 'formato_n_coordinacion', 'ver'))) return NextResponse.json({ error: 'Sin permiso' }, { status: 403 })

  const body = await req.json()
  const fechaInicio = body.fecha_inicio as string
  const fechaFin = body.fecha_fin as string
  if (!fechaInicio || !fechaFin) return NextResponse.json({ error: 'Rango de fechas requerido' }, { status: 400 })
  if (fechaInicio > fechaFin) return NextResponse.json({ error: 'La fecha inicial debe ser anterior a la final' }, { status: 400 })

  const dias = (new Date(`${fechaFin}T00:00:00Z`).getTime() - new Date(`${fechaInicio}T00:00:00Z`).getTime()) / 86400000 + 1
  if (dias > MAX_DIAS_RANGO) return NextResponse.json({ error: `El rango no puede superar ${MAX_DIAS_RANGO} días` }, { status: 400 })

  try {
    const data = await obtenerFormatoNConsolidadoRango(fechaInicio, fechaFin)
    return NextResponse.json(data)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error interno'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

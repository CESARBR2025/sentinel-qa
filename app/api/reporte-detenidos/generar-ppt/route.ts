import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { generarPptAgrupado } from '@/lib/reporte-detenidos/ppt-service'
import { tienePermiso } from '@/lib/reporte-detenidos/permisos'
import { registrarAudit } from '@/lib/incidentes/audit'

export async function POST(_req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  if (!(await tienePermiso(session.user.id, 'reporte_detenidos', 'ver'))) {
    return NextResponse.json({ error: 'Sin permiso' }, { status: 403 })
  }

  try {
    const buf = await generarPptAgrupado()

    await registrarAudit({
      userId: session.user.id,
      accion: 'VIEW',
      entidad: 'reporte_detenidos',
      entidadId: 'ppt_generado',
    })

    return new NextResponse(new Uint8Array(buf), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'Content-Disposition': `attachment; filename="reporte_detenidos_${new Date().toISOString().split('T')[0]}.pptx"`,
      },
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error interno'
    console.error('[reporte-detenidos/generar-ppt]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

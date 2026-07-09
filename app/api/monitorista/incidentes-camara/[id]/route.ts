import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { obtenerRegistro, actualizarRegistro } from '@/lib/monitorista/incidentes-camara-service'
import { tienePermiso } from '@/lib/monitorista/permisos'
import { insertHistorial } from '@/lib/monitorista/repository'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  if (!(await tienePermiso(session.user.id, 'incidentes_camara', 'ver'))) return NextResponse.json({ error: 'Sin permiso' }, { status: 403 })
  const { id } = await params
  const registro = await obtenerRegistro(id)
  if (!registro) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  return NextResponse.json(registro)
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  if (!(await tienePermiso(session.user.id, 'incidentes_camara', 'editar'))) return NextResponse.json({ error: 'Sin permiso' }, { status: 403 })
  const { id } = await params
  const body = await req.json()

  const campos = [
    'fecha', 'turno', 'personas_sin_novedad', 'personas_con_antecedentes',
    'total_personas_revisadas', 'vehiculos_revisar', 'vehiculos_repuve',
    'motos_revisadas', 'persecuciones', 'asegurados_camara',
    'vehiculos_recuperados', 'incendios', 'hechos_transito',
  ]
  const data: Record<string, unknown> = {}
  for (const c of campos) {
    if (body[c] !== undefined) data[c] = body[c]
  }

  try {
    await actualizarRegistro(id, data)

    await insertHistorial(session.user.id, 'incidente_editado', id)

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const pgErr = err as { code?: string; message?: string }
    const isDuplicate = pgErr?.code === '23505'
      || (pgErr?.message || '').includes('duplicate key')
      || (pgErr?.message || '').includes('unicidad')
    if (isDuplicate) {
      return NextResponse.json({ error: 'Ya existe otro registro con esa fecha y turno.' }, { status: 409 })
    }
    return NextResponse.json({ error: pgErr?.message || 'Error desconocido' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { auth }    from '@/lib/auth'
import { headers } from 'next/headers'
import { query }   from '@/lib/db'
import { verificarAccesoIncidentesApi } from '@/lib/incidentes/permisos'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoIncidentesApi(session.user.id, 'ver')
  if (chequeo) return chequeo

  const { id } = await params

  const inc = await query<{ id: string; estatus: string; folio: string }>(
    `SELECT id, estatus, folio FROM incidentes WHERE id = $1 LIMIT 1`,
    [id],
  )
  if (!inc.rows[0]) return NextResponse.json({ error: 'Incidente no encontrado' }, { status: 404 })

  const despacho = await query(
    `SELECT d.id, d.incidente_id AS "incidenteId", d.fecha_hora_despacho AS "fechaHoraDespacho", u.name AS "despachadorNombre", d.creado_en AS "creadoEn" FROM incidente_despacho d LEFT JOIN users u ON d.despachado_por = u.id WHERE d.incidente_id = $1 LIMIT 1`,
    [id],
  )
  if (!despacho.rows[0]) return NextResponse.json({ error: 'Este incidente no tiene despacho asignado' }, { status: 404 })

  const [unidades, elementos] = await Promise.all([
    query(`SELECT id, unidad_ext_id AS "unidadExtId", unidad_placa AS "unidadPlaca" FROM incidente_despacho_unidades WHERE despacho_id = $1`, [despacho.rows[0].id]),
    query(`SELECT id, elemento_ext_id AS "elementoExtId", elemento_nomina AS "elementoNomina", elemento_nombre AS "elementoNombre" FROM incidente_despacho_elementos WHERE despacho_id = $1`, [despacho.rows[0].id]),
  ])

  return NextResponse.json({
    incidente: { id: inc.rows[0].id, folio: inc.rows[0].folio, estatus: inc.rows[0].estatus },
    despacho:  { ...despacho.rows[0], unidades: unidades.rows, elementos: elementos.rows },
  })
}

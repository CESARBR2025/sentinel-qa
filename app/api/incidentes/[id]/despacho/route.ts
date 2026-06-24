import { NextRequest, NextResponse } from 'next/server'
import { auth }    from '@/lib/auth'
import { headers } from 'next/headers'
import { db }      from '@/lib/db/index'
import { eq }      from 'drizzle-orm'
import { incidentes, incidenteDespacho, incidenteDespachoUnidades, incidenteDespachoElementos, users } from '@/lib/db/schema'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { id } = await params

  const [inc] = await db
    .select({ id: incidentes.id, estatus: incidentes.estatus, folio: incidentes.folio })
    .from(incidentes)
    .where(eq(incidentes.id, id))
    .limit(1)

  if (!inc) return NextResponse.json({ error: 'Incidente no encontrado' }, { status: 404 })

  const [despacho] = await db
    .select({
      id:                incidenteDespacho.id,
      incidenteId:       incidenteDespacho.incidenteId,
      fechaHoraDespacho: incidenteDespacho.fechaHoraDespacho,
      despachadorNombre: users.name,
      creadoEn:          incidenteDespacho.creadoEn,
    })
    .from(incidenteDespacho)
    .leftJoin(users, eq(incidenteDespacho.despachadorPor, users.id))
    .where(eq(incidenteDespacho.incidenteId, id))
    .limit(1)

  if (!despacho) return NextResponse.json({ error: 'Este incidente no tiene despacho asignado' }, { status: 404 })

  const [unidades, elementos] = await Promise.all([
    db.select({
      id:          incidenteDespachoUnidades.id,
      unidadExtId: incidenteDespachoUnidades.unidadExtId,
      unidadPlaca: incidenteDespachoUnidades.unidadPlaca,
    })
    .from(incidenteDespachoUnidades)
    .where(eq(incidenteDespachoUnidades.despachoId, despacho.id)),

    db.select({
      id:             incidenteDespachoElementos.id,
      elementoExtId:  incidenteDespachoElementos.elementoExtId,
      elementoNomina: incidenteDespachoElementos.elementoNomina,
      elementoNombre: incidenteDespachoElementos.elementoNombre,
    })
    .from(incidenteDespachoElementos)
    .where(eq(incidenteDespachoElementos.despachoId, despacho.id)),
  ])

  return NextResponse.json({
    incidente: { id: inc.id, folio: inc.folio, estatus: inc.estatus },
    despacho:  { ...despacho, unidades, elementos },
  })
}
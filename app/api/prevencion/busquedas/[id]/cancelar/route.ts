import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { query } from '@/lib/db'
import { verificarAccesoPrevencionApi } from '@/lib/prevencion/permisos'

const FICHA_COLS = `id, tipo, folio, enlace, fecha_activacion AS "fechaActivacion", carpeta_investigacion AS "carpetaInvestigacion", nombre_desaparecida AS "nombreDesaparecida", edad, fecha_aceptacion AS "fechaAceptacion", rt_atiende AS "rtAtiende", elemento_novedades AS "elementoNovedades", status, fecha_cancelacion AS "fechaCancelacion", fiscal_cancela AS "fiscalCancela", motivo_cancelacion AS "motivoCancelacion", creado_por AS "creadoPor", creado_en AS "creadoEn"`

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoPrevencionApi(session.user.id, 'busquedas', 'editar')
  if (chequeo) return chequeo

  const { id } = await params
  const body = await request.json()

  const updated = await query(
    `UPDATE fichas_busqueda SET status = 'cancelada', fecha_cancelacion = $2, fiscal_cancela = $3, motivo_cancelacion = $4 WHERE id = $1 RETURNING ${FICHA_COLS}`,
    [id, body.fechaCancelacion ?? new Date(), body.fiscalCancela, body.motivoCancelacion],
  )
  return NextResponse.json(updated.rows[0])
}

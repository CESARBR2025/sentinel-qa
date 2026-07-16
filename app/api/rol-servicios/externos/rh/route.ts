import { NextRequest, NextResponse } from 'next/server'
import { auth }    from '@/lib/auth'
import { headers } from 'next/headers'
import { getUserWithRole } from '@/lib/auth/helpers'

const RH_URL    = process.env.NOMINA_API_URL ?? ''
const RH_SECRET = process.env.SECRET_NOMINA  ?? ''

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const userWithRole = await getUserWithRole(session.user.id)
  if (!userWithRole?.esAdmin) return NextResponse.json({ error: 'No autorizado' }, { status: 403 })

  const p            = req.nextUrl.searchParams
  const trabajadorId = p.get('trabajadorId')
  const curp         = p.get('curp')
  const apellidoPat  = p.get('apellidoPaterno')
  const apellidoMat  = p.get('apellidoMaterno')

  // Debe venir trabajadorId O (curp + apellidos)
  const porId      = !!trabajadorId
  const porCurp    = !!(curp && apellidoPat && apellidoMat)

  if (!porId && !porCurp)
    return NextResponse.json({
      error: 'Se requiere trabajadorId o (curp + apellidoPaterno + apellidoMaterno)'
    }, { status: 400 })

  try {
    const params = new URLSearchParams()
    if (porId) {
      params.set('trabajadorId', trabajadorId!)
    } else {
      params.set('curp',             curp!)
      params.set('apellidoPaterno',  apellidoPat!)
      params.set('apellidoMaterno',  apellidoMat!)
    }

    const upstream = await fetch(
      `${RH_URL}/api/publicas/empleadosParaCus?${params}`,
      { headers: { 'x-secret-key': RH_SECRET }, cache: 'no-store' }
    )

    if (upstream.status === 401)
      return NextResponse.json({ error: 'Clave RH inválida' },      { status: 502 })
    if (upstream.status === 404)
      return NextResponse.json({ error: 'NOT_FOUND' },               { status: 404 })
    if (upstream.status === 400)
      return NextResponse.json({ error: 'Parámetros insuficientes' }, { status: 400 })
    if (!upstream.ok)
      return NextResponse.json({ error: 'Error al consultar RH' },   { status: 502 })

    const json = await upstream.json() as {
      success: boolean
      data: {
        trabajadorID:       string
        nombreCompleto:     string
        puestoDescripcion:  string
        centroGastoDescripcion: string
        estatus:            string
      }
    }

    if (!json.success)
      return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 })

    return NextResponse.json({
      trabajadorId: json.data.trabajadorID,
      nombre:       json.data.nombreCompleto,
      puesto:       json.data.puestoDescripcion,
      dependencia:  json.data.centroGastoDescripcion,
      estatus:      json.data.estatus,
    })
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
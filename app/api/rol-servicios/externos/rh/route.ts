import { NextRequest, NextResponse } from 'next/server'
import { auth }    from '@/lib/auth'
import { headers } from 'next/headers'

const RH_URL    = process.env.NOMINA_API_URL ?? ''
const RH_SECRET = process.env.SECRET_NOMINA  ?? ''

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const trabajadorId = req.nextUrl.searchParams.get('trabajadorId') ?? ''
  if (!trabajadorId)
    return NextResponse.json({ error: 'Falta trabajadorId' }, { status: 400 })

  try {
    const upstream = await fetch(
      `${RH_URL}/api/publicas/empleadosParaCus?trabajadorId=${encodeURIComponent(trabajadorId)}`,
      { headers: { 'x-secret-key': RH_SECRET }, cache: 'no-store' }
    )

    if (upstream.status === 401)
      return NextResponse.json({ error: 'Clave RH inválida' }, { status: 502 })

    if (upstream.status === 404)
      return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 })

    if (!upstream.ok)
      return NextResponse.json({ error: 'Error al consultar RH' }, { status: 502 })

    const json = await upstream.json() as {
      success: boolean
      data: {
        trabajadorID: string
        nombreCompleto: string
        puestoDescripcion: string
        estatus: string
      }
    }

    if (!json.success)
      return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 })

    // Solo devolvemos lo que necesita el formulario
    return NextResponse.json({
      trabajadorId:  json.data.trabajadorID,
      nombre:        json.data.nombreCompleto,
      puesto:        json.data.puestoDescripcion,
      estatus:       json.data.estatus,
    })
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
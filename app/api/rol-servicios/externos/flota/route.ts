import { NextRequest, NextResponse } from 'next/server'
import { auth }    from '@/lib/auth'
import { headers } from 'next/headers'
import { getUserWithRole } from '@/lib/auth/helpers'

const FLOTA_URL    = 'http://proyecto-flota.vercel.app/api/publica'
const FLOTA_APIKEY = process.env.FLOTA_API_SECRET_KEY ?? ''

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const userWithRole = await getUserWithRole(session.user.id)
  if (!userWithRole?.esAdmin) return NextResponse.json({ error: 'No autorizado' }, { status: 403 })

  const p      = req.nextUrl.searchParams
  const placa  = p.get('placa')
  const marca  = p.get('marca')
  const modelo = p.get('modelo')
  const color  = p.get('color')

  // Construir params solo con los que vengan
  const params = new URLSearchParams()
  if (placa)  params.set('placa',  placa)
  if (marca)  params.set('marca',  marca)
  if (modelo) params.set('modelo', modelo)
  if (color)  params.set('color',  color)

  const url = params.size > 0
    ? `${FLOTA_URL}?${params}`
    : FLOTA_URL

  try {
    const upstream = await fetch(url, {
      headers: { 'x-api-key': FLOTA_APIKEY },
      cache: 'no-store',
    })

    if (upstream.status === 401)
      return NextResponse.json({ error: 'API key de Flota inválida' }, { status: 502 })
    if (!upstream.ok)
      return NextResponse.json({ error: 'Error al consultar Flota' }, { status: 502 })

    const data = await upstream.json() as Array<{
      id_vehiculo: number; placa_vehiculo: string
      marca: string; modelo: string; color: string; tipo_vehiculo: string
    }>

    return NextResponse.json(data.map(v => ({
      id:    v.id_vehiculo,
      placa: v.placa_vehiculo,
      marca: v.marca,
      modelo: v.modelo,
      color: v.color,
      tipo:  v.tipo_vehiculo,
      label: `${v.placa_vehiculo} — ${v.marca} ${v.modelo} ${v.color}`,
    })))
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
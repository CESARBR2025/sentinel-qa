import { NextRequest, NextResponse } from 'next/server'
import { auth }    from '@/lib/auth'
import { headers } from 'next/headers'

const FLOTA_URL    = 'http://proyecto-flota.vercel.app/api/publica'
const FLOTA_APIKEY = process.env.FLOTA_API_SECRET_KEY ?? ''

export async function GET(req: NextRequest) {
  // Requiere sesión activa
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const placa = req.nextUrl.searchParams.get('placa') ?? ''
  if (!placa || placa.length < 2)
    return NextResponse.json({ error: 'Mínimo 2 caracteres' }, { status: 400 })

  try {
    const upstream = await fetch(`${FLOTA_URL}?placa=${encodeURIComponent(placa)}`, {
      headers: { 'x-api-key': FLOTA_APIKEY },
      cache: 'no-store',
    })

    if (upstream.status === 401)
      return NextResponse.json({ error: 'API key de Flota inválida' }, { status: 502 })

    if (!upstream.ok)
      return NextResponse.json({ error: 'Error al consultar Flota' }, { status: 502 })

    const data = await upstream.json()
    // Devuelve solo los campos que necesitamos (no exponer todo al cliente)
    const vehiculos = (data as Array<{
      id_vehiculo: number
      placa_vehiculo: string
      marca: string
      modelo: string
      color: string
      tipo_vehiculo: string
    }>).map(v => ({
      id:    v.id_vehiculo,
      placa: v.placa_vehiculo,
      label: `${v.placa_vehiculo} — ${v.marca} ${v.modelo} ${v.color}`,
    }))

    return NextResponse.json(vehiculos)
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
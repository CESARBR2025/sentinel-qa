import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { listarArmasAseguradas, crearArmaAsegurada } from '@/lib/reportes/formato-n-armas-aseguradas-service'

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const registros = await listarArmasAseguradas()
  return NextResponse.json(registros)
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const body = await req.json()
  if (!body.fecha) return NextResponse.json({ error: 'Fecha requerida' }, { status: 400 })
  if (!body.tipo_arma) return NextResponse.json({ error: 'Tipo de arma requerido' }, { status: 400 })

  try {
    const id = await crearArmaAsegurada({
      fecha: body.fecha,
      carpeta_investigacion: body.carpeta_investigacion ?? null,
      tipo_arma: body.tipo_arma,
      matricula: body.matricula ?? null,
      calibre: body.calibre ?? null,
      observaciones: body.observaciones ?? null,
      capturado_por: session.user.id,
    })
    return NextResponse.json({ id }, { status: 201 })
  } catch (err: unknown) {
    const pgErr = err as { message?: string }
    return NextResponse.json({ error: pgErr?.message || 'Error desconocido' }, { status: 500 })
  }
}

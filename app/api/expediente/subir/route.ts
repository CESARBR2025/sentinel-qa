import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { obtenerGuestToken, subirArchivoExpediente } from '@/lib/expediente/client'

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const form = await req.formData()
  const file = form.get('file') as File
  const p = new URL(req.url).searchParams
  const folio = p.get('folio') ?? 'sin-folio'
  const tipoDoc = p.get('tipo') ?? 'DOCUMENTO'

  if (!file || file.size === 0) {
    return NextResponse.json({ error: 'Archivo requerido' }, { status: 400 })
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer())
    const token = await obtenerGuestToken(session.user.name || 'Usuario')
    const url = await subirArchivoExpediente(token, { buffer, nombre: file.name, tipo: file.type }, folio, tipoDoc)
    return NextResponse.json({ success: true, url }, { status: 201 })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error interno'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

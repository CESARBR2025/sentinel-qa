import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { Packer } from 'docx'
import { obtenerDiaNovedades } from '@/lib/novedades/service'
import { armarDocumentoNovedades } from '@/lib/novedades/docx'
import { verificarAccesoNovedadesApi } from '@/lib/reportes/permisos'

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoNovedadesApi(session.user.id, 'ver')
  if (chequeo) return chequeo

  const fecha = req.nextUrl.searchParams.get('fecha')
  if (!fecha) return NextResponse.json({ error: 'Fecha requerida' }, { status: 400 })

  const dia = await obtenerDiaNovedades(fecha)
  const doc = armarDocumentoNovedades(dia)
  const buffer = await Packer.toBuffer(doc)

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="parte_novedades_c4_${fecha}.docx"`,
    },
  })
}

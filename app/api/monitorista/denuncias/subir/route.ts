import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { subirEvidenciaDenuncia } from '@/lib/monitorista/denuncia-service'

function detectarMime(nombre: string, fileType: string): string {
  if (fileType && fileType !== 'application/octet-stream') return fileType
  const ext = nombre.split('.').pop()?.toLowerCase()
  const mapa: Record<string, string> = {
    mov: 'video/quicktime', mp4: 'video/mp4', avi: 'video/x-msvideo',
    webm: 'video/webm', pdf: 'application/pdf', jpg: 'image/jpeg',
    jpeg: 'image/jpeg', png: 'image/png', gif: 'image/gif', webp: 'image/webp',
  }
  return mapa[ext ?? ''] || 'application/octet-stream'
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const form = await req.formData()
  const file = form.get('file') as File
  const p = new URL(req.url).searchParams
  const denunciaId = p.get('denunciaId')!
  const solicitudId = Number(p.get('solicitudId'))
  const tipo = p.get('tipo') ?? 'foto'
  const nombreOriginal = p.get('nombreOriginal') ?? file.name

  if (!denunciaId || !file || file.size === 0 || !solicitudId) {
    return NextResponse.json({ error: 'Datos insuficientes' }, { status: 400 })
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer())
    const mime = detectarMime(nombreOriginal, file.type)
    const url = await subirEvidenciaDenuncia(
      session.user.id, session.user.name || 'Monitorista',
      denunciaId, solicitudId, buffer, nombreOriginal, mime, tipo,
    )
    return NextResponse.json({ success: true, url }, { status: 201 })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error interno'
    console.error('[subir-evidencia-denuncia]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

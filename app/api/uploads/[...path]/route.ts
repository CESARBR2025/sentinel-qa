import { auth }    from '@/lib/auth'
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { tienePermiso } from '@/lib/prevencion/permisos'

const MIME: Record<string, string> = {
  '.pdf':  'application/pdf',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png':  'image/png',
  '.doc':  'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
}

// Primer segmento de la ruta bajo uploads/ -> sección requerida para verla.
// Deny-by-default: cualquier carpeta no listada aquí se rechaza con 403, no
// se asume acceso libre. Si un módulo nuevo empieza a escribir en uploads/,
// agregar su entrada aquí.
const SECCION_POR_CARPETA: Record<string, 'busquedas' | 'medidas'> = {
  busquedas:          'busquedas',
  medidas_proteccion: 'medidas',
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { path: segments } = await params
  // Prevent path traversal
  const safe = segments.map(s => s.replace(/\.\./g, '')).filter(Boolean)

  const carpeta = safe[0]
  const seccion = carpeta ? SECCION_POR_CARPETA[carpeta] : undefined
  if (!seccion || !(await tienePermiso(session.user.id, seccion, 'ver'))) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const filePath = path.join(process.cwd(), 'uploads', ...safe)

  try {
    const buffer = await fs.readFile(filePath)
    const ext    = path.extname(filePath).toLowerCase()
    const mime   = MIME[ext] ?? 'application/octet-stream'
    return new NextResponse(buffer, {
      headers: {
        'Content-Type':        mime,
        'Content-Disposition': `inline; filename="${path.basename(filePath)}"`,
      },
    })
  } catch {
    return NextResponse.json({ error: 'Archivo no encontrado' }, { status: 404 })
  }
}

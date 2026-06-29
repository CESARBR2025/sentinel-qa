import { query } from '@/lib/db'
import PptxGenJS from 'pptxgenjs'
import { obtenerGuestToken } from '@/lib/expediente/client'

const EXP_URL = process.env.EXPEDIENTE_DIGITAL_URL ?? 'https://sanjuandelrio.sytes.net:3044'

interface DetenidoData {
  nombre_detenido: string
  folio: string
  tipo_evento: string | null
  delitos: string | null
  falta_admin: string | null
  modus_operandi: string | null
  fotos: { url_archivo: string }[]
}

async function descargarFoto(url: string, token: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(15000),
    })
    if (!res.ok) return null
    const buf = await res.arrayBuffer()
    const base64 = Buffer.from(buf).toString('base64')
    const ext = url.split('.').pop()?.toLowerCase() || 'jpg'
    const mime = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg'
    return `data:${mime};base64,${base64}`
  } catch {
    return null
  }
}

export async function generarPpt(
  monitoristaNombre: string,
  desde: string,
  hasta: string,
  filtro: string = 'todos',
): Promise<Buffer> {
  let havingFiltro = ''
  if (filtro === 'pendientes') {
    havingFiltro = `HAVING bool_or(sf.estado IN ('pendiente','enviado','rechazado')) AND NOT bool_or(sf.estado = 'completado')`
  } else if (filtro === 'completados') {
    havingFiltro = `HAVING bool_or(sf.estado = 'completado') AND NOT bool_or(sf.estado IN ('pendiente','enviado','rechazado'))`
  }

  const rows = await query<Record<string, unknown>>(
    `SELECT sd.* FROM solicitudes_detenido sd
     INNER JOIN solicitud_fotos sf ON sf.solicitud_id = sd.id
     WHERE sd.creado_en >= $1 AND sd.creado_en < $2
     GROUP BY sd.id ${havingFiltro}
     ORDER BY sd.creado_en`,
    [desde, hasta],
  )

  if (rows.rows.length === 0) {
    throw new Error('No hay detenidos completados en el período seleccionado')
  }

  const token = await obtenerGuestToken(monitoristaNombre)

  const detenidos: DetenidoData[] = []
  for (const r of rows.rows) {
    const id = String(r.id)
    const fotos = await query<Record<string, unknown>>(
      `SELECT url_archivo FROM evidencias_detenido WHERE solicitud_id = $1 ORDER BY tipo_foto`, [id],
    )
    detenidos.push({
      nombre_detenido: String(r.nombre_detenido),
      folio: String(r.folio),
      tipo_evento: r.tipo_evento ? String(r.tipo_evento) : null,
      delitos: r.delitos ? String(r.delitos) : null,
      falta_admin: r.falta_admin ? String(r.falta_admin) : null,
      modus_operandi: r.modus_operandi ? String(r.modus_operandi) : null,
      fotos: fotos.rows.map(f => ({ url_archivo: String(f.url_archivo) })),
    })
  }

  const pptx = new PptxGenJS()
  pptx.author = 'SSPM - Módulo Monitorista'
  pptx.title = 'Reporte de Detenidos'
  pptx.subject = `Período: ${desde} a ${hasta}`

  const slideW = 10
  const marginX = 0.5
  const contentW = slideW - marginX * 2

  for (const d of detenidos) {
    const slide = pptx.addSlide()

    // Header compacto
    slide.addText('Reporte de Detenido', {
      x: marginX, y: 0.15, w: contentW, h: 0.35,
      fontSize: 20, fontFace: 'Arial', bold: true, color: '1E40AF',
    })
    slide.addText(`SSPM San Juan del Río · ${new Date().toLocaleDateString('es-MX')}`, {
      x: marginX, y: 0.5, w: contentW, h: 0.2,
      fontSize: 10, fontFace: 'Arial', color: '64748B',
    })
    slide.addShape('line', { x: marginX, y: 0.75, w: contentW, h: 0 })

    // Fotos (si hay)
    const fotosBase64 = await Promise.all(
      d.fotos.map(f => f.url_archivo.startsWith('http') ? descargarFoto(f.url_archivo, token) : Promise.resolve(null)),
    )
    const fotosValidas = fotosBase64.filter((f): f is string => f !== null)
    const imgCount = Math.min(fotosValidas.length, 3)
    const imgWidth = 2.6
    const imgGap = 0.25
    const imgStartX = marginX + (contentW - (Math.max(imgCount, 1) * imgWidth + (Math.max(imgCount, 1) - 1) * imgGap)) / 2
    const imgY = 0.95
    const imgH = 2.5

    for (let i = 0; i < imgCount; i++) {
      try {
        slide.addImage({ path: fotosValidas[i], x: imgStartX + i * (imgWidth + imgGap), y: imgY, w: imgWidth, h: imgH })
      } catch { /* skip */ }
    }

    // Etiquetas de fotos
    const etiquetas: Record<number, string> = { 0: 'Frontal', 1: 'Lado Derecho', 2: 'Lado Izquierdo' }
    if (imgCount > 0) {
      for (let i = 0; i < imgCount; i++) {
        slide.addText(etiquetas[i] || 'Foto', {
          x: imgStartX + i * (imgWidth + imgGap), y: imgY + imgH + 0.02, w: imgWidth, h: 0.2,
          fontSize: 8, fontFace: 'Arial', color: '64748B', align: 'center',
        })
      }
    }

    // Tabla de datos — posición según haya o no fotos
    const tablaY = imgCount > 0 ? imgY + imgH + 0.3 : 1.0
    const fontSize = imgCount > 0 ? 9 : 10

    const datos = [
      [{ text: 'Nombre', options: { fontSize, bold: true, color: '1E40AF', fill: { color: 'F1F5F9' } } },
       { text: d.nombre_detenido, options: { fontSize, color: '1E293B' } }],
      [{ text: 'Folio', options: { fontSize, bold: true, color: '1E40AF', fill: { color: 'F1F5F9' } } },
       { text: d.folio, options: { fontSize, color: '1E293B' } }],
      [{ text: 'Tipo de Evento', options: { fontSize, bold: true, color: '1E40AF', fill: { color: 'F1F5F9' } } },
       { text: d.tipo_evento || '—', options: { fontSize, color: '1E293B' } }],
      [{ text: 'Delitos', options: { fontSize, bold: true, color: '1E40AF', fill: { color: 'F1F5F9' } } },
       { text: d.delitos || '—', options: { fontSize, color: '1E293B' } }],
      [{ text: 'Falta Administrativa', options: { fontSize, bold: true, color: '1E40AF', fill: { color: 'F1F5F9' } } },
       { text: d.falta_admin || '—', options: { fontSize, color: '1E293B' } }],
      [{ text: 'Modus Operandi', options: { fontSize, bold: true, color: '1E40AF', fill: { color: 'F1F5F9' } } },
       { text: d.modus_operandi || '—', options: { fontSize, color: '1E293B' } }],
    ]

    slide.addTable(datos, {
      x: marginX, y: tablaY, w: contentW,
      colW: [2.2, contentW - 2.2],
      rowH: 0.28,
      border: { type: 'solid', pt: 0.5, color: 'E2E8F0' },
    })

    // Footer
    const footerY = tablaY + datos.length * 0.28 + 0.2
    slide.addText(
      `Generado por SSPM Monitorista · ${new Date().toLocaleString('es-MX')}`,
      { x: marginX, y: footerY, w: contentW, h: 0.25, fontSize: 8, fontFace: 'Arial', color: '94A3B8' },
    )
  }

  try {
    const buf = await pptx.write({ outputType: 'nodebuffer' })
    return Buffer.from(buf)
  } catch (err) {
    throw new Error(`Error generando PPT: ${err instanceof Error ? err.message : 'desconocido'}`)
  }
}

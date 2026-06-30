import { query } from '@/lib/db'
import PptxGenJS from 'pptxgenjs'
import { obtenerGuestToken } from '@/lib/expediente/client'

function parseDetenidos(raw: unknown): string {
  if (typeof raw === 'string') {
    try { const arr = JSON.parse(raw); return Array.isArray(arr) && arr.length > 0 ? (arr[0].nombre || 'Sin nombre') : 'Sin nombre' }
    catch { return String(raw || 'Sin nombre') }
  }
  if (Array.isArray(raw) && raw.length > 0) return raw[0].nombre || 'Sin nombre'
  return 'Sin nombre'
}

async function descargarFoto(url: string, token: string): Promise<string | null> {
  try {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(15000) })
    if (!res.ok) return null
    const buf = await res.arrayBuffer()
    const base64 = Buffer.from(buf).toString('base64')
    const ext = url.split('.').pop()?.toLowerCase() || 'jpg'
    const mime = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg'
    return `data:${mime};base64,${base64}`
  } catch { return null }
}

export async function generarPpt(
  monitoristaNombre: string,
  desde: string,
  hasta: string,
  filtro: string = 'todos',
): Promise<Buffer> {
  let whereFiltro = ''
  if (filtro === 'pendientes') {
    whereFiltro = `AND EXISTS (SELECT 1 FROM solicitud_fotos sf WHERE sf.reporte_campo_id = rc.id AND sf.estado IN ('pendiente','enviado','rechazado'))`
  } else if (filtro === 'completados') {
    whereFiltro = `AND EXISTS (SELECT 1 FROM solicitud_fotos sf WHERE sf.reporte_campo_id = rc.id AND sf.estado = 'completado')`
  }

  const fechaFiltro = desde && hasta ? `AND rc.created_at >= $1 AND rc.created_at < $2` : ''
  const params: unknown[] = []
  if (desde && hasta) { params.push(desde, hasta) }

  const rows = await query<Record<string, unknown>>(
    `SELECT rc.id, rc.folio_reporte_campo, rc.ofi_tipo_incidente, rc.ofi_detenidos,
            rc.delito, rc.marco_legal, rc.falta_administrativa, rc.modus_operandi,
            ord.delito as delito_denuncia, ord.marco_legal as marco_legal_denuncia
     FROM ofi_reportes_campo rc
     LEFT JOIN ofi_reporte_denuncia ord ON ord.reporte_campo_id = rc.id
     WHERE rc.ofi_detenidos IS NOT NULL
       AND rc.ofi_detenidos::text NOT IN ('[]', '1')
       ${fechaFiltro}
       ${whereFiltro}
     ORDER BY rc.created_at`,
    params,
  )

  if (rows.rows.length === 0) throw new Error('No hay reportes con detenidos en el período seleccionado')

  const token = await obtenerGuestToken(monitoristaNombre)
  const pptx = new PptxGenJS()
  pptx.author = 'SSPM - Módulo Monitorista'
  pptx.title = 'Reporte de Detenidos'
  pptx.subject = `Período: ${desde} a ${hasta}`

  for (const row of rows.rows) {
    const id = String(row.id)
    const slide = pptx.addSlide()
    const nombre = parseDetenidos(row.ofi_detenidos)
    const folio = String(row.folio_reporte_campo || '')
    const delito = String(row.delito || row.delito_denuncia || '—')
    const marcoLegal = String(row.marco_legal || row.marco_legal_denuncia || '')
    const faltaAdmin = String(row.falta_administrativa || marcoLegal || '—')
    const modusOp = String(row.modus_operandi || '—')

    // Cargar fotos
    const evs = await query<Record<string, unknown>>(
      `SELECT url_archivo, tipo_foto FROM evidencias_detenido WHERE reporte_campo_id = $1 ORDER BY tipo_foto`, [id],
    )
    const imgUrls = await Promise.all(
      evs.rows.map(e => String(e.url_archivo).startsWith('http') ? descargarFoto(String(e.url_archivo), token) : Promise.resolve(null)),
    )
    const valids = imgUrls.filter((f): f is string => f !== null)
    const imgCount = Math.min(valids.length, 3)

    const marginX = 0.6
    const contentW = 9
    const imgW = 2.7
    const imgGap = 0.2
    const imgStartX = marginX + (contentW - (Math.max(imgCount, 1) * imgW + (Math.max(imgCount, 1) - 1) * imgGap)) / 2
    const imgY = 1.1
    const imgH = 2.4

    // Header
    slide.addText('Reporte de Detenido', { x: marginX, y: 0.15, w: 9, h: 0.35, fontSize: 22, fontFace: 'Arial', bold: true, color: '1E40AF' })
    slide.addText(`SSPM San Juan del Río · ${new Date().toLocaleString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' })}`, { x: marginX, y: 0.5, w: 9, h: 0.2, fontSize: 10, fontFace: 'Arial', color: '64748B' })
    slide.addShape('line', { x: marginX, y: 0.75, w: contentW, h: 0 })

    // Fotos (si hay)
    if (imgCount > 0) {
      for (let i = 0; i < imgCount; i++) {
        try { slide.addImage({ path: valids[i], x: imgStartX + i * (imgW + imgGap), y: imgY, w: imgW, h: imgH }) } catch { /* skip */ }
      }
      const etiquetas: Record<number, string> = { 0: 'Frontal', 1: 'Derecho', 2: 'Izquierdo' }
      for (let i = 0; i < imgCount; i++) {
        slide.addText(etiquetas[i] || '', { x: imgStartX + i * (imgW + imgGap), y: imgY + imgH + 0.02, w: imgW, h: 0.18, fontSize: 8, fontFace: 'Arial', color: '64748B', align: 'center' })
      }
    }

    // Tabla de datos
    const tablaY = imgCount > 0 ? imgY + imgH + 0.28 : 1.0
    const fs = imgCount > 0 ? 9 : 10
    const rowH = imgCount > 0 ? 0.28 : 0.32

    const datos = [
      [{ text: 'Nombre del Detenido', options: { fontSize: fs, bold: true, color: '1E40AF', fill: { color: 'F1F5F9' } } }, { text: nombre, options: { fontSize: fs, color: '1E293B' } }],
      [{ text: 'Folio', options: { fontSize: fs, bold: true, color: '1E40AF', fill: { color: 'F1F5F9' } } }, { text: folio || '—', options: { fontSize: fs, color: '1E293B' } }],
      [{ text: 'Evento o Incidente', options: { fontSize: fs, bold: true, color: '1E40AF', fill: { color: 'F1F5F9' } } }, { text: String(row.ofi_tipo_incidente || '—'), options: { fontSize: fs, color: '1E293B' } }],
      [{ text: 'Delitos', options: { fontSize: fs, bold: true, color: '1E40AF', fill: { color: 'F1F5F9' } } }, { text: delito, options: { fontSize: fs, color: '1E293B' } }],
      [{ text: 'Falta Administrativa', options: { fontSize: fs, bold: true, color: '1E40AF', fill: { color: 'F1F5F9' } } }, { text: faltaAdmin, options: { fontSize: fs, color: '1E293B' } }],
      [{ text: 'Modus Operandi', options: { fontSize: fs, bold: true, color: '1E40AF', fill: { color: 'F1F5F9' } } }, { text: modusOp, options: { fontSize: fs, color: '1E293B' } }],
    ]

    slide.addTable(datos, { x: marginX, y: tablaY, w: contentW, colW: [2.4, contentW - 2.4], rowH, border: { type: 'solid', pt: 0.5, color: 'E2E8F0' } })

    // Footer
    const footerY = tablaY + datos.length * rowH + 0.15
    slide.addText(`Generado por SSPM Monitorista · ${new Date().toLocaleString('es-MX')}`, { x: marginX, y: footerY, w: contentW, h: 0.2, fontSize: 8, fontFace: 'Arial', color: '94A3B8' })
  }

  try { return Buffer.from(await pptx.write({ outputType: 'nodebuffer' }) as ArrayBuffer) }
  catch (err) { throw new Error(`Error generando PPT: ${err instanceof Error ? err.message : 'desconocido'}`) }
}

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

async function descargarFoto(url: string, token: string): Promise<{ base64: string; mime: string } | null> {
  try {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(15000) })
    if (!res.ok) return null
    const buf = await res.arrayBuffer()
    const ext = url.split('.').pop()?.toLowerCase() || 'jpg'
    const mime = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg'
    return { base64: Buffer.from(buf).toString('base64'), mime }
  } catch { return null }
}

function getAspectRatio(base64: string): number {
  const buf = Buffer.from(base64, 'base64')
  // PNG: first 8 bytes are signature, then IHDR chunk (4 len + 4 type + 4 w + 4 h)
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) {
    const w = buf.readUInt32BE(16)
    const h = buf.readUInt32BE(20)
    return w && h ? w / h : 1
  }
  // JPEG: look for SOF0 marker (0xFF 0xC0)
  let off = 0
  while (off < buf.length - 1) {
    if (buf[off] === 0xFF && buf[off + 1] === 0xC0) {
      const h = buf.readUInt16BE(off + 5)
      const w = buf.readUInt16BE(off + 7)
      return w && h ? w / h : 1
    }
    off++
  }
  return 1
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

    // Cargar fotos (solo la última por tipo)
    const evs = await query<Record<string, unknown>>(
      `SELECT DISTINCT ON (tipo_foto) url_archivo, tipo_foto
       FROM evidencias_detenido
       WHERE reporte_campo_id = $1
       ORDER BY tipo_foto, creado_en DESC`, [id],
    )
    const buffers = await Promise.all(
      evs.rows.map(e => String(e.url_archivo).startsWith('http') ? descargarFoto(String(e.url_archivo), token) : Promise.resolve(null)),
    )
    const valids = buffers.filter((f): f is { base64: string; mime: string } => f !== null)
    const imgCount = Math.min(valids.length, 3)

    const marginX = 0.6
    const contentW = 9

    // Header
    slide.addText('Reporte de Detenido', { x: marginX, y: 0.15, w: contentW, h: 0.35, fontSize: 22, fontFace: 'Arial', bold: true, color: '1E40AF' })
    slide.addText(`SSPM San Juan del Río · ${new Date().toLocaleString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' })}`, { x: marginX, y: 0.5, w: contentW, h: 0.2, fontSize: 10, fontFace: 'Arial', color: '64748B' })
    slide.addShape('line', { x: marginX, y: 0.75, w: contentW, h: 0 })

    // Tabla de datos (siempre en la misma posición)
    const tablaY = 0.9
    const rowH = 0.3
    const fs = 9

    const datos = [
      [{ text: 'Nombre del Detenido', options: { fontSize: fs, bold: true, color: '1E40AF', fill: { color: 'F1F5F9' } } }, { text: nombre, options: { fontSize: fs, color: '1E293B' } }],
      [{ text: 'Folio', options: { fontSize: fs, bold: true, color: '1E40AF', fill: { color: 'F1F5F9' } } }, { text: folio || '—', options: { fontSize: fs, color: '1E293B' } }],
      [{ text: 'Evento o Incidente', options: { fontSize: fs, bold: true, color: '1E40AF', fill: { color: 'F1F5F9' } } }, { text: String(row.ofi_tipo_incidente || '—'), options: { fontSize: fs, color: '1E293B' } }],
      [{ text: 'Delitos', options: { fontSize: fs, bold: true, color: '1E40AF', fill: { color: 'F1F5F9' } } }, { text: delito, options: { fontSize: fs, color: '1E293B' } }],
      [{ text: 'Falta Administrativa', options: { fontSize: fs, bold: true, color: '1E40AF', fill: { color: 'F1F5F9' } } }, { text: faltaAdmin, options: { fontSize: fs, color: '1E293B' } }],
      [{ text: 'Modus Operandi', options: { fontSize: fs, bold: true, color: '1E40AF', fill: { color: 'F1F5F9' } } }, { text: modusOp, options: { fontSize: fs, color: '1E293B' } }],
    ]

    slide.addTable(datos, { x: marginX, y: tablaY, w: contentW, colW: [2.4, contentW - 2.4], rowH, border: { type: 'solid', pt: 0.5, color: 'E2E8F0' } })

    const finTabla = tablaY + datos.length * rowH

    // Fotos debajo de la tabla
    let imgH = 0
    if (imgCount > 0) {
      imgH = 1.6
      const imgGap = 0.25
      const imgY = finTabla + 0.15
      const anchoMax = 2.5

      let totalW = 0
      const anchos: number[] = []
      for (let i = 0; i < imgCount; i++) {
        const w = Math.min(anchoMax, imgH * getAspectRatio(valids[i].base64))
        anchos.push(w)
        totalW += w
      }
      totalW += (imgCount - 1) * imgGap
      const imgStartX = marginX + (contentW - totalW) / 2

      let xOff = 0
      for (let i = 0; i < imgCount; i++) {
        try { slide.addImage({ data: `${valids[i].mime};base64,${valids[i].base64}`, x: imgStartX + xOff, y: imgY, w: anchos[i], h: imgH }) } catch { /* skip */ }
        xOff += anchos[i] + imgGap
      }
      const etiquetas: Record<number, string> = { 0: 'Frontal', 1: 'Derecho', 2: 'Izquierdo' }
      xOff = 0
      for (let i = 0; i < imgCount; i++) {
        slide.addText(etiquetas[i] || '', { x: imgStartX + xOff, y: imgY + imgH + 0.02, w: anchos[i], h: 0.16, fontSize: 7, fontFace: 'Arial', color: '64748B', align: 'center' })
        xOff += anchos[i] + imgGap
      }
    }

    // Footer
    const footerY = imgCount > 0 ? finTabla + 0.15 + imgH + 0.22 + 0.1 : finTabla + 0.15
    slide.addText(`Generado por SSPM Monitorista · ${new Date().toLocaleString('es-MX')}`, { x: marginX, y: footerY, w: contentW, h: 0.2, fontSize: 8, fontFace: 'Arial', color: '94A3B8' })
  }

  try { return Buffer.from(await pptx.write({ outputType: 'nodebuffer' }) as ArrayBuffer) }
  catch (err) { throw new Error(`Error generando PPT: ${err instanceof Error ? err.message : 'desconocido'}`) }
}

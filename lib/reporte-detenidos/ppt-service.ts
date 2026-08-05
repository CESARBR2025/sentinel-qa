import { query } from '@/lib/db'
import PptxGenJS from 'pptxgenjs'
import { esRefV2, parsearRef } from '@/lib/expediente/v2/ref'
import { descargar as descargarV2 } from '@/lib/expediente/v2/client'
import { listarDetenidosCompletos, obtenerFichaCompleta } from './repository'
import type { DetenidoCompleto, FichaDetenidoCompleta } from './types'
import fs from 'fs'
import path from 'path'

// Tokens de DESIGN.md (fuente única de verdad visual): acento institucional
// default #1f355a (no el morado #7c3aed, que es exclusivo de Fiscalía).
const COLOR_PRIMARY = '1F355A'
const COLOR_TITLE = '0F172A'
const COLOR_MUTED = '64748B'
const COLOR_FAINT = '94A3B8'
const COLOR_HEADER_FILL = 'F1F5F9'
const COLOR_BORDER = 'E2E8F0'

async function descargarFoto(url: string): Promise<{ base64: string; mime: string } | null> {
  const ext = url.split('.').pop()?.toLowerCase() || ''
  if (ext === 'pdf') return null
  if (!esRefV2(url)) return null
  try {
    const ref = parsearRef(url)
    if (!ref) return null
    const res = await descargarV2(ref)
    if (!res.ok) return null
    const buf = await res.arrayBuffer()
    const mime = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg'
    return { base64: Buffer.from(buf).toString('base64'), mime }
  } catch {
    return null
  }
}

function getAspectRatio(base64: string): number {
  const buf = Buffer.from(base64, 'base64')
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) {
    const w = buf.readUInt32BE(16)
    const h = buf.readUInt32BE(20)
    return w && h ? w / h : 1
  }
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

type Rango = { inicio: Date; fin: Date; titulo: string }

function calcularRangos(hoy: Date): Rango[] {
  const inicioDia = new Date(hoy); inicioDia.setHours(0, 0, 0, 0)
  const finDia = new Date(inicioDia); finDia.setDate(finDia.getDate() + 1)

  const inicioSemana = new Date(inicioDia)
  const diaSemana = inicioSemana.getDay() // 0=domingo
  const offset = diaSemana === 0 ? 6 : diaSemana - 1 // lunes como inicio de semana
  inicioSemana.setDate(inicioSemana.getDate() - offset)
  const finSemana = new Date(inicioSemana); finSemana.setDate(finSemana.getDate() + 7)

  const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
  const finMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 1)

  const fmt = (d: Date) => d.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' })

  return [
    { inicio: inicioDia, fin: finDia, titulo: `Diario · ${fmt(inicioDia)}` },
    { inicio: inicioSemana, fin: finSemana, titulo: `Semanal · ${fmt(inicioSemana)} al ${fmt(new Date(finSemana.getTime() - 1))}` },
    { inicio: inicioMes, fin: finMes, titulo: `Mensual · ${fmt(inicioMes)} al ${fmt(new Date(finMes.getTime() - 1))}` },
  ]
}

function addDividerSlide(pptx: PptxGenJS, titulo: string, cantidad: number) {
  const slide = pptx.addSlide()
  slide.addText('Reporte de Detenidos', { x: 0.5, y: 2.3, w: 6.5, h: 0.6, fontSize: 32, fontFace: 'Arial', bold: true, color: COLOR_PRIMARY, align: 'center' })
  slide.addText(titulo, { x: 0.5, y: 3.1, w: 6.5, h: 0.4, fontSize: 18, fontFace: 'Arial', color: COLOR_TITLE, align: 'center' })
  slide.addText(`${cantidad} detenido${cantidad !== 1 ? 's' : ''}`, { x: 0.5, y: 3.6, w: 6.5, h: 0.3, fontSize: 12, fontFace: 'Arial', color: COLOR_MUTED, align: 'center' })
}

function imagenLogo(): { data: string } | { path: string } | null {
  // Misma estrella/placa institucional del formato oficial UDAI (extraída de
  // FORMATO FICHA DE DETENIDOS.pptx), no el logo de producto Centinela.
  const p = path.resolve(process.cwd(), 'public', 'logo_ficha_udai.png')
  try {
    if (!fs.existsSync(p)) return null
    const buf = fs.readFileSync(p)
    return { data: `data:image/png;base64,${buf.toString('base64')}` }
  } catch {
    return null
  }
}

// Tabla de pares label/valor en 2 columnas; `fullWidth` marca filas que ocupan el ancho completo.
function tablaPares(
  slide: PptxGenJS.Slide,
  x: number,
  y: number,
  contentW: number,
  fs: number,
  rowH: number,
  filas: { label: string; valor: string; fullWidth?: boolean }[],
  titulo?: string,
): number {
  let yy = y
  if (titulo) {
    slide.addText(titulo, {
      x, y: yy, w: contentW, h: 0.25, fontSize: 10, fontFace: 'Arial', bold: true, color: COLOR_PRIMARY, align: 'center',
    })
    yy += 0.28
  }

  const colHalf = [contentW * 0.16, contentW * 0.34, contentW * 0.16, contentW * 0.34]

  const par = (f: { label: string; valor: string; fullWidth?: boolean }) => [
    { text: f.label, options: { fontSize: fs, bold: true, color: COLOR_PRIMARY, fill: { color: COLOR_HEADER_FILL } } },
    { text: f.valor || '—', options: { fontSize: fs, color: '1E293B' } },
  ]

  // Emparejar filas no-fullWidth de a 2 para formar 4 columnas por fila
  const merged: { text: string; options: PptxGenJS.TableCellProps }[][] = []
  let buffer: { text: string; options: PptxGenJS.TableCellProps }[] = []
  for (const fila of filas) {
    if (fila.fullWidth) {
      if (buffer.length) { merged.push(buffer); buffer = [] }
      merged.push(par(fila))
    } else {
      buffer.push(...par(fila))
      if (buffer.length === 4) { merged.push(buffer); buffer = [] }
    }
  }
  if (buffer.length) merged.push(buffer)

  slide.addTable(merged, {
    x, y: yy, w: contentW, colW: colHalf, rowH,
    border: { type: 'solid', pt: 0.5, color: COLOR_BORDER },
    margin: 2,
  })
  return yy + merged.length * rowH
}

async function addDetenidoSlide(pptx: PptxGenJS, d: DetenidoCompleto, ficha: FichaDetenidoCompleta) {
  const slide = pptx.addSlide()
  const marginX = 0.4
  const contentW = 6.7

  // ---- Encabezado: logo + título + folio ----
  const logo = imagenLogo()
  if (logo) {
    try { slide.addImage({ ...logo, x: 0.4, y: 0.25, w: 0.7, h: 0.7 }) } catch { /* logo opcional */ }
  }
  slide.addText('FICHA DE DETENIDO', { x: marginX, y: 0.22, w: contentW, h: 0.3, fontSize: 18, fontFace: 'Arial', bold: true, color: COLOR_PRIMARY, align: 'center' })
  slide.addText(`SSPM San Juan del Río · ${new Date().toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' })}`, { x: marginX, y: 0.5, w: contentW, h: 0.18, fontSize: 8, fontFace: 'Arial', color: COLOR_MUTED, align: 'center' })
  slide.addShape('line', { x: marginX, y: 0.72, w: contentW, h: 0 })

  // ---- Fotos: frontal prominente + objetos a un costado ----
  let fotoFrontal: { base64: string; mime: string } | null = null
  const frontQuery = await query<Record<string, unknown>>(
    `SELECT url_archivo FROM evidencias_detenido
     WHERE reporte_campo_id = $1 AND tipo_contenido = 'detenido' AND detenido_index = 0 AND tipo_foto = 'frontal'
     ORDER BY creado_en DESC LIMIT 1`,
    [d.id],
  )
  if (frontQuery.rows.length) {
    const buf = await descargarFoto(String(frontQuery.rows[0].url_archivo))
    if (buf) fotoFrontal = buf
  }

  const objQuery = await query<Record<string, unknown>>(
    `SELECT url_archivo, tipo_foto FROM (
       SELECT url_archivo, tipo_foto, ROW_NUMBER() OVER (PARTITION BY tipo_foto ORDER BY creado_en DESC) as rn
       FROM evidencias_detenido
       WHERE reporte_campo_id = $1 AND tipo_contenido = 'objeto'
     ) sub WHERE rn = 1
     ORDER BY tipo_foto`,
    [d.id],
  )
  const objBuffers = (await Promise.all(objQuery.rows.map(o => descargarFoto(String(o.url_archivo)))))
    .filter((f): f is { base64: string; mime: string } => f !== null)

  const fotoY = 0.8
  const fotoH = 1.9
  let fotoX = marginX
  if (fotoFrontal) {
    const w = Math.min(1.7, fotoH * getAspectRatio(fotoFrontal.base64))
    try {
      slide.addImage({ data: `data:${fotoFrontal.mime};base64,${fotoFrontal.base64}`, x: fotoX, y: fotoY, w, h: fotoH })
      slide.addText('Fotografía del detenido', { x: fotoX, y: fotoY + fotoH + 0.02, w, h: 0.15, fontSize: 6, fontFace: 'Arial', color: COLOR_FAINT, align: 'center' })
    } catch { /* omitir foto */ }
    fotoX += w + 0.15
  }
  const objGap = 0.12
  const objW = 0.9
  let objX = fotoX
  for (const o of objBuffers.slice(0, 3)) {
    try {
      slide.addImage({ data: `data:${o.mime};base64,${o.base64}`, x: objX, y: fotoY + 0.2, w: objW, h: objW * 1.15 })
      slide.addText('Objeto', { x: objX, y: fotoY + 0.2 + objW * 1.15 + 0.02, w: objW, h: 0.15, fontSize: 6, fontFace: 'Arial', color: COLOR_FAINT, align: 'center' })
    } catch { /* omitir objeto */ }
    objX += objW + objGap
  }
  const finFotos = Math.max(fotoY + fotoH + 0.2, fotoY + 0.2 + objW * 1.15 + 0.2)

  // ---- Tabla nombre / apodo / folio ----
  const tablaNombre = [
    [
      { text: 'NOMBRE COMPLETO', options: { fontSize: 8, bold: true, color: COLOR_PRIMARY, fill: { color: COLOR_HEADER_FILL } } },
      { text: ficha.nombreCompleto, options: { fontSize: 8, color: '1E293B' } },
    ],
    [
      { text: 'APODO', options: { fontSize: 8, bold: true, color: COLOR_PRIMARY, fill: { color: COLOR_HEADER_FILL } } },
      { text: ficha.apodo || '', options: { fontSize: 8, color: '1E293B' } },
    ],
    [
      { text: 'FOLIO DE FICHA', options: { fontSize: 8, bold: true, color: COLOR_PRIMARY, fill: { color: COLOR_HEADER_FILL } } },
      { text: ficha.folioFicha, options: { fontSize: 8, color: '1E293B' } },
    ],
    [
      { text: 'RUBRO', options: { fontSize: 8, bold: true, color: COLOR_PRIMARY, fill: { color: COLOR_HEADER_FILL } } },
      { text: ficha.rubro, options: { fontSize: 8, color: '1E293B' } },
    ],
  ]
  slide.addTable(tablaNombre, { x: marginX, y: finFotos + 0.05, w: contentW, colW: [1.6, contentW - 1.6], rowH: 0.22, border: { type: 'solid', pt: 0.5, color: COLOR_BORDER }, margin: 2 })
  const finNombre = finFotos + 0.05 + tablaNombre.length * 0.22

  // ---- DATOS GENERALES ----
  const finGenerales = tablaPares(slide, marginX, finNombre + 0.15, contentW, 7.5, 0.22, [
    { label: 'FECHA DE NACIMIENTO', valor: ficha.fechaNacimiento ? `${ficha.fechaNacimiento}${ficha.edad != null ? ` (${ficha.edad} años)` : ''}` : '—' },
    { label: 'GÉNERO', valor: ficha.genero || '—' },
    { label: 'ORIGINARIO', valor: ficha.originario || '—' },
    { label: 'ESTADO CIVIL', valor: ficha.estadoCivil || '—' },
    { label: 'ESCOLARIDAD', valor: ficha.escolaridad || '—' },
    { label: 'OCUPACIÓN', valor: ficha.ocupacion || '—' },
    { label: 'DOMICILIO', valor: ficha.domicilio, fullWidth: true },
    { label: 'RASGOS PARTICULARES', valor: ficha.rasgosParticulares || '—', fullWidth: true },
  ], 'DATOS GENERALES DETENIDO')

  // ---- EVENTO DELICTIVO ----
  const finEvento = tablaPares(slide, marginX, finGenerales + 0.15, contentW, 7.5, 0.22, [
    { label: 'FECHA / HORA', valor: ficha.fechaHoraEvento || '—' },
    { label: 'RND', valor: ficha.rnd || '—' },
    { label: 'EXPEDIENTE', valor: ficha.expediente || '—' },
    { label: 'IPH', valor: ficha.iph || '—' },
    { label: 'LUGAR DEL EVENTO', valor: ficha.lugarEvento || '—' },
    { label: 'LUGAR DE LA DETENCIÓN', valor: ficha.lugarDetencion || '—' },
    { label: 'NEXOS DELICTIVOS', valor: '' },
    { label: 'ZONA DE OPERACIÓN', valor: ficha.zonaOperacion || '—' },
    { label: 'PUESTA A DISPOSICIÓN', valor: ficha.puestaDisposicion || '—', fullWidth: true },
    { label: 'MODUS OPERANDI', valor: ficha.modusOperandi, fullWidth: true },
    { label: 'INFORMACIÓN ADICIONAL', valor: ficha.informacionAdicional || '—', fullWidth: true },
  ], 'EVENTO DELICTIVO')

  // ---- ANTECEDENTES (dos columnas) ----
  const lineasDelitos = ficha.antecedentesDelitos.length === 0
    ? ['—']
    : ficha.antecedentesDelitos.map(a => `${a.fecha ?? 's/f'} — ${a.descripcion}${a.lugar ? ' — ' + a.lugar : ''}${a.fuente === 'EXTERNO' ? ' (externo)' : ''}`)
  const lineasFaltas = ficha.antecedentesFaltas.length === 0
    ? ['—']
    : ficha.antecedentesFaltas.map(a => `${a.fecha ?? 's/f'} — ${a.descripcion}${a.lugar ? ' — ' + a.lugar : ''}${a.fuente === 'EXTERNO' ? ' (externo)' : ''}`)

  const antecedentesY = finEvento + 0.15
  slide.addText('ANTECEDENTES', { x: marginX, y: antecedentesY, w: contentW, h: 0.25, fontSize: 10, fontFace: 'Arial', bold: true, color: COLOR_PRIMARY, align: 'center' })
  slide.addTable(
    [
      [
        {
          text: lineasDelitos.join('\n'),
          options: { fontSize: 7, color: '1E293B', fill: { color: COLOR_HEADER_FILL }, valign: 'top', align: 'left' },
        },
        {
          text: lineasFaltas.join('\n'),
          options: { fontSize: 7, color: '1E293B', valign: 'top', align: 'left' },
        },
      ],
    ],
    {
      x: marginX,
      y: antecedentesY + 0.28,
      w: contentW,
      colW: [contentW / 2, contentW / 2],
      rowH: 1.1,
      border: { type: 'solid', pt: 0.5, color: COLOR_BORDER },
      margin: 2,
    },
  )

  slide.addText(`Generado por SSPM Agente Reportes · ${new Date().toLocaleString('es-MX')}`, { x: marginX, y: 9.55, w: contentW, h: 0.2, fontSize: 7, fontFace: 'Arial', color: COLOR_FAINT })
}

export async function generarPptAgrupado(): Promise<Buffer> {
  const todos = await listarDetenidosCompletos()
  if (todos.length === 0) throw new Error('No hay detenidos con las 3 fotos completadas')

  const rangos = calcularRangos(new Date())

  const pptx = new PptxGenJS()
  pptx.author = 'SSPM - Agente Reportes'
  pptx.title = 'Reporte de Detenidos'

  pptx.defineLayout({ name: 'FICHA_UDAI', width: 7.5, height: 10 })
  pptx.layout = 'FICHA_UDAI'

  let huboAlgunaSeccion = false
  for (const rango of rangos) {
    const enRango = todos.filter(d => {
      const t = new Date(d.createdAt).getTime()
      return t >= rango.inicio.getTime() && t < rango.fin.getTime()
    })
    if (enRango.length === 0) continue
    huboAlgunaSeccion = true
    addDividerSlide(pptx, rango.titulo, enRango.length)
    for (const d of enRango) {
      const ficha = await obtenerFichaCompleta(d.id)
      if (!ficha) continue // no debería pasar (d.id viene de listarDetenidosCompletos, que ya exige D1), pero no revientes el PPT completo por un dato inconsistente
      await addDetenidoSlide(pptx, d, ficha)
    }
  }

  if (!huboAlgunaSeccion) throw new Error('No hay detenidos con las 3 fotos completadas en el día, semana o mes actual')

  try { return Buffer.from(await pptx.write({ outputType: 'nodebuffer' }) as ArrayBuffer) }
  catch (err) { throw new Error(`Error generando PPT: ${err instanceof Error ? err.message : 'desconocido'}`) }
}

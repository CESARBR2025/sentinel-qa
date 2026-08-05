# Etapa 3 — Generador de PPT agrupado (diario/semanal/mensual)

## Contexto (resumen — ver `00-contexto.md`)

Requiere la Etapa 2 ya construida (`listarDetenidosCompletos()`). Esta etapa crea `lib/reporte-detenidos/ppt-service.ts`: genera **un solo `.pptx`** con 3 secciones — Diario (hoy), Semanal (semana actual, lunes a domingo) y Mensual (mes calendario actual) — cada una con una slide divisoria y luego una slide por detenido, reutilizando el layout visual que ya existe en `lib/monitorista/ppt-service.ts` (tabla de datos + hasta 3 fotos).

## Objetivo

Exportar `generarPptAgrupado(): Promise<Buffer>` que:
1. Llama `listarDetenidosCompletos()` una sola vez.
2. Calcula 3 rangos de fecha (día actual, semana actual, mes actual) sobre `createdAt`.
3. Por cada rango con al menos 1 detenido: agrega una slide divisoria (título de la sección + rango de fechas) y luego una slide por detenido.
4. Si un rango no tiene detenidos, se omite esa sección completa (no se agrega slide divisoria vacía).
5. Si NINGÚN rango tiene detenidos, lanza error (mismo comportamiento que el `ppt-service.ts` de Monitorista cuando no hay filas).

## Archivo a crear: `lib/reporte-detenidos/ppt-service.ts`

Reutiliza `pptxgenjs` y la descarga de imágenes vía `lib/expediente/v2/client.ts` (mismas librerías que `lib/monitorista/ppt-service.ts`). Las fotos se buscan por `reporte_campo_id` en `evidencias_detenido`, igual que en Monitorista.

```ts
import { query } from '@/lib/db'
import PptxGenJS from 'pptxgenjs'
import { esRefV2, parsearRef } from '@/lib/expediente/v2/ref'
import { descargar as descargarV2 } from '@/lib/expediente/v2/client'
import { listarDetenidosCompletos } from './repository'
import type { DetenidoCompleto } from './types'

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
  slide.addText('Reporte de Detenidos', { x: 0.6, y: 1.8, w: 9, h: 0.6, fontSize: 32, fontFace: 'Arial', bold: true, color: '1E40AF', align: 'center' })
  slide.addText(titulo, { x: 0.6, y: 2.5, w: 9, h: 0.4, fontSize: 18, fontFace: 'Arial', color: '334155', align: 'center' })
  slide.addText(`${cantidad} detenido${cantidad !== 1 ? 's' : ''}`, { x: 0.6, y: 3.0, w: 9, h: 0.3, fontSize: 12, fontFace: 'Arial', color: '64748B', align: 'center' })
}

async function addDetenidoSlide(pptx: PptxGenJS, d: DetenidoCompleto) {
  const slide = pptx.addSlide()

  const evs = await query<Record<string, unknown>>(
    `SELECT url_archivo, tipo_foto FROM (
       SELECT url_archivo, tipo_foto, ROW_NUMBER() OVER (PARTITION BY tipo_foto ORDER BY creado_en DESC) as rn
       FROM evidencias_detenido
       WHERE reporte_campo_id = $1
     ) sub WHERE rn = 1
     ORDER BY tipo_foto`, [d.id],
  )
  const buffers = await Promise.all(evs.rows.map(e => descargarFoto(String(e.url_archivo))))
  const valids = buffers.filter((f): f is { base64: string; mime: string } => f !== null)
  const imgCount = Math.min(valids.length, 3)

  const marginX = 0.6
  const contentW = 9

  slide.addText('Reporte de Detenido', { x: marginX, y: 0.15, w: contentW, h: 0.35, fontSize: 22, fontFace: 'Arial', bold: true, color: '1E40AF' })
  slide.addText(`SSPM San Juan del Río · ${new Date().toLocaleString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' })}`, { x: marginX, y: 0.5, w: contentW, h: 0.2, fontSize: 10, fontFace: 'Arial', color: '64748B' })
  slide.addShape('line', { x: marginX, y: 0.75, w: contentW, h: 0 })

  const tablaY = 0.9
  const rowH = 0.3
  const fs = 9

  const datos = [
    [{ text: 'Nombre del Detenido', options: { fontSize: fs, bold: true, color: '1E40AF', fill: { color: 'F1F5F9' } } }, { text: d.nombre, options: { fontSize: fs, color: '1E293B' } }],
    [{ text: 'Folio', options: { fontSize: fs, bold: true, color: '1E40AF', fill: { color: 'F1F5F9' } } }, { text: d.folio || '—', options: { fontSize: fs, color: '1E293B' } }],
    [{ text: 'Evento o Incidente', options: { fontSize: fs, bold: true, color: '1E40AF', fill: { color: 'F1F5F9' } } }, { text: d.evento, options: { fontSize: fs, color: '1E293B' } }],
    [{ text: 'Delitos', options: { fontSize: fs, bold: true, color: '1E40AF', fill: { color: 'F1F5F9' } } }, { text: d.delito, options: { fontSize: fs, color: '1E293B' } }],
    [{ text: 'Falta Administrativa', options: { fontSize: fs, bold: true, color: '1E40AF', fill: { color: 'F1F5F9' } } }, { text: d.faltaAdministrativa, options: { fontSize: fs, color: '1E293B' } }],
    [{ text: 'Modus Operandi', options: { fontSize: fs, bold: true, color: '1E40AF', fill: { color: 'F1F5F9' } } }, { text: d.modusOperandi, options: { fontSize: fs, color: '1E293B' } }],
  ]

  slide.addTable(datos, { x: marginX, y: tablaY, w: contentW, colW: [2.4, contentW - 2.4], rowH, border: { type: 'solid', pt: 0.5, color: 'E2E8F0' } })

  const finTabla = tablaY + datos.length * rowH
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
      try { slide.addImage({ data: `data:${valids[i].mime};base64,${valids[i].base64}`, x: imgStartX + xOff, y: imgY, w: anchos[i], h: imgH }) } catch { /* skip */ }
      xOff += anchos[i] + imgGap
    }
    const etiquetas: Record<number, string> = { 0: 'Frontal', 1: 'Derecho', 2: 'Izquierdo' }
    xOff = 0
    for (let i = 0; i < imgCount; i++) {
      slide.addText(etiquetas[i] || '', { x: imgStartX + xOff, y: imgY + imgH + 0.02, w: anchos[i], h: 0.16, fontSize: 7, fontFace: 'Arial', color: '64748B', align: 'center' })
      xOff += anchos[i] + imgGap
    }
  }

  const footerY = imgCount > 0 ? finTabla + 0.15 + imgH + 0.22 + 0.1 : finTabla + 0.15
  slide.addText(`Generado por SSPM Agente Reportes · ${new Date().toLocaleString('es-MX')}`, { x: marginX, y: footerY, w: contentW, h: 0.2, fontSize: 8, fontFace: 'Arial', color: '94A3B8' })
}

export async function generarPptAgrupado(): Promise<Buffer> {
  const todos = await listarDetenidosCompletos()
  if (todos.length === 0) throw new Error('No hay detenidos con las 3 fotos completadas')

  const rangos = calcularRangos(new Date())

  const pptx = new PptxGenJS()
  pptx.author = 'SSPM - Agente Reportes'
  pptx.title = 'Reporte de Detenidos'

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
      await addDetenidoSlide(pptx, d)
    }
  }

  if (!huboAlgunaSeccion) throw new Error('No hay detenidos con las 3 fotos completadas en el día, semana o mes actual')

  try { return Buffer.from(await pptx.write({ outputType: 'nodebuffer' }) as ArrayBuffer) }
  catch (err) { throw new Error(`Error generando PPT: ${err instanceof Error ? err.message : 'desconocido'}`) }
}
```

Nota: un mismo detenido puede aparecer en más de una sección (ej. si su `created_at` es de hoy, aparece en Diario, Semanal y Mensual) — es el comportamiento esperado de un reporte diario/semanal/mensual acumulativo, no un bug.

## Qué NO tocar en esta etapa

- No tocar `lib/monitorista/ppt-service.ts` todavía (se elimina en la Etapa 7, no antes).
- No crear la API todavía (Etapa 4).

## Criterios de aceptación

1. `npx tsc --noEmit` pasa sin errores nuevos.
2. Llamar `generarPptAgrupado()` directamente (script puntual) con datos reales de la BD de desarrollo produce un `.pptx` válido que abre en PowerPoint/Google Slides.
3. El archivo tiene como máximo 3 slides divisorias (una por sección con datos), en el orden Diario → Semanal → Mensual.
4. Si no hay ningún detenido completo en ninguno de los 3 rangos, lanza el error `'No hay detenidos con las 3 fotos completadas en el día, semana o mes actual'` en vez de generar un archivo vacío.

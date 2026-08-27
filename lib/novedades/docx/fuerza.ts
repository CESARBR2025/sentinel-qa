import { AlignmentType, Paragraph, Table, WidthType } from 'docx'
import { r, p, hRow, dRow, toN, lineaFirma, tc, tr } from '@/lib/reportes/docx-helpers'
import type { FuerzaNovedades } from '../types'

// Paso 11 — Estado de fuerza (T32) + firmas.

export function fuerza(datos: FuerzaNovedades): (Paragraph | Table)[] {
  const conceptos = datos.conceptos ?? []

  const w = [6000, 3360]
  const filas = conceptos.map(c => dRow([c.concepto, toN(c.cantidad)], w))

  // Tabla de firmas de dos columnas (Elaboró / Jefe C4).
  const tablaFirmas = new Table({
    width: { size: 9360, type: WidthType.DXA },
    rows: [tr([
      tc([
        lineaFirma(),
        p(r('Elaboró'), { align: AlignmentType.CENTER, after: 0 }),
      ], { width: 4680, noBorder: true }),
      tc([
        lineaFirma(),
        p(r('Jefe C4'), { align: AlignmentType.CENTER, after: 0 }),
      ], { width: 4680, noBorder: true }),
    ])],
  })

  return [
    p(r('T32. ESTADO DE FUERZA', { bold: true, size: 18 }), { align: AlignmentType.LEFT, after: 40 }),
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      rows: [
        hRow(['CONCEPTO', 'CANTIDAD'], w, true),
        ...filas,
      ],
    }),
    p(r(''), { after: 200 }),
    tablaFirmas,
    p(r(''), { after: 80 }),
    p(r('R E S P E T U O S A M E N T E', { bold: true, size: 16 }), { align: AlignmentType.CENTER, after: 0 }),
    p(r('"TRADICIÓN Y PROGRESO"', { bold: true, size: 16 }), { align: AlignmentType.CENTER, after: 40 }),
  ]
}

import { AlignmentType, Paragraph, Table, WidthType } from 'docx'
import { r, p, hRow, dRow, toN } from '@/lib/reportes/docx-helpers'
import type { ResumenNovedades } from '../types'

// Paso 2 — Resumen general (T0, T1, T2).

export function resumen(datos: ResumenNovedades): (Paragraph | Table)[] {
  const aseguramientos = datos.aseguramientos ?? []
  const infracciones = datos.infracciones ?? []
  const corralon = datos.corralon ?? []

  // Desviación deliberada (decisión del usuario): las tablas de sector pasan de
  // ORIENTE | PONIENTE | TOTALES a ORIENTE | PONIENTE | CENTRO | TOTALES. Ver
  // README "Decisiones" y Etapa 0.3. Los anchos se reparten sobre el total 9360.
  const wSector = [4800, 1140, 1140, 1140, 1140]
  const filasAseguramiento = aseguramientos.map(f => dRow([
    f.concepto,
    toN(f.oriente),
    toN(f.poniente),
    toN(f.centro),
    toN(f.total),
  ], wSector))

  const filasInfraccion = infracciones.map(f => dRow([f.columna, toN(f.cantidad)], [7680, 1680]))
  const filasCorralon = corralon.map(f => dRow([f.columna, toN(f.cantidad)], [7680, 1680]))

  return [
    p(r('T0. ASEGURAMIENTOS', { bold: true, size: 18 }), { align: AlignmentType.LEFT, after: 40 }),
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      rows: [
        hRow(['CONCEPTO', 'ORIENTE', 'PONIENTE', 'CENTRO', 'TOTALES'], wSector, true),
        ...filasAseguramiento,
      ],
    }),
    p(r(''), { after: 60 }),
    p(r('T1. INFRACCIONES', { bold: true, size: 18 }), { align: AlignmentType.LEFT, after: 40 }),
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      rows: [
        hRow(['COLUMNA OPERATIVA', 'TOTAL'], [7680, 1680], true),
        ...filasInfraccion,
      ],
    }),
    p(r(''), { after: 60 }),
    p(r('T2. VEHÍCULOS A CORRALÓN POR INFRACCIÓN Y HECHOS DE TRÁNSITO', { bold: true, size: 18 }), { align: AlignmentType.LEFT, after: 40 }),
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      rows: [
        hRow(['COLUMNA OPERATIVA', 'TOTAL'], [7680, 1680], true),
        ...filasCorralon,
      ],
    }),
  ]
}

import { AlignmentType, Paragraph, Table, WidthType } from 'docx'
import { r, p, hRow, dRow, toN } from '@/lib/reportes/docx-helpers'
import type { AnalisisNovedades } from '../types'

// Paso 4 — Unidad de Análisis (T5).

// Desviación deliberada: el .docx original imprime "DE 05:00 A 05:00 HORAS";
// por la decisión de ventana única de todo el parte se imprime 06:00 a 06:00
// (README / Etapa 3). Comentado para que no se lea como error.
export function analisis(datos: AnalisisNovedades): (Paragraph | Table)[] {
  const campos: [string, string][] = [
    ['Consultas realizadas en Plataforma México — Total de personas', 'consultas_personas'],
    ['Órdenes de Aprehensión vigentes', 'ordenes_aprehension'],
    ['Consultas realizadas en Plataforma México — Total de vehículos', 'consultas_vehiculos'],
    ['Vehículos con reporte de robo', 'vehiculos_reporte_robo'],
    ['Detenidos a Cárcel Municipal — Total de personas', 'detenidos_carcel'],
    ['Detenidos a FGE/FGR', 'detenidos_fiscalia'],
  ]

  const w = [7300, 2060]
  const valor = (key: string): number => (datos as unknown as Record<string, number>)[key] ?? 0
  return [
    p(r('PLATAFORMA MÉXICO', { bold: true, size: 18 }), { align: AlignmentType.LEFT, after: 40 }),
    p(r('DE 06:00 A 06:00 HORAS', { bold: true, size: 16 }), { align: AlignmentType.CENTER, after: 40 }),
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      rows: [
        hRow(['CONCEPTO', 'CANTIDAD'], w, true),
        ...campos.map(([label, key]) => dRow([label, toN(valor(key))], w)),
      ],
    }),
  ]
}

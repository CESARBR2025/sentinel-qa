import { AlignmentType, Paragraph, Table, WidthType } from 'docx'
import { r, p, hRow, dRow, toN, tablaSinNovedad } from '@/lib/reportes/docx-helpers'
import type { FilaNovedad, TransitoNovedades } from '../types'

// Paso 6 — Dirección de Tránsito (T7 a T13).

export function transito(
  datos: TransitoNovedades,
  filas: Record<string, FilaNovedad[]>,
): (Paragraph | Table)[] {
  const matriz = datos.matriz ?? []
  const hechos = filas['transito.hechos'] ?? []
  const corralon = filas['transito.corralon'] ?? []
  const notificados = filas['transito.notificados'] ?? []
  const despejes = filas['transito.despejes'] ?? []

  // T7 — Matriz de 19 conceptos × ORIENTE | PONIENTE | CENTRO | TOTALES.
  // Desviación deliberada: CENTRO es la tercera columna de sector (decisión del
  // usuario). Anchos repartidos sobre el total de 9360. Primera columna ancha
  // por las etiquetas largas (ej. "Vehículos puestos a disposición del Juzgado
  // Cívico") — verificar el salto de línea en Word.
  const wMatriz = [5400, 990, 990, 990, 990]
  const filasMatriz = matriz.map(f => dRow([
    f.concepto,
    toN(f.oriente),
    toN(f.poniente),
    toN(f.centro),
    toN(f.total),
  ], wMatriz))

  // T8 — Hechos de tránsito, detalle.
  const wHechos = [2600, 900, 2000, 2260, 1600]
  const filasHechos = hechos.map(f => dRow([
    String(f.datos.hecho ?? '—'),
    String(f.datos.hora ?? '—'),
    String(f.datos.lugar ?? '—'),
    String(f.datos.vehiculo ?? '—'),
    String(f.datos.conductor ?? '—'),
  ], wHechos))

  // T9 — Vehículos a corralón por infracción.
  const wCorr = [500, 2000, 900, 1200, 2160, 1600, 1000]
  const filasCorr = corralon.map((f, i) => dRow([
    String(i + 1),
    String(f.datos.folio_motivo ?? '—'),
    String(f.datos.hora ?? '—'),
    String(f.datos.fecha ?? '—'),
    String(f.datos.lugar ?? '—'),
    String(f.datos.vehiculo ?? '—'),
    String(f.datos.grua ?? '—'),
  ], wCorr))

  // T10 — Vehículos notificados (sin fuente — captura manual).
  const wNot = [2000, 1200, 2000, 2360, 1800]
  const filasNot = notificados.map(f => dRow([
    String(f.datos.folio ?? '—'),
    String(f.datos.hora ?? '—'),
    String(f.datos.lugar ?? '—'),
    String(f.datos.vehiculo ?? '—'),
    String(f.datos.motivo ?? '—'),
  ], wNot))

  // T11 — Operativos y despejes (sin fuente — captura manual).
  const wDesp = [1400, 2000, 2000, 3960]
  const filasDesp = despejes.map(f => dRow([
    String(f.datos.hora ?? '—'),
    String(f.datos.lugar ?? '—'),
    String(f.datos.operativo ?? '—'),
    String(f.datos.descripcion ?? '—'),
  ], wDesp))

  return [
    p(r('T7. HECHOS DE TRÁNSITO POR SECTOR', { bold: true, size: 18 }), { align: AlignmentType.LEFT, after: 40 }),
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      rows: [
        hRow(['CONCEPTO', 'ORIENTE', 'PONIENTE', 'CENTRO', 'TOTALES'], wMatriz, true),
        ...filasMatriz,
      ],
    }),
    p(r(''), { after: 60 }),
    p(r('T8. HECHOS DE TRÁNSITO (DETALLE)', { bold: true, size: 18 }), { align: AlignmentType.LEFT, after: 40 }),
    hechos.length > 0
      ? new Table({ width: { size: 9360, type: WidthType.DXA }, rows: [hRow(['HECHOS', 'HORA', 'LUGAR', 'VEHÍCULO', 'CONDUCTOR(ES)'], wHechos, true), ...filasHechos] })
      : tablaSinNovedad(['HECHOS', 'HORA', 'LUGAR', 'VEHÍCULO', 'CONDUCTOR(ES)'], wHechos),
    p(r(''), { after: 60 }),
    p(r('T9. VEHÍCULOS A CORRALÓN POR INFRACCIÓN', { bold: true, size: 18 }), { align: AlignmentType.LEFT, after: 40 }),
    corralon.length > 0
      ? new Table({ width: { size: 9360, type: WidthType.DXA }, rows: [hRow(['N°', 'FOLIO/MOTIVO', 'HORA', 'FECHA', 'LUGAR', 'VEHÍCULO', 'GRÚA'], wCorr, true), ...filasCorr] })
      : tablaSinNovedad(['N°', 'FOLIO/MOTIVO', 'HORA', 'FECHA', 'LUGAR', 'VEHÍCULO', 'GRÚA'], wCorr),
    p(r(''), { after: 60 }),
    p(r('T10. VEHÍCULOS NOTIFICADOS', { bold: true, size: 18 }), { align: AlignmentType.LEFT, after: 40 }),
    notificados.length > 0
      ? new Table({ width: { size: 9360, type: WidthType.DXA }, rows: [hRow(['FOLIO', 'HORA', 'LUGAR', 'VEHÍCULO', 'MOTIVO'], wNot, true), ...filasNot] })
      : tablaSinNovedad(['FOLIO', 'HORA', 'LUGAR', 'VEHÍCULO', 'MOTIVO'], wNot),
    p(r(''), { after: 60 }),
    p(r('T11. OPERATIVOS Y DESPEJES', { bold: true, size: 18 }), { align: AlignmentType.LEFT, after: 40 }),
    despejes.length > 0
      ? new Table({ width: { size: 9360, type: WidthType.DXA }, rows: [hRow(['HORA', 'LUGAR', 'OPERATIVO', 'DESCRIPCIÓN'], wDesp, true), ...filasDesp] })
      : tablaSinNovedad(['HORA', 'LUGAR', 'OPERATIVO', 'DESCRIPCIÓN'], wDesp),
    p(r(''), { after: 60 }),
    p(r('OBSERVACIONES DE TRÁNSITO', { bold: true, size: 18 }), { align: AlignmentType.LEFT, after: 40 }),
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      rows: [hRow(['OBSERVACIONES', ''], [9360, 0], true), dRow([String(datos.observaciones ?? 'SIN NOVEDAD'), ''], [9360, 0])],
    }),
  ]
}

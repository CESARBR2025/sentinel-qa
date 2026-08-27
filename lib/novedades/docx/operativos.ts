import { AlignmentType, Paragraph, Table, WidthType } from 'docx'
import { r, p, hRow, dRow, toN } from '@/lib/reportes/docx-helpers'
import type { OperativosNovedades } from '../types'

// Paso 9 — Supervisión y Operativos (T29, T30).

export function operativos(datos: OperativosNovedades): (Paragraph | Table)[] {
  const supervision = datos.supervision ?? []
  const operativos = datos.operativos ?? []

  // T29 — Supervisión general: 10 operativos × 11 columnas.
  const wSup = [3000, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600]
  const colsSup = ['TOTAL UNIDADES', 'TOTAL ELEMENTOS', 'VEH. REVISADOS', 'VEH. PD', 'PERSONAS REVISADAS', 'REMITIDAS JUZGADO', 'A FGE', 'A FGR', 'REVISIONES', 'INICIO', 'TÉRMINO']
  const filasSup = supervision.map(f => dRow([
    f.operativo,
    toN(f.total_unidades), toN(f.total_elementos), toN(f.vehiculos_revisados), toN(f.vehiculos_pd),
    toN(f.personas_revisadas), toN(f.remitidas_juzgado), toN(f.a_fge), toN(f.a_fgr), toN(f.revisiones),
    String(f.inicio ?? ''), String(f.termino ?? ''),
  ], wSup))

  // T30 — Operativos: 5 operativos × 12 columnas.
  const wOpe = [3000, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 360]
  const colsOpe = ['UNIDADES', 'ELEMENTOS', 'PD JUZGADO', 'PD FGE', 'PD FGR', 'INICIO', 'TÉRMINO', 'AFLUENCIA']
  const filasOpe = operativos.map(f => dRow([
    f.operativo,
    toN(f.unidades), toN(f.elementos), toN(f.pd_juzgado), toN(f.pd_fge), toN(f.pd_fgr),
    String(f.inicio ?? ''), String(f.termino ?? ''), String(f.afluencia ?? ''),
  ], [3000, 600, 600, 600, 600, 600, 600, 600]))

  return [
    p(r('T29. SUPERVISIÓN GENERAL', { bold: true, size: 18 }), { align: AlignmentType.LEFT, after: 40 }),
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      rows: [hRow(['OPERATIVO', ...colsSup], wSup, true), ...filasSup],
    }),
    p(r(''), { after: 60 }),
    p(r('T30. OPERATIVOS', { bold: true, size: 18 }), { align: AlignmentType.LEFT, after: 40 }),
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      rows: [hRow(['OPERATIVO', ...colsOpe], wOpe, true), ...filasOpe],
    }),
  ]
}

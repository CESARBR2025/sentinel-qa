import { AlignmentType, Paragraph, Table, WidthType } from 'docx'
import { r, p, hRow, dRow, tablaSinNovedad } from '@/lib/reportes/docx-helpers'
import type { SubsecretariaNovedades } from '../types'

// Paso 3 — Subsecretaría (T3, T4).

export function subsecretaria(datos: SubsecretariaNovedades): (Paragraph | Table)[] {
  const pd = datos.pd_fiscalia ?? []
  const jc = datos.juzgado_civico ?? []

  // Columnas del documento: la primera es N° (se numera al imprimir).
  const wPd = [400, 1200, 1800, 2200, 1600, 1600, 480, 480]
  const filasPd = pd.map((f, i) => dRow([
    String(i + 1),
    String(f.hora ?? '—'),
    String(f.lugar ?? '—'),
    String(f.nombre ?? '—'),
    String(f.fiscal ?? '—'),
    String(f.motivo ?? '—'),
    String(f.ci ?? '—'),
    String(f.rnd ?? '—'),
  ], wPd))

  const wJc = [400, 1000, 1400, 1800, 1500, 1200, 900, 400, 500, 300, 360]
  const filasJc = jc.map((f, i) => dRow([
    String(i + 1),
    String(f.hora ?? '—'),
    String(f.lugar ?? '—'),
    String(f.nombre ?? '—'),
    String(f.marco_legal ?? '—'),
    String(f.oficial ?? '—'),
    String(f.unidad ?? '—'),
    String(f.sija ?? '—'),
    String(f.remision ?? '—'),
    String(f.iph ?? '—'),
    String(f.rnd ?? '—'),
  ], wJc))

  return [
    p(r('T3. PERSONAS PUESTAS A DISPOSICIÓN DE LA FISCALÍA', { bold: true, size: 18 }), { align: AlignmentType.LEFT, after: 40 }),
    pd.length > 0
      ? new Table({ width: { size: 9360, type: WidthType.DXA }, rows: [hRow(['N°', 'HORA', 'LUGAR DEL ASEGURAMIENTO', 'NOMBRE', 'FISCAL', 'MOTIVO', 'CI', 'RND'], wPd, true), ...filasPd] })
      : tablaSinNovedad(['N°', 'HORA', 'LUGAR DEL ASEGURAMIENTO', 'NOMBRE', 'FISCAL', 'MOTIVO', 'CI', 'RND'], wPd),
    p(r(''), { after: 60 }),
    p(r('T4. PERSONAS REMITIDAS AL JUZGADO CÍVICO POR FALTAS ADMINISTRATIVAS', { bold: true, size: 18 }), { align: AlignmentType.LEFT, after: 40 }),
    jc.length > 0
      ? new Table({ width: { size: 9360, type: WidthType.DXA }, rows: [hRow(['N°', 'HORA', 'LUGAR', 'NOMBRE', 'MARCO LEGAL', 'OFICIAL', 'UNIDAD', 'SIJA', 'REMISIÓN', 'IPH', 'RND'], wJc, true), ...filasJc] })
      : tablaSinNovedad(['N°', 'HORA', 'LUGAR', 'NOMBRE', 'MARCO LEGAL', 'OFICIAL', 'UNIDAD', 'SIJA', 'REMISIÓN', 'IPH', 'RND'], wJc),
  ]
}

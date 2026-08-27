import { AlignmentType, Paragraph, Table, WidthType } from 'docx'
import { r, p, hRow, dRow, toN, tablaSinNovedad } from '@/lib/reportes/docx-helpers'
import type { FilaNovedad, PrevencionNovedades } from '../types'

// Paso 7 — Prevención del Delito (T14 a T24).

export function prevencion(
  datos: PrevencionNovedades,
  filas: Record<string, FilaNovedad[]>,
): (Paragraph | Table)[] {
  const atencion = datos.atencion_victimas ?? {}
  const persona = datos.persona_no_localizada
  const convenios = filas['prevencion.convenios'] ?? []
  const segConvenios = filas['prevencion.seg_convenios'] ?? []
  const platicas = filas['prevencion.platicas'] ?? []
  const jornadas = filas['prevencion.jornadas_trabajo'] ?? []
  const jornadasStand = filas['prevencion.jornadas_stand'] ?? []

  const contadores: [string, string][] = [
    ['Medidas de protección realizadas', 'medidas_realizadas'],
    ['Constancias domiciliarias (primera visita)', 'constancias_domiciliarias'],
    ['Incumplimientos de medidas', 'incumplimientos_medidas'],
    ['BAESVIM', 'baesvim'],
    ['Persona no localizada', 'persona_no_localizada'],
    ['Seguimiento de BAESVIM', 'seguimiento_baesvim'],
    ['Seguimiento de persona no localizada (ya localizada)', 'seguimiento_no_localizada'],
    ['Personas a disposición de Fiscalía', 'personas_disposicion_fiscalia'],
    ['Personas a disposición de Juzgado Cívico', 'personas_disposicion_juzgado'],
  ]
  const wAv = [7300, 2060]

  // T15 — Reporte de persona no localizada.
  const wPnl = [1100, 900, 1400, 1300, 1300, 1100, 900, 1260]

  // T20 — Convenios.
  const wConv = [1100, 1400, 1800, 1300, 1000, 2760]
  const filasConv = convenios.map(f => dRow([
    String(f.datos.fecha ?? '—'),
    String(f.datos.lugar ?? '—'),
    String(f.datos.involucrados ?? '—'),
    String(f.datos.policia ?? '—'),
    String(f.datos.unidad ?? '—'),
    String(f.datos.convenio ?? '—'),
  ], wConv))

  // T22 — Pláticas de vinculación.
  const wPlat = [1100, 1100, 1300, 1300, 1300, 1100, 1160]
  const filasPlat = platicas.map(f => dRow([
    String(f.datos.fecha ?? '—'),
    String(f.datos.platicas ?? '—'),
    String(f.datos.tema ?? '—'),
    String(f.datos.lugar ?? '—'),
    String(f.datos.elemento ?? '—'),
    String(f.datos.aforo ?? '—'),
    String(f.datos.unidad ?? '—'),
  ], wPlat))

  // T23 — Jornadas de trabajo a favor de la comunidad.
  const wJorn = [1100, 900, 1400, 1400, 1100, 3460]
  const filasJorn = jornadas.map(f => dRow([
    String(f.datos.fecha ?? '—'),
    String(f.datos.hora ?? '—'),
    String(f.datos.lugar ?? '—'),
    String(f.datos.elemento ?? '—'),
    String(f.datos.unidad ?? '—'),
    String(f.datos.complementarios ?? '—'),
  ], wJorn))

  // T21 — Seguimiento de convenios.
  const wSegConv = [1100, 1400, 1800, 1600, 1000, 2460]
  const filasSegConv = segConvenios.map(f => dRow([
    String(f.datos.fecha ?? '—'),
    String(f.datos.lugar ?? '—'),
    String(f.datos.involucrados ?? '—'),
    String(f.datos.elemento ?? '—'),
    String(f.datos.unidad ?? '—'),
    String(f.datos.convenio ?? '—'),
  ], wSegConv))

  // T24 — Jornadas con stand.
  const wStand = [1100, 900, 1600, 1600, 1300, 2860]
  const filasStand = jornadasStand.map(f => dRow([
    String(f.datos.fecha ?? '—'),
    String(f.datos.hora ?? '—'),
    String(f.datos.lugar ?? '—'),
    String(f.datos.elemento ?? '—'),
    String(f.datos.aforo ?? '—'),
    String(f.datos.unidad ?? '—'),
  ], wStand))

  return [
    p(r('T14. ATENCIÓN A VÍCTIMAS', { bold: true, size: 18 }), { align: AlignmentType.LEFT, after: 40 }),
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      rows: [
        hRow(['CONCEPTO', 'CANTIDAD'], wAv, true),
        ...contadores.map(([label, key]) => dRow([label, toN(atencion[key])], wAv)),
      ],
    }),
    p(r(''), { after: 60 }),
    p(r('T15. REPORTE DE PERSONA NO LOCALIZADA', { bold: true, size: 18 }), { align: AlignmentType.LEFT, after: 40 }),
    persona
      ? new Table({ width: { size: 9360, type: WidthType.DXA }, rows: [
          hRow(['FECHA', 'HORA', 'LUGAR', 'CARPETA', 'DELITO', 'POLICIA', 'UNIDAD', 'OBSERVACIONES'], wPnl, true),
          dRow([String(persona.fecha ?? '—'), String(persona.hora ?? '—'), String(persona.lugar ?? '—'), String(persona.carpeta ?? '—'), String(persona.delito ?? '—'), String(persona.policia ?? '—'), String(persona.unidad ?? '—'), String(persona.observaciones ?? '—')], wPnl),
        ] })
      : tablaSinNovedad(['FECHA', 'HORA', 'LUGAR', 'CARPETA', 'DELITO', 'POLICIA', 'UNIDAD', 'OBSERVACIONES'], wPnl),
    p(r(''), { after: 60 }),
    p(r('T20. CONVENIOS DE MEDIACIÓN', { bold: true, size: 18 }), { align: AlignmentType.LEFT, after: 40 }),
    convenios.length > 0
      ? new Table({ width: { size: 9360, type: WidthType.DXA }, rows: [hRow(['FECHA', 'LUGAR', 'INVOLUCRADOS', 'POLICIA', 'UNIDAD', 'CONVENIO'], wConv, true), ...filasConv] })
      : tablaSinNovedad(['FECHA', 'LUGAR', 'INVOLUCRADOS', 'POLICIA', 'UNIDAD', 'CONVENIO'], wConv),
    p(r(''), { after: 60 }),
    p(r('T21. SEGUIMIENTO DE CONVENIOS DE MEDIACIÓN', { bold: true, size: 18 }), { align: AlignmentType.LEFT, after: 40 }),
    segConvenios.length > 0
      ? new Table({ width: { size: 9360, type: WidthType.DXA }, rows: [hRow(['FECHA', 'LUGAR', 'INVOLUCRADOS', 'ELEMENTO/ADMIN', 'UNIDAD', 'CONVENIO'], wSegConv, true), ...filasSegConv] })
      : tablaSinNovedad(['FECHA', 'LUGAR', 'INVOLUCRADOS', 'ELEMENTO/ADMIN', 'UNIDAD', 'CONVENIO'], wSegConv),
    p(r(''), { after: 60 }),
    p(r('T22. PLÁTICAS DE VINCULACIÓN CIUDADANA', { bold: true, size: 18 }), { align: AlignmentType.LEFT, after: 40 }),
    platicas.length > 0
      ? new Table({ width: { size: 9360, type: WidthType.DXA }, rows: [hRow(['FECHA', 'PLÁTICAS', 'TEMA', 'LUGAR', 'ELEMENTO', 'AFORO', 'UNIDAD'], wPlat, true), ...filasPlat] })
      : tablaSinNovedad(['FECHA', 'PLÁTICAS', 'TEMA', 'LUGAR', 'ELEMENTO', 'AFORO', 'UNIDAD'], wPlat),
    p(r(''), { after: 60 }),
    p(r('T23. JORNADAS DE TRABAJO A FAVOR DE LA COMUNIDAD', { bold: true, size: 18 }), { align: AlignmentType.LEFT, after: 40 }),
    jornadas.length > 0
      ? new Table({ width: { size: 9360, type: WidthType.DXA }, rows: [hRow(['FECHA', 'HORA', 'LUGAR', 'ELEMENTO', 'UNIDAD', 'COMPLEMENTARIOS'], wJorn, true), ...filasJorn] })
      : tablaSinNovedad(['FECHA', 'HORA', 'LUGAR', 'ELEMENTO', 'UNIDAD', 'COMPLEMENTARIOS'], wJorn),
    p(r(''), { after: 60 }),
    p(r('T24. JORNADAS CON STAND', { bold: true, size: 18 }), { align: AlignmentType.LEFT, after: 40 }),
    jornadasStand.length > 0
      ? new Table({ width: { size: 9360, type: WidthType.DXA }, rows: [hRow(['FECHA', 'HORA', 'LUGAR', 'ELEMENTO', 'AFORO', 'UNIDAD'], wStand, true), ...filasStand] })
      : tablaSinNovedad(['FECHA', 'HORA', 'LUGAR', 'ELEMENTO', 'AFORO', 'UNIDAD'], wStand),
  ]
}

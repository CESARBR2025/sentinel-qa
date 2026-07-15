import type { ReporteD1 } from './types'

function toStr(val: unknown): string | null {
  if (val === null || val === undefined) return null
  if (val instanceof Date) return val.toISOString()
  return String(val)
}

function toNum(val: unknown): number {
  if (val === null || val === undefined) return 0
  const n = Number(val)
  return isNaN(n) ? 0 : n
}

function toBool(val: unknown): boolean {
  if (typeof val === 'boolean') return val
  if (typeof val === 'string') return val === 'true' || val === '1'
  return Boolean(val)
}

export function rowToReporteD1(row: Record<string, unknown>): ReporteD1 {
  return {
    id: String(row.id ?? ''),
    folioDenuncia: toStr(row.folio_denuncia),
    iph: toStr(row.iph),
    folioCu: toStr(row.folio_cu),
    folioSija: toStr(row.folio_sija),
    delito: toStr(row.delito),
    tipoEvento: toStr(row.tipo_evento),
    violencia: toBool(row.violencia),
    fechaReporte: toStr(row.fecha_reporte),
    horaReporte: toStr(row.hora_reporte),
    lugarHecho: toStr(row.lugar_hecho),
    coloniaHecho: toStr(row.colonia_hecho),
    municipio: toStr(row.municipio),
    policiaACargo: toStr(row.policia_a_cargo),
    crp: toStr(row.crp),
    nominaMando: toStr(row.nomina_mando),
    seGeneroD1: toBool(row.se_genero_d1),
    estadoTramite: toStr(row.estado_tramite),
    estadoEvidencia: toStr(row.estado_evidencia),
    ofendidoHombre: toNum(row.ofendido_hombre),
    ofendidoMujer: toNum(row.ofendido_mujer),
    tipoIncidente: toStr(row.ofi_tipo_incidente),
    oficialNombre: toStr(row.ofi_oficial_nombre),
    folioCad: toStr(row.ofi_folio_cad),
  }
}

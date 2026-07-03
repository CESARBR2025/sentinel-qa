import type { LiberacionRow, CapturaInfractorInput } from './types'

function str(val: unknown): string | null {
  if (val === null || val === undefined) return null
  return String(val)
}

export function rowToLiberacion(row: Record<string, unknown>): LiberacionRow {
  return {
    id:                       str(row.id) ?? '',
    folio:                    str(row.folio) ?? '',
    estatusInfraccion:        str(row.estatus) ?? '',
    placa:                    str(row.placa) ?? '',
    created_at:               str(row.created_at) ?? '',
    correo_infractor:         str(row.correo_infractor) ?? '',
    nombre_infractor:         str(row.nombre_infractor) ?? '',
    estatusDependencia:       str(row.estatus_dependencia) ?? '',
    no_carpeta_investigacion: str(row.no_carpeta_investigacion) ?? '',
    url_orden_salida_liberaciones: str(row.url_orden_salida_liberaciones) ?? undefined,
  }
}

function nvl(v: string): string | null {
  const t = v.trim()
  return t || t.length === 0 ? t.toUpperCase() || null : null
}

export function inputToDbParams(input: CapturaInfractorInput) {
  return {
    es_titular: input.es_titular,
    curp_infractor: nvl(input.curp_infractor),
    nombre_infractor: nvl(input.nombre_infractor),
    apellido_paterno_infractor: nvl(input.appaterno_infractor),
    apellido_materno_infractor: nvl(input.apmaterno_infractor),
    correo_infractor: input.correo_infractor.trim() || null,
    nombre_titular_liberacion: nvl(input.nombre_titular),
    appaterno_titular_liberacion: nvl(input.appaterno_titular),
    apmaterno_titular_liberacion: nvl(input.apmaterno_titular),
    curp_titular_liberacion: nvl(input.curp_titular),
    correo_titular_liberacion: input.correo_titular.trim() || null,
  }
}

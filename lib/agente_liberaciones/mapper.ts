import type { LiberacionRow } from './types'

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
  }
}

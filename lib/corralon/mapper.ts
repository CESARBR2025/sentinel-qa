import type { SolicitudRow } from './types'

function toStr(val: unknown): string | null {
  if (val === null || val === undefined) return null
  return String(val)
}

export function rowToSolicitud(row: Record<string, unknown>): SolicitudRow {
  return {
    id: toStr(row.id) ?? '',
    folio: toStr(row.folio) ?? '',
    placa: toStr(row.placa) ?? '',
    estatusDependencia: toStr(row.estatus_dependencia) ?? '',
    motivoRetencion: toStr(row.motivo_retencion),
    createdAt: toStr(row.created_at) ?? '',
    nombreInfractor: toStr(row.nombre_infractor),
    correoInfractor: toStr(row.correo_infractor),
    urlOrdenSalida: toStr(row.url_orden_salida_liberaciones),
    urlOficioPagoCorralon: toStr(row.url_oficio_pago_corralon),
    nombreTitular: toStr(row.nombre_titular_liberacion),
    apellidoPaternoTitular: toStr(row.appaterno_titular_liberacion),
    apellidoMaternoTitular: toStr(row.apmaterno_titular_liberacion),
    correoTitular: toStr(row.correo_titular_liberacion),
  }
}

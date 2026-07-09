import type { SinD1Row } from './types'
import { obtenerSinD1 } from './repository'

function toStr(val: unknown) { return String(val ?? '—') }

export async function listarSinD1(desde?: string, hasta?: string, nombre?: string) {
  const rows = await obtenerSinD1(desde, hasta, nombre)
  return rows.map((r: SinD1Row) => ({
    folio:          toStr(r.folio),
    fecha:          r.fecha instanceof Date
      ? r.fecha.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' })
      : toStr(r.fecha),
    nombreAfectado: toStr(r.nombreAfectado),
    telefono:       toStr(r.telefono),
    documentacion:  'PENDIENTE',
  }))
}
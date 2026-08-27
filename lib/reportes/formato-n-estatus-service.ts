import { query } from '@/lib/db'

export const SECCIONES_ESTATUS = [
  'eventos',
  'fge',
  'fgr',
  'rnd',
  'medios',
  'victimas',
  'armas',
  'observaciones',
] as const

export type SeccionEstatus = typeof SECCIONES_ESTATUS[number]

const COLUMNA: Record<SeccionEstatus, string> = {
  eventos: 'eventos_confirmado',
  fge: 'fge_confirmado',
  fgr: 'fgr_confirmado',
  rnd: 'rnd_confirmado',
  medios: 'medios_confirmado',
  victimas: 'victimas_confirmado',
  armas: 'armas_confirmado',
  observaciones: 'observaciones_confirmado',
}

export interface FormatoNEstatusDia {
  fecha: string
  eventos_confirmado: boolean
  fge_confirmado: boolean
  fgr_confirmado: boolean
  rnd_confirmado: boolean
  medios_confirmado: boolean
  victimas_confirmado: boolean
  armas_confirmado: boolean
  observaciones_confirmado: boolean
  completado_en: string | null
  actualizado_por: string | null
  actualizado_en: string
}

function formatFecha(v: unknown): string {
  if (v instanceof Date) return v.toISOString().slice(0, 10)
  if (typeof v === 'string') return v.slice(0, 10)
  return String(v).slice(0, 10)
}

function rowTo(r: Record<string, unknown>): FormatoNEstatusDia {
  return {
    fecha: formatFecha(r.fecha),
    eventos_confirmado: Boolean(r.eventos_confirmado),
    fge_confirmado: Boolean(r.fge_confirmado),
    fgr_confirmado: Boolean(r.fgr_confirmado),
    rnd_confirmado: Boolean(r.rnd_confirmado),
    medios_confirmado: Boolean(r.medios_confirmado),
    victimas_confirmado: Boolean(r.victimas_confirmado),
    armas_confirmado: Boolean(r.armas_confirmado),
    observaciones_confirmado: Boolean(r.observaciones_confirmado),
    completado_en: r.completado_en != null ? String(r.completado_en) : null,
    actualizado_por: r.actualizado_por != null ? String(r.actualizado_por) : null,
    actualizado_en: String(r.actualizado_en),
  }
}

export function contarConfirmadas(estatus: FormatoNEstatusDia | null): number {
  if (!estatus) return 0
  return SECCIONES_ESTATUS.reduce((n, s) => n + (estatus[COLUMNA[s] as keyof FormatoNEstatusDia] ? 1 : 0), 0)
}

export function esListo(estatus: FormatoNEstatusDia | null): boolean {
  return contarConfirmadas(estatus) === SECCIONES_ESTATUS.length
}

export async function obtenerEstatusDia(fecha: string): Promise<FormatoNEstatusDia | null> {
  const r = await query<Record<string, unknown>>(`SELECT * FROM formato_n_estatus_dia WHERE fecha = $1 LIMIT 1`, [fecha])
  if (!r.rows.length) return null
  return rowTo(r.rows[0])
}

export async function obtenerEstatusRango(fechaInicio: string, fechaFin: string): Promise<FormatoNEstatusDia[]> {
  const r = await query<Record<string, unknown>>(
    `SELECT * FROM formato_n_estatus_dia WHERE fecha BETWEEN $1 AND $2 ORDER BY fecha ASC`,
    [fechaInicio, fechaFin],
  )
  return r.rows.map(rowTo)
}

export async function confirmarSeccion(fecha: string, seccion: SeccionEstatus, userId: string): Promise<FormatoNEstatusDia> {
  const columna = COLUMNA[seccion]
  await query(`
    INSERT INTO formato_n_estatus_dia (fecha, ${columna}, actualizado_por, actualizado_en)
    VALUES ($1, true, $2, now())
    ON CONFLICT (fecha) DO UPDATE SET
      ${columna} = true,
      actualizado_por = EXCLUDED.actualizado_por,
      actualizado_en = now()
  `, [fecha, userId])

  const estado = await query<Record<string, unknown>>(`SELECT * FROM formato_n_estatus_dia WHERE fecha = $1`, [fecha])
  const fila = rowTo(estado.rows[0])

  const todas = SECCIONES_ESTATUS.every(s => fila[COLUMNA[s] as keyof FormatoNEstatusDia])
  if (todas && !fila.completado_en) {
    await query(`UPDATE formato_n_estatus_dia SET completado_en = now() WHERE fecha = $1`, [fecha])
    fila.completado_en = String(new Date().toISOString())
  }
  return fila
}

export async function desconfirmarSeccion(fecha: string, seccion: SeccionEstatus, userId: string): Promise<void> {
  const columna = COLUMNA[seccion]
  await query(`
    INSERT INTO formato_n_estatus_dia (fecha, ${columna}, actualizado_por, actualizado_en)
    VALUES ($1, false, $2, now())
    ON CONFLICT (fecha) DO UPDATE SET
      ${columna} = false,
      completado_en = NULL,
      actualizado_por = EXCLUDED.actualizado_por,
      actualizado_en = now()
  `, [fecha, userId])
}

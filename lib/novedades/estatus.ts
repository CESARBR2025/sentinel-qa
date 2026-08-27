import { query } from '@/lib/db'
import type { EstatusNovedadesDia } from './types'

// Semáforo del stepper. Copia de lib/reportes/formato-n-estatus-service.ts con
// las 11 secciones del Parte de Novedades en vez de las 8 de Formato N.

export const SECCIONES_ESTATUS = [
  'periodo',
  'resumen',
  'subsecretaria',
  'analisis',
  'c4',
  'transito',
  'prevencion',
  'delictivos',
  'operativos',
  'resumen_nov',
  'fuerza',
] as const

export type SeccionEstatus = typeof SECCIONES_ESTATUS[number]

export const COLUMNA: Record<SeccionEstatus, string> = {
  periodo: 'periodo_confirmado',
  resumen: 'resumen_confirmado',
  subsecretaria: 'subsecretaria_confirmado',
  analisis: 'analisis_confirmado',
  c4: 'c4_confirmado',
  transito: 'transito_confirmado',
  prevencion: 'prevencion_confirmado',
  delictivos: 'delictivos_confirmado',
  operativos: 'operativos_confirmado',
  resumen_nov: 'resumen_nov_confirmado',
  fuerza: 'fuerza_confirmado',
}

function formatFecha(v: unknown): string {
  if (v instanceof Date) return v.toISOString().slice(0, 10)
  if (typeof v === 'string') return v.slice(0, 10)
  return String(v).slice(0, 10)
}

function rowTo(r: Record<string, unknown>): EstatusNovedadesDia {
  return {
    fecha: formatFecha(r.fecha),
    periodo_confirmado: Boolean(r.periodo_confirmado),
    resumen_confirmado: Boolean(r.resumen_confirmado),
    subsecretaria_confirmado: Boolean(r.subsecretaria_confirmado),
    analisis_confirmado: Boolean(r.analisis_confirmado),
    c4_confirmado: Boolean(r.c4_confirmado),
    transito_confirmado: Boolean(r.transito_confirmado),
    prevencion_confirmado: Boolean(r.prevencion_confirmado),
    delictivos_confirmado: Boolean(r.delictivos_confirmado),
    operativos_confirmado: Boolean(r.operativos_confirmado),
    resumen_nov_confirmado: Boolean(r.resumen_nov_confirmado),
    fuerza_confirmado: Boolean(r.fuerza_confirmado),
    completado_en: r.completado_en != null ? String(r.completado_en) : null,
    actualizado_por: r.actualizado_por != null ? String(r.actualizado_por) : null,
    actualizado_en: String(r.actualizado_en),
  }
}

export function contarConfirmadas(estatus: EstatusNovedadesDia | null): number {
  if (!estatus) return 0
  return SECCIONES_ESTATUS.reduce((n, s) => n + (estatus[COLUMNA[s] as keyof EstatusNovedadesDia] ? 1 : 0), 0)
}

export function esListo(estatus: EstatusNovedadesDia | null): boolean {
  return contarConfirmadas(estatus) === SECCIONES_ESTATUS.length
}

export async function obtenerEstatusDia(fecha: string): Promise<EstatusNovedadesDia | null> {
  const r = await query<Record<string, unknown>>(`SELECT * FROM novedades_estatus_dia WHERE fecha = $1 LIMIT 1`, [fecha])
  if (!r.rows.length) return null
  return rowTo(r.rows[0])
}

export async function obtenerEstatusRango(fechaInicio: string, fechaFin: string): Promise<EstatusNovedadesDia[]> {
  const r = await query<Record<string, unknown>>(
    `SELECT * FROM novedades_estatus_dia WHERE fecha BETWEEN $1 AND $2 ORDER BY fecha ASC`,
    [fechaInicio, fechaFin],
  )
  return r.rows.map(rowTo)
}

export async function confirmarSeccion(fecha: string, seccion: SeccionEstatus, userId: string): Promise<EstatusNovedadesDia> {
  const columna = COLUMNA[seccion]
  await query(`
    INSERT INTO novedades_estatus_dia (fecha, ${columna}, actualizado_por, actualizado_en)
    VALUES ($1, true, $2, now())
    ON CONFLICT (fecha) DO UPDATE SET
      ${columna} = true,
      actualizado_por = EXCLUDED.actualizado_por,
      actualizado_en = now()
  `, [fecha, userId])

  const estado = await query<Record<string, unknown>>(`SELECT * FROM novedades_estatus_dia WHERE fecha = $1`, [fecha])
  const fila = rowTo(estado.rows[0])

  const todas = SECCIONES_ESTATUS.every(s => fila[COLUMNA[s] as keyof EstatusNovedadesDia])
  if (todas && !fila.completado_en) {
    await query(`UPDATE novedades_estatus_dia SET completado_en = now() WHERE fecha = $1`, [fecha])
    fila.completado_en = String(new Date().toISOString())
  }
  return fila
}

export async function desconfirmarSeccion(fecha: string, seccion: SeccionEstatus, userId: string): Promise<void> {
  const columna = COLUMNA[seccion]
  await query(`
    INSERT INTO novedades_estatus_dia (fecha, ${columna}, actualizado_por, actualizado_en)
    VALUES ($1, false, $2, now())
    ON CONFLICT (fecha) DO UPDATE SET
      ${columna} = false,
      completado_en = NULL,
      actualizado_por = EXCLUDED.actualizado_por,
      actualizado_en = now()
  `, [fecha, userId])
}

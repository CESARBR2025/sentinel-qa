import type { SeccionKey } from '../types'
import type { ResultadoC4, ResultadoSubsecretaria, ResultadoFuerza } from './grupo-a'
import type { ResultadoResumen, ResultadoTransito, ResultadoDelictivos } from './grupo-b'
import type { ResultadoAnalisis, ResultadoPrevencion, ResultadoOperativos } from './manual'
import { calcularC4, calcularSubsecretaria, calcularFuerza } from './grupo-a'
import { calcularResumen, calcularTransito, calcularDelictivos } from './grupo-b'
import { calcularAnalisis, calcularPrevencion, calcularOperativos } from './manual'

export interface ResultadoSeccion {
  datos: Record<string, unknown>
  filas: Record<string, { datos: Record<string, unknown> }[]>
}

/**
 * Despachador único de cálculo por sección. Las secciones no confirmadas se
 * recalculan desde la BD en cada carga; las confirmadas leen el snapshot.
 */
export async function calcularSeccion(fecha: string, seccion: SeccionKey): Promise<ResultadoSeccion> {
  switch (seccion) {
    case 'periodo':
      return { datos: { fecha, inicio: '', fin: '', año: Number(fecha.slice(0, 4)) }, filas: {} }
    case 'resumen': {
      const r: ResultadoResumen = await calcularResumen(fecha)
      return { datos: { ...r.datos }, filas: {} }
    }
    case 'subsecretaria': {
      const r: ResultadoSubsecretaria = await calcularSubsecretaria(fecha)
      return { datos: { ...r.datos }, filas: r.filas }
    }
    case 'analisis': {
      const r: ResultadoAnalisis = await calcularAnalisis(fecha)
      return { datos: { ...r.datos }, filas: r.filas }
    }
    case 'c4': {
      const r: ResultadoC4 = await calcularC4(fecha)
      return { datos: { ...r.datos }, filas: {} }
    }
    case 'transito': {
      const r: ResultadoTransito = await calcularTransito(fecha)
      return { datos: { ...r.datos }, filas: r.filas }
    }
    case 'prevencion': {
      const r: ResultadoPrevencion = await calcularPrevencion(fecha)
      return { datos: { ...r.datos }, filas: r.filas }
    }
    case 'delictivos': {
      const r: ResultadoDelictivos = await calcularDelictivos(fecha)
      return { datos: { ...r.datos }, filas: r.filas }
    }
    case 'operativos': {
      const r: ResultadoOperativos = await calcularOperativos(fecha)
      return { datos: { ...r.datos }, filas: r.filas }
    }
    case 'resumen_nov':
      return { datos: { filas: [], eco8: null, interinstitucional: null, metropolitano: null }, filas: {} }
    case 'fuerza': {
      const r: ResultadoFuerza = await calcularFuerza(fecha)
      return { datos: { ...r.datos }, filas: {} }
    }
  }
}

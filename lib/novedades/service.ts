import type { DiaNovedades, FilaNovedad, SeccionKey } from './types'
import { SECCIONES } from './types'
import { obtenerSeccion, obtenerFilasDeSeccion as obtenerFilasDeSeccionRepo, upsertSeccion, reemplazarFilas } from './repository'
import { obtenerEstatusDia, confirmarSeccion, desconfirmarSeccion } from './estatus'
import type { EstatusNovedadesDia } from './types'
import { calcularSeccion } from './calculo'
import { ventanaNovedades } from './ventana'

// Orquestación del Parte de Novedades.
//
// REGLA DE DATOS: calcular al cargar, snapshot al confirmar. Es un documento
// oficial diario — si mañana se corrige un IPH, el parte de ayer no debe
// cambiar. `obtenerDiaNovedades` NO escribe; el snapshot ocurre solo en
// `confirmarSeccionNovedades` y SOLO sobre la sección que se confirma (esa
// acotación evita el bug de Formato N donde un guardado sobreescribía con ceros
// los campos de otra sección).

export async function obtenerDiaNovedades(fecha: string): Promise<DiaNovedades> {
  const estatus = await obtenerEstatusDia(fecha)
  const secciones: Partial<Record<SeccionKey, Record<string, unknown>>> = {}
  const filas: Record<string, FilaNovedad[]> = {}
  const calculado: Partial<Record<SeccionKey, Record<string, unknown>>> = {}

  for (const seccion of SECCIONES) {
    const confirmada = Boolean(estatus && estatus[columnaDe(seccion)])
    const snap = await obtenerSeccion(fecha, seccion)

    if (confirmada) {
      // Sección confirmada: devolver el snapshot guardado, NO el recálculo.
      secciones[seccion] = snap ?? {}
    } else {
      // No confirmada: calcular lo automático; el draft capturado (si existe)
      // se devuelve como estado editable y el recálculo como "antes".
      const calc = await calcularSeccion(fecha, seccion)
      calculado[seccion] = calc.datos
      secciones[seccion] = snap ?? calc.datos
      for (const [clave, lista] of Object.entries(calc.filas)) {
        filas[clave] = (lista as { datos: Record<string, unknown> }[]).map((f, i) => ({
          id: `calc-${clave}-${i}`,
          fecha,
          seccion: clave,
          orden: i,
          datos: f.datos,
        }))
      }
    }
    // Listados de la sección (claves prefijadas, ej. transito.hechos).
    for (const f of await obtenerFilasDeSeccion(fecha, seccion)) {
      filas[f.seccion] = filas[f.seccion] ?? []
      filas[f.seccion]!.push(f)
    }
  }

  return { fecha, estatus, secciones, filas, calculado }
}

/**
 * Snapshot: congela lo calculado + lo capturado y confirma la sección.
 * Solo se escribe la sección que se está confirmando.
 */
export async function confirmarSeccionNovedades(
  fecha: string,
  seccion: SeccionKey,
  datos: Record<string, unknown>,
  userId: string,
): Promise<EstatusNovedadesDia> {
  await upsertSeccion(fecha, seccion, datos, userId)

  // Listados que viajan dentro del payload de la sección (claves prefijadas).
  const listados = datos.filas as Record<string, { datos: Record<string, unknown> }[]> | undefined
  if (listados) {
    for (const [clave, lista] of Object.entries(listados)) {
      await reemplazarFilas(fecha, clave, lista, userId)
    }
    delete datos.filas
    await upsertSeccion(fecha, seccion, datos, userId)
  }

  const estatus = await confirmarSeccion(fecha, seccion, userId)
  return estatus
}

export async function desconfirmarSeccionNovedades(
  fecha: string,
  seccion: SeccionKey,
  userId: string,
): Promise<void> {
  await desconfirmarSeccion(fecha, seccion, userId)
}

function columnaDe(seccion: SeccionKey): keyof EstatusNovedadesDia {
  const map: Record<SeccionKey, keyof EstatusNovedadesDia> = {
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
  return map[seccion]
}

async function obtenerFilasDeSeccion(fecha: string, seccion: string): Promise<FilaNovedad[]> {
  const r = await obtenerFilasDeSeccionRepo(fecha, seccion)
  return r
}

/** Fecha del parte con su ventana, para el encabezado (paso 1). */
export function periodoDe(fecha: string): { fecha: string; inicio: string; fin: string; año: number } {
  const v = ventanaNovedades(fecha)
  return { fecha, inicio: v.inicio, fin: v.fin, año: Number(fecha.slice(0, 4)) }
}

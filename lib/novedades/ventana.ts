/**
 * Ventana operativa del Parte de Novedades: 06:00 → 06:00.
 *
 * El parte del día D cubre de las 06:00 de D-1 a las 06:00 de D.
 *
 * REGLA DURA: ninguna query de este módulo usa `::date` sobre una columna de
 * timestamp. La ventana NO coincide con un día natural, así que recortar por
 * día es incorrecto por construcción. Todas las queries filtran
 * `columna >= $inicio AND columna < $fin`, con los límites calculados aquí.
 *
 * Las tablas que guardan fecha y hora en columnas separadas
 * (`ofi_reporte_denuncia.fecha_reporte` + `hora_reporte`,
 * `iph_detenidos.fecha_evento` + `hora_inicio_evento`) se filtran componiendo
 * ambas columnas contra estos límites.
 *
 * SEGUNDA REGLA DURA: el esquema mezcla `timestamp with time zone` y
 * `timestamp` sin zona, y el servidor corre en America/Mexico_City (UTC-6).
 * Un mismo literal se interpreta distinto según el tipo de la columna:
 *
 *   '2026-08-10T06:00:00.000Z'::timestamptz  ->  2026-08-10 00:00:00-06  (00:00 local)
 *   '2026-08-10T06:00:00.000Z'::timestamp    ->  2026-08-10 06:00:00     (06:00 local)
 *
 * Por eso NO existe un solo literal correcto para ambos tipos. Los límites se
 * emiten como hora local ingenua ('YYYY-MM-DD 06:00:00') y cada query declara
 * el tipo de su columna usando `rangoTz()` o `rangoNaive()`. Usar el helper
 * equivocado corre la ventana 6 horas en silencio.
 *
 * Clasificación verificada contra la BD real:
 *   timestamptz -> incidentes.fecha_hora_inicio, ofi_reportes_campo.created_at,
 *                  via.v2_infracciones.created_at, ofi_puesta_disposicion.creado_en
 *   sin zona    -> medidas_proteccion.creado_en, visitas_domiciliarias.creado_en,
 *                  fichas_busqueda.creado_en / .fecha_activacion,
 *                  y las expresiones (fecha_reporte + hora_reporte)
 */

export const TZ_OPERATIVA = 'America/Mexico_City'

export function ventanaNovedades(fecha: string): { inicio: string; fin: string } {
  const [y, m, d] = fecha.split('-').map(Number)
  if (!y || !m || !d) throw new Error(`fecha inválida: ${fecha}`)
  const diaFin = new Date(Date.UTC(y, m - 1, d))
  const diaInicio = new Date(diaFin.getTime() - 86400000)
  const aLocal = (dt: Date) => `${dt.toISOString().slice(0, 10)} 06:00:00`
  return {
    inicio: aLocal(diaInicio),
    fin: aLocal(diaFin),
  }
}

/**
 * Fragmento WHERE para una columna `timestamp WITH time zone`.
 * Convierte la hora local de pared del límite al instante correcto, y deja la
 * comparación sargable (no toca la columna, solo el parámetro).
 */
export function rangoTz(columna: string, p1 = '$1', p2 = '$2'): string {
  return `${columna} >= ${p1}::timestamp AT TIME ZONE '${TZ_OPERATIVA}'`
       + ` AND ${columna} < ${p2}::timestamp AT TIME ZONE '${TZ_OPERATIVA}'`
}

/** Fragmento WHERE para una columna `timestamp` sin zona, o una expresión date+time. */
export function rangoNaive(columna: string, p1 = '$1', p2 = '$2'): string {
  return `${columna} >= ${p1}::timestamp AND ${columna} < ${p2}::timestamp`
}

/**
 * Fecha del parte a la que pertenece un timestamp (para agrupar eventos).
 * Un timestamp en [D-1 06:00, D 06:00) pertenece al parte del día D.
 * Útil para validaciones y para la prueba de ventana (05:59 vs 06:01).
 */
export function fechaParteDeTimestamp(ts: string): string {
  const t = new Date(ts).getTime()
  const [y, m, d] = [ts.slice(0, 4), ts.slice(5, 7), ts.slice(8, 10)].map(Number)
  // Partimos del supuesto de que el ts cae en el día natural D-1 o D; barremos
  // hacia adelante hasta encontrar la ventana que lo contiene.
  let candidato = new Date(Date.UTC(y, m - 1, d, 0, 0, 0, 0))
  for (let i = 0; i < 4; i++) {
    const [ini, fin] = ventanaDeTimestamp(candidato.toISOString())
    if (t >= new Date(ini).getTime() && t < new Date(fin).getTime()) {
      return candidato.toISOString().slice(0, 10)
    }
    candidato = new Date(candidato.getTime() + 86400000)
  }
  throw new Error(`no se pudo ubicar el parte para ${ts}`)
}

function ventanaDeTimestamp(fecha: string): [string, string] {
  const v = ventanaNovedades(fecha.slice(0, 10))
  return [v.inicio, v.fin]
}

/**
 * Fecha de turnos de `incidentes_camara` que entran en el parte del día D.
 *
 * `incidentes_camara.fecha` es date (captura agregada por turno, única de las
 * 34 tablas que no se filtra por rango de timestamp). Con la semántica del fix
 * de la Etapa 0.6 (fecha = fecha de INICIO del turno), la regla es exacta:
 *
 *   parte(D).camaras = SUM(incidentes_camara WHERE fecha = D - 1)
 *
 * Los tres turnos de D-1 (MATUTINO 07-15, VESPERTINO 15-22, NOCTURNO 22→07 de D)
 * entran completos; el MATUTINO de D arranca 07:00 de D y no entra. El desfase
 * de una hora en los extremos se cancela: cada turno pertenece a exactamente un
 * parte, ninguno se cuenta dos veces ni se pierde.
 *
 * Centralizado aquí para que, si el C-4 cambia horarios de turno, solo se toque
 * este archivo (y lib/monitorista/turnos.ts).
 */
export function fechaTurnosDelParte(fecha: string): string {
  const [y, m, d] = fecha.split('-').map(Number)
  const ayer = new Date(Date.UTC(y, m - 1, d - 1))
  return ayer.toISOString().slice(0, 10)
}

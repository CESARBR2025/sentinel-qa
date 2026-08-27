import { query } from '@/lib/db'
import type { AnalisisNovedades, OperativosNovedades, PrevencionNovedades } from '../types'
import { OPERATIVOS_SUPERVISION } from '../types'
import { ventanaNovedades, rangoTz, rangoNaive } from '../ventana'

// Secciones de captura manual (Etapa 6). El valor que agrega el sistema aquí no
// es autollenado sino: persistencia entre días, arrastre del día anterior donde
// aplica, validación de tipos y que el .docx salga armado. Los contadores
// autollenables (marcados en la UI) salen de BD; el resto es captura pura.

export interface ResultadoAnalisis { datos: AnalisisNovedades; filas: Record<string, { datos: Record<string, unknown> }[]> }
export interface ResultadoPrevencion { datos: PrevencionNovedades; filas: Record<string, { datos: Record<string, unknown> }[]> }
export interface ResultadoOperativos { datos: OperativosNovedades; filas: Record<string, { datos: Record<string, unknown> }[]> }

// ==================== Paso 4 — Unidad de Análisis (T5) ====================

export async function calcularAnalisis(fecha: string): Promise<ResultadoAnalisis> {
  const v = ventanaNovedades(fecha)
  // detenidos_fiscalia es derivable de T0 (puestas a disposición de Fiscalía) —
  // se prellena con ese conteo y queda editable.
  const pdFiscalia = await puestasDisposicionFiscalia(v.inicio, v.fin)
  return {
    datos: {
      consultas_personas: 0,
      ordenes_aprehension: 0,
      consultas_vehiculos: 0,
      vehiculos_reporte_robo: 0,
      detenidos_carcel: 0,
      detenidos_fiscalia: pdFiscalia,
    },
    filas: {},
  }
}

async function puestasDisposicionFiscalia(inicio: string, fin: string): Promise<number> {
  const r = await query<{ c: string }>(`
    SELECT count(*) AS c
    FROM ofi_puesta_disposicion pd
    WHERE (pd.gestion_interna = false OR pd.dependencia_externa IS NOT NULL)
      AND ${rangoTz('pd.creado_en')}
  `, [inicio, fin])
  return Number(r.rows[0]?.c ?? 0)
}

// ==================== Paso 7 — Prevención del Delito (T14 a T24) ====================

export async function calcularPrevencion(fecha: string): Promise<ResultadoPrevencion> {
  const v = ventanaNovedades(fecha)
  const [victimas, persona] = await Promise.all([
    atencionVictimas(v.inicio, v.fin),
    personaNoLocalizada(v.inicio, v.fin),
  ])
  return {
    datos: { atencion_victimas: victimas, persona_no_localizada: persona },
    filas: {},
  }
}

/** T14 — Matriz de Atención a Víctimas. ~8 contadores autollenables; el resto queda en 0 para captura manual. */
async function atencionVictimas(inicio: string, fin: string): Promise<Record<string, number>> {
  const [medidas, visitas, fichas] = await Promise.all([
    query<{ c: string }>(`SELECT count(*) AS c FROM medidas_proteccion WHERE ${rangoNaive('creado_en')}`, [inicio, fin]),
    query<{ c: string; apercibidos: string }>(`
      SELECT
        COUNT(DISTINCT medida_id) AS c,
        COUNT(*) FILTER (WHERE apercibimiento_aplicado = true) AS apercibidos
      FROM visitas_domiciliarias WHERE ${rangoNaive('creado_en')}`,
      [inicio, fin],
    ),
    query<Record<string, unknown>>(`SELECT tipo, count(*)::int AS c FROM fichas_busqueda WHERE ${rangoNaive('creado_en')} GROUP BY tipo`, [inicio, fin]),
  ])

  let baesvim = 0
  let noLocalizada = 0
  for (const f of fichas.rows) {
    const t = String(f.tipo ?? '').toLowerCase()
    if (t.includes('baesvim')) baesvim += Number(f.c ?? 0)
    else if (t.includes('localizada')) noLocalizada += Number(f.c ?? 0)
  }

  return {
    medidas_realizadas: Number(medidas.rows[0]?.c ?? 0),
    // Primera visita domiciliaria por medida (distinct medida_id).
    constancias_domiciliarias: Number(visitas.rows[0]?.c ?? 0),
    incumplimientos_medidas: Number(visitas.rows[0]?.apercibidos ?? 0),
    baesvim,
    persona_no_localizada: noLocalizada,
    seguimiento_baesvim: 0,
    seguimiento_no_localizada: 0,
    personas_disposicion_fiscalia: 0,
    personas_disposicion_juzgado: 0,
    // Los ~21 restantes son captura manual pura (mediación, vinculación,
    // jornadas, custodias, apoyos de traslado, etc.) — arrancan en 0.
  }
}

/** T15 — Reporte de persona no localizada (autollenable, editable). */
async function personaNoLocalizada(inicio: string, fin: string): Promise<PrevencionNovedades['persona_no_localizada']> {
  const r = await query<Record<string, unknown>>(`
    SELECT
      to_char(f.fecha_activacion, 'YYYY-MM-DD') AS fecha,
      to_char(f.fecha_activacion, 'HH24:MI')    AS hora,
      f.enlace                                  AS lugar,
      f.carpeta_investigacion                   AS carpeta,
      NULL                                      AS delito,
      f.rt_atiende                              AS policia,
      f.elemento_novedades                      AS unidad,
      f.motivo_cancelacion                      AS observaciones
    FROM fichas_busqueda f
    WHERE ${rangoNaive('f.fecha_activacion')}
      AND lower(f.tipo) LIKE '%localizada%'
    ORDER BY f.fecha_activacion ASC
    LIMIT 50
  `, [inicio, fin])
  if (!r.rows.length) return null
  const row = r.rows[0]
  return {
    fecha: row.fecha != null ? String(row.fecha) : null,
    hora: row.hora != null ? String(row.hora) : null,
    lugar: row.lugar != null ? String(row.lugar) : null,
    carpeta: row.carpeta != null ? String(row.carpeta) : null,
    delito: row.delito != null ? String(row.delito) : null,
    policia: row.policia != null ? String(row.policia) : null,
    unidad: row.unidad != null ? String(row.unidad) : null,
    observaciones: row.observaciones != null ? String(row.observaciones) : null,
  }
}

// ==================== Paso 9 — Supervisión y Operativos (T29, T30) ====================

export async function calcularOperativos(fecha: string): Promise<ResultadoOperativos> {
  const v = ventanaNovedades(fecha)
  const [eco8, metro, cateoFge, cateoFgr] = await Promise.all([
    conteosPdfPorFlag(v.inicio, v.fin, 'ofi_eco8'),
    conteosPdfPorFlag(v.inicio, v.fin, 'ofi_operativos_metropolitano'),
    conteosPdfPorFlag(v.inicio, v.fin, 'ofi_apoyo_cateos_fge'),
    conteosPdfPorFlag(v.inicio, v.fin, 'ofi_apoyo_cateos_fgr'),
  ])

  const filaOperativo = (operativo: string, pd: { juzgado: number; fge: number; fgr: number }): OperativosNovedades['operativos'][number] => ({
    operativo,
    unidades: 0,
    elementos: 0,
    pd_juzgado: pd.juzgado,
    pd_fge: pd.fge,
    pd_fgr: pd.fgr,
    inicio: '',
    termino: '',
    afluencia: '',
  })

  return {
    datos: {
      supervision: OPERATIVOS_SUPERVISION.map(op => ({
        operativo: op, total_unidades: 0, total_elementos: 0, vehiculos_revisados: 0,
        vehiculos_pd: 0, personas_revisadas: 0, remitidas_juzgado: 0, a_fge: 0, a_fgr: 0,
        revisiones: 0, inicio: '', termino: '',
      })),
      operativos: [
        filaOperativo('OPERATIVO ECO 8', eco8),
        filaOperativo('METROPOLITANO II', metro),
        // INTERINSTITUCIONAL no tiene flag — manual
        { operativo: 'INTERINSTITUCIONAL', unidades: 0, elementos: 0, pd_juzgado: 0, pd_fge: 0, pd_fgr: 0, inicio: '', termino: '', afluencia: '' },
        filaOperativo('CATEO SSPM/FGE', cateoFge),
        filaOperativo('CATEO SSPM/FGR', cateoFgr),
      ],
    },
    filas: {},
  }
}

/** Personas puestas a disposición (Juzgado/FGE/FGR) por flag de operativo. */
async function conteosPdfPorFlag(inicio: string, fin: string, flag: string) {
  const r = await query<{ pd_fge: string; pd_fgr: string }>(`
    SELECT
      COUNT(*) FILTER (WHERE rc.ofi_autoridad_recibe IN ('FISCALIA','FGE')) AS pd_fge,
      COUNT(*) FILTER (WHERE rc.ofi_autoridad_recibe = 'FGR')               AS pd_fgr
    FROM ofi_reportes_campo rc
    WHERE rc.${flag} = true AND ${rangoTz('rc.created_at')}
  `, [inicio, fin])
  return {
    juzgado: 0, // remisiones a juzgado por operativo no tienen flag propio
    fge: Number(r.rows[0]?.pd_fge ?? 0),
    fgr: Number(r.rows[0]?.pd_fgr ?? 0),
  }
}

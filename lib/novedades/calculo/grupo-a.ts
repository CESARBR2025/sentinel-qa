import type { C4Novedades, FuerzaNovedades, SubsecretariaNovedades } from '../types'
import { rowToC4, rowToFuerza, rowToSubsecretaria } from '../mapper'
import { ventanaNovedades, rangoTz, rangoNaive } from '../ventana'

// Grupo A — autollenado puro (Etapa 4). Las tres secciones se llenan completas
// desde la BD sin depender del sector ni de captura manual.

export interface ResultadoC4 { datos: C4Novedades }
export interface ResultadoSubsecretaria { datos: SubsecretariaNovedades; filas: Record<string, { datos: Record<string, unknown> }[]> }
export interface ResultadoFuerza { datos: FuerzaNovedades }

export async function calcularC4(fecha: string): Promise<ResultadoC4> {
  const v = ventanaNovedades(fecha)
  const datos = await c4DesdeBD(v.inicio, v.fin, fecha)
  return { datos: rowToC4(datos as unknown as Record<string, unknown>) ?? {
    llamadas_recibidas: 0, improcedentes: 0, medico: 0, proteccion_civil: 0, seguridad: 0,
    servicios_publicos: 0, asistencia: 0, otros_servicios: 0, canalizadas: 0,
    personas_sin_novedad: 0, personas_con_antecedentes: 0, vehiculos_revisar: 0,
    vehiculos_repuve: 0, persecuciones: 0, asegurados_camara: 0, vehiculos_recuperados: 0,
    incendios: 0, hechos_transito_camara: 0,
  } }
}

export async function calcularSubsecretaria(fecha: string): Promise<ResultadoSubsecretaria> {
  const v = ventanaNovedades(fecha)
  const datos = await subsecretariaDesdeBD(v.inicio, v.fin)
  return {
    datos: rowToSubsecretaria(datos as unknown as Record<string, unknown>) ?? { pd_fiscalia: [], juzgado_civico: [] },
    filas: {},
  }
}

export async function calcularFuerza(fecha: string): Promise<ResultadoFuerza> {
  const datos = await fuerzaDesdeBD(fecha)
  return { datos: rowToFuerza(datos as unknown as Record<string, unknown>) ?? { conceptos: [] } }
}

// ==================== Consultas a BD de origen ====================

async function c4DesdeBD(inicio: string, fin: string, fecha: string): Promise<C4Novedades> {
  const { query } = await import('@/lib/db')

  const [llamadas, camaras] = await Promise.all([
    query<Record<string, unknown>>(`
      SELECT
        COUNT(*) AS total,
        COUNT(*) FILTER (WHERE medio_canalizacion_id IS NOT NULL) AS canalizadas,
        COUNT(*) FILTER (WHERE tipo_emergencia_id = 5) AS improcedentes,
        COUNT(*) FILTER (WHERE tipo_emergencia_id = 2) AS medico,
        COUNT(*) FILTER (WHERE tipo_emergencia_id = 8) AS proteccion_civil,
        COUNT(*) FILTER (WHERE tipo_emergencia_id = 1) AS seguridad,
        COUNT(*) FILTER (WHERE tipo_emergencia_id = 10) AS servicios_publicos,
        COUNT(*) FILTER (WHERE tipo_emergencia_id = 11) AS asistencia,
        -- tipos 3 (INCENDIO) y 4 (ACCIDENTE VIAL) no tienen columna propia en el
        -- formato → suman a "Otros Servicios". No es obvio leyendo el documento.
        COUNT(*) FILTER (WHERE tipo_emergencia_id IN (12, 3, 4)) AS otros_servicios
      FROM incidentes
      WHERE canal = '911' AND ${rangoTz('fecha_hora_inicio')}
    `, [inicio, fin]),
    query<Record<string, unknown>>(`
      SELECT
        COALESCE(SUM(personas_sin_novedad), 0)      AS personas_sin_novedad,
        COALESCE(SUM(personas_con_antecedentes), 0) AS personas_con_antecedentes,
        COALESCE(SUM(vehiculos_revisar), 0)         AS vehiculos_revisar,
        COALESCE(SUM(vehiculos_repuve), 0)          AS vehiculos_repuve,
        COALESCE(SUM(persecuciones), 0)             AS persecuciones,
        COALESCE(SUM(asegurados_camara), 0)         AS asegurados_camara,
        COALESCE(SUM(vehiculos_recuperados), 0)     AS vehiculos_recuperados,
        COALESCE(SUM(incendios), 0)                 AS incendios,
        COALESCE(SUM(hechos_transito), 0)           AS hechos_transito
      FROM incidentes_camara
      -- Agregado por turno, no por timestamp: SUM de los 3 turnos con
      -- fecha = D-1 (Etapa 0.6). La ventana temporal NO aplica aquí.
      WHERE fecha = $1
    `, [fechaTurno(fecha)]),
  ])

  const l = llamadas.rows[0] ?? {}
  const c = camaras.rows[0] ?? {}
  return {
    llamadas_recibidas: Number(l.total ?? 0),
    canalizadas: Number(l.canalizadas ?? 0),
    improcedentes: Number(l.improcedentes ?? 0),
    medico: Number(l.medico ?? 0),
    proteccion_civil: Number(l.proteccion_civil ?? 0),
    seguridad: Number(l.seguridad ?? 0),
    servicios_publicos: Number(l.servicios_publicos ?? 0),
    asistencia: Number(l.asistencia ?? 0),
    otros_servicios: Number(l.otros_servicios ?? 0),
    personas_sin_novedad: Number(c.personas_sin_novedad ?? 0),
    personas_con_antecedentes: Number(c.personas_con_antecedentes ?? 0),
    vehiculos_revisar: Number(c.vehiculos_revisar ?? 0),
    vehiculos_repuve: Number(c.vehiculos_repuve ?? 0),
    persecuciones: Number(c.persecuciones ?? 0),
    asegurados_camara: Number(c.asegurados_camara ?? 0),
    vehiculos_recuperados: Number(c.vehiculos_recuperados ?? 0),
    incendios: Number(c.incendios ?? 0),
    hechos_transito_camara: Number(c.hechos_transito ?? 0),
  }
}

function fechaTurno(fecha: string): string {
  const [y, m, d] = fecha.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d - 1)).toISOString().slice(0, 10)
}

async function subsecretariaDesdeBD(inicio: string, fin: string): Promise<SubsecretariaNovedades> {
  const { query } = await import('@/lib/db')

  const pd = await query<Record<string, unknown>>(`
    SELECT
      to_char(pd.hora_puesta_disposicion, 'HH24:MI') AS hora,
      concat_ws(' ', rc.ofi_calle, rc.ofi_colonia)   AS lugar,
      concat_ws(' ', da.nombre_detenido, da.ap_paterno_detenido, da.ap_materno_detenido) AS nombre,
      rc.ofi_autoridad_recibe                          AS fiscal,
      rc.delito                                        AS motivo,
      rc.expediente_ci                                 AS ci,
      ipd.rnd                                          AS rnd
    FROM ofi_puesta_disposicion pd
    JOIN ofi_reportes_campo rc ON rc.id = pd.reporte_campo_id
    JOIN ofi_detalles_asegurados da ON da.reporte_campo_id = rc.id
    LEFT JOIN iph_detenidos ipd ON ipd.reporte_denuncia_id = rc.id
    -- Puesta a disposición EXTERNA: gestion_interna=false o dependencia externa
    -- (Fiscalía). Las internas (otras áreas de la corporación) no entran en T3.
    WHERE (pd.gestion_interna = false OR pd.dependencia_externa IS NOT NULL)
      AND ${rangoTz('pd.creado_en')}
    ORDER BY pd.hora_puesta_disposicion ASC
  `, [inicio, fin])

  const jc = await query<Record<string, unknown>>(`
    SELECT
      to_char(ord.hora_reporte, 'HH24:MI') AS hora,
      concat_ws(' ', ord.lugar_hecho, ord.colonia_hecho) AS lugar,
      concat_ws(' ', da.nombre_detenido, da.ap_paterno_detenido, da.ap_materno_detenido) AS nombre,
      ord.marco_legal      AS marco_legal,
      ord.policia_a_cargo  AS oficial,
      p.placa              AS unidad,
      ord.folio_sija       AS sija,
      ord.folio_remision   AS remision,
      ord.iph              AS iph,
      ipd.rnd              AS rnd
    FROM ofi_reporte_denuncia ord
    LEFT JOIN ofi_detalles_asegurados da ON da.reporte_campo_id = ord.id
    LEFT JOIN ofi_oficiales o ON o.id = ord.oficial_id
    LEFT JOIN via.v2_patrullas p ON p.id = o.patrulla_id
    LEFT JOIN iph_detenidos ipd ON ipd.reporte_denuncia_id = ord.id
    WHERE ${rangoNaive('(ord.fecha_reporte + ord.hora_reporte)')}
    ORDER BY ord.hora_reporte ASC
  `, [inicio, fin])

  return {
    pd_fiscalia: pd.rows.map(r => ({
      hora: r.hora != null ? String(r.hora) : null,
      lugar: r.lugar != null ? String(r.lugar) : null,
      nombre: r.nombre != null ? String(r.nombre) : null,
      fiscal: r.fiscal != null ? String(r.fiscal) : null,
      motivo: r.motivo != null ? String(r.motivo) : null,
      ci: r.ci != null ? String(r.ci) : null,
      rnd: r.rnd != null ? String(r.rnd) : null,
    })),
    juzgado_civico: jc.rows.map(r => ({
      hora: r.hora != null ? String(r.hora) : null,
      lugar: r.lugar != null ? String(r.lugar) : null,
      nombre: r.nombre != null ? String(r.nombre) : null,
      marco_legal: r.marco_legal != null ? String(r.marco_legal) : null,
      oficial: r.oficial != null ? String(r.oficial) : null,
      unidad: r.unidad != null ? String(r.unidad) : null,
      sija: r.sija != null ? String(r.sija) : null,
      remision: r.remision != null ? String(r.remision) : null,
      iph: r.iph != null ? String(r.iph) : null,
      rnd: r.rnd != null ? String(r.rnd) : null,
    })),
  }
}

async function fuerzaDesdeBD(fecha: string): Promise<FuerzaNovedades> {
  const { query } = await import('@/lib/db')
  const r = await query<Record<string, unknown>>(`
    SELECT
      c.nombre  AS nombre,
      c.id      AS concepto_id,
      c.codigo  AS codigo,
      COALESCE(SUM(ref.cantidad), 0) AS cantidad
    FROM cat_estado_fuerza_conceptos c
    LEFT JOIN rol_estado_fuerza ref ON ref.concepto_id = c.id
    LEFT JOIN roles_servicio rs ON rs.id = ref.rol_id AND rs.fecha = $1
    WHERE c.activo = true
    GROUP BY c.id, c.nombre, c.codigo
    ORDER BY c.orden ASC
  `, [fecha])
  return {
    conceptos: r.rows.map(row => ({
      concepto: String(row.nombre ?? ''),
      concepto_id: row.concepto_id != null ? Number(row.concepto_id) : null,
      codigo: row.codigo != null ? String(row.codigo) : null,
      cantidad: Number(row.cantidad ?? 0),
    })),
  }
}

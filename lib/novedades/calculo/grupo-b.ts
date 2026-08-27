import { query } from '@/lib/db'
import type { DelictivosNovedades, FilaContadorSector, ResumenNovedades, TransitoNovedades } from '../types'
import { ventanaNovedades, rangoTz, rangoNaive } from '../ventana'
import { sectorDeHecho } from '../sector'

// Grupo B — secciones con sector (Etapa 5).
//
// Columnas de sector: ORIENTE | PONIENTE | CENTRO | TOTALES. El .docx original
// solo trae ORIENTE y PONIENTE; CENTRO se agrega por decisión del usuario
// (README / Etapa 0.3). Las columnas se generan iterando cat_sectores activos.
// Todo lo que no resuelva sector cae en "sin asignar" (se distribuye a mano en
// el stepper, nunca solo) y se suma igualmente al TOTAL para que el total del
// documento no mienta.

export interface ResultadoResumen { datos: ResumenNovedades }
export interface ResultadoTransito { datos: TransitoNovedades; filas: Record<string, { datos: Record<string, unknown> }[]> }
export interface ResultadoDelictivos { datos: DelictivosNovedades; filas: Record<string, { datos: Record<string, unknown> }[]> }

const DEP_TRANSITO = 'DEP_TRANSITO'

// ==================== Paso 2 — Resumen general (T0, T1, T2) ====================

export async function calcularResumen(fecha: string): Promise<ResultadoResumen> {
  const v = ventanaNovedades(fecha)
  const [aseguramientos, infracciones, corralon] = await Promise.all([
    aseguramientosPorSector(v.inicio, v.fin),
    infraccionesPorColumna(v.inicio, v.fin, false),
    infraccionesPorColumna(v.inicio, v.fin, true),
  ])
  return {
    datos: { aseguramientos, infracciones, corralon },
  }
}

/** T0 — Aseguramientos por concepto × sector. TOTAL = ORIENTE+PONIENTE+CENTRO+sin asignar. */
async function aseguramientosPorSector(inicio: string, fin: string): Promise<ResumenNovedades['aseguramientos']> {
  const { rows: sectores } = await query<{ id: number; clave: string }>(
    `SELECT id, clave FROM cat_sectores WHERE activo = true ORDER BY id`,
  )

  const conceptos: { key: string; label: string }[] = [
    { key: 'pd_fgr', label: 'Puesta a disposición de la FGR' },
    { key: 'pd_fge', label: 'Puesta a disposición de la FGE' },
    { key: 'carpetas_fiscalia', label: 'Carpetas iniciadas en Fiscalía' },
    { key: 'remisiones_juzgado', label: 'Remisiones a Juzgado Cívico' },
    { key: 'apoyo_actuarios', label: 'Apoyo a Diligencias de Actuarios' },
  ]

  // Hechos con sector, por concepto.
  const hechos = await query<{ key: string; rc_id: string; ord_id: string }>(`
    SELECT 'pd_fgr' AS key, rc.id AS rc_id, NULL::uuid AS ord_id FROM ofi_reportes_campo rc
      WHERE rc.ofi_autoridad_recibe = 'FGR' AND ${rangoTz('rc.created_at')}
    UNION ALL
    SELECT 'pd_fge' AS key, rc.id AS rc_id, NULL::uuid AS ord_id FROM ofi_reportes_campo rc
      WHERE rc.ofi_autoridad_recibe = 'FISCALIA' AND ${rangoTz('rc.created_at')}
    UNION ALL
    SELECT 'carpetas_fiscalia' AS key, NULL::uuid AS rc_id, ord.id AS ord_id FROM ofi_reporte_denuncia ord
      WHERE ord.num_carpeta_investigacion IS NOT NULL
        AND ${rangoNaive('(ord.fecha_reporte + ord.hora_reporte)')}
    UNION ALL
    SELECT 'remisiones_juzgado' AS key, NULL::uuid AS rc_id, ord.id AS ord_id FROM ofi_reporte_denuncia ord
      WHERE ord.folio_remision IS NOT NULL
        AND ${rangoNaive('(ord.fecha_reporte + ord.hora_reporte)')}
    UNION ALL
    SELECT 'apoyo_actuarios' AS key, rc.id AS rc_id, NULL::uuid AS ord_id FROM ofi_reportes_campo rc
      WHERE rc.ofi_apoyo_actuarios = true AND ${rangoTz('rc.created_at')}
  `, [inicio, fin])

  // Resolver sector por hecho (oficial que lo atendió, con fallback por colonia sin fuente).
  const filas: ResumenNovedades['aseguramientos'] = conceptos.map(c => ({
    concepto: c.label,
    concepto_id: null,
    oriente: 0, poniente: 0, centro: 0, sin_asignar: 0, total: 0,
  }))
  const idx = new Map(conceptos.map((c, i) => [c.key, i]))

  for (const h of hechos.rows) {
    const fila = filas[idx.get(h.key)!]
    const hechoId = h.rc_id ?? h.ord_id!
    const tabla = h.rc_id ? 'ofi_reportes_campo' : 'ofi_reporte_denuncia'
    const sector = await sectorDeHecho(tabla as 'ofi_reportes_campo' | 'ofi_reporte_denuncia', hechoId)
    const s = sectores.find(x => x.id === sector)
    if (s?.clave === 'ORIENTE') fila.oriente++
    else if (s?.clave === 'PONIENTE') fila.poniente++
    else if (s?.clave === 'CENTRO') fila.centro++
    else fila.sin_asignar++
  }

  for (const f of filas) f.total = f.oriente + f.poniente + f.centro + f.sin_asignar
  return filas
}

/** T1 (infracciones) y T2 (corralón). Columnas operativas: SECTOR I/II (sector), TRÁNSITO (departamento), TÁCTICO y ATENCIÓN A VÍCTIMAS. */
async function infraccionesPorColumna(inicio: string, fin: string, corralon: boolean): Promise<ResumenNovedades['infracciones']> {
  const dondeGrua = corralon ? 'AND i.grua_id IS NOT NULL' : ''
  const r = await query<{ sector_clave: string | null; es_transito: boolean; total: string }>(`
    SELECT
      s.clave AS sector_clave,
      (d.clave = '${DEP_TRANSITO}') AS es_transito,
      COUNT(*) AS total
    FROM via.v2_infracciones i
    LEFT JOIN ofi_oficiales o ON o.id = i.oficial_id
    LEFT JOIN cat_sectores s ON s.id = o.sector_id
    LEFT JOIN via.v2_departamentos d ON d.id = o.departamento_id
    WHERE ${rangoTz('i.created_at')} ${dondeGrua}
    GROUP BY s.clave, es_transito
  `, [inicio, fin])

  const out: ResumenNovedades['infracciones'] = [
    { columna: 'SECTOR I', cantidad: 0 },
    { columna: 'SECTOR II', cantidad: 0 },
    { columna: 'TRÁNSITO', cantidad: 0 },
    { columna: 'TÁCTICO', cantidad: 0 },
    { columna: 'ATENCIÓN A VÍCTIMAS', cantidad: 0 },
  ]
  for (const row of r.rows) {
    const n = Number(row.total)
    if (row.es_transito) out[2].cantidad += n
    else if (row.sector_clave === 'ORIENTE') out[0].cantidad += n
    else if (row.sector_clave === 'PONIENTE') out[1].cantidad += n
    // TÁCTICO / ATENCIÓN A VÍCTIMAS: no existe adscripción en v2_departamentos
    // (solo Infracciones, Liberaciones, Tránsito). Quedan en 0 hasta que
    // Administración los dé de alta — documentado en el stepper, no un cero
    // silencioso.
  }
  return out
}

// ==================== Paso 6 — Tránsito (T7 a T13) ====================

export async function calcularTransito(fecha: string): Promise<ResultadoTransito> {
  const v = ventanaNovedades(fecha)
  const [matriz, hechos, corralon] = await Promise.all([
    matrizTransito(fecha, v.inicio, v.fin),
    hechosDeTransitoPreliminar(v.inicio, v.fin),
    vehiculosCorralon(v.inicio, v.fin),
  ])
  return {
    datos: { matriz, observaciones: 'SIN NOVEDAD' },
    filas: {
      'transito.hechos': hechos.map(f => ({ datos: f })),
      'transito.corralon': corralon.map(f => ({ datos: f })),
    },
  }
}

/** T7 — Matriz de 19 conceptos × sector. Autollenables + manuales. */
async function matrizTransito(fecha: string, inicio: string, fin: string): Promise<FilaContadorSector[]> {
  const { rows: sectores } = await query<{ id: number; clave: string }>(
    `SELECT id, clave FROM cat_sectores WHERE activo = true ORDER BY id`,
  )

  const fila = (concepto: string): FilaContadorSector => ({
    concepto, concepto_id: null, oriente: 0, poniente: 0, centro: 0, sin_asignar: 0, total: 0,
  })

  const filas = [
    fila('Hechos de Tránsito'),
    fila('Personas a Disposición de Fiscalía'),
    fila('Personas a disposición a Juzgado Cívico'),
    fila('Vehículos remitidos al corralón por Hecho de Tránsito'),
    fila('Vehículos Remitidos al corralón Por Infracción'),
    fila('Infracciones por Hecho de Tránsito'),
    fila('Infracciones por Infringir el reglamento'),
    // Los siguientes 12 no tienen fuente estructurada — captura manual.
    fila('Actas Convenio'),
    fila('Daños Materiales'),
    fila('Reportes de Accidente'),
    fila('Personas Lesionadas'),
    fila('Personas Fallecidas'),
    fila('Vehículos Participantes'),
    fila('Vehículos PD Fiscalía'),
    fila('Vehículos PD Juzgado Cívico'),
    fila('Hechos de tránsito no localizados'),
    fila('Acuerdo entre particulares'),
    fila('Orientaciones'),
    fila('Otros'),
  ]

  // 1. Hechos de Tránsito: incidentes con clasificacion_cad='TRANSITO' o tipo_emergencia_id=4.
  const hechos = await query<{ id: string; sector_id: number | null }>(`
    SELECT i.id, o.sector_id
    FROM incidentes i
    LEFT JOIN incidente_despacho des ON des.incidente_id = i.id
    LEFT JOIN incidente_despacho_elementos ele ON ele.despacho_id = des.id AND ele.es_prioritario = true
    LEFT JOIN ofi_oficiales o ON o.id = ele.oficial_id
    LEFT JOIN cat_tipos_incidente t ON t.id = i.tipo_incidente_id
    WHERE ${rangoTz('i.fecha_hora_inicio')}
      AND (t.clasificacion_cad = 'TRANSITO' OR i.tipo_emergencia_id = 4)
  `, [inicio, fin])
  for (const h of hechos.rows) {
    const sector = h.sector_id ?? (await sectorDeHecho('incidentes', h.id as string))
    sumarSector(filas[0], sector, sectores)
  }

  // 2-3. PD Fiscalía / Juzgado desde ofi_reporte_denuncia con adscripción Tránsito.
  const pdTransito = await query<{ ord_id: string; sector_id: number | null; es_remision: boolean }>(`
    SELECT ord.id AS ord_id, o.sector_id, (ord.folio_remision IS NOT NULL) AS es_remision
    FROM ofi_reporte_denuncia ord
    LEFT JOIN ofi_oficiales o ON o.id = ord.oficial_id
    LEFT JOIN via.v2_departamentos d ON d.id = o.departamento_id
    WHERE ${rangoNaive('(ord.fecha_reporte + ord.hora_reporte)')}
      AND d.clave = '${DEP_TRANSITO}'
  `, [inicio, fin])
  for (const row of pdTransito.rows) {
    const sector = row.sector_id ?? (await sectorDeHecho('ofi_reporte_denuncia', row.ord_id as string))
    if (row.es_remision) sumarSector(filas[2], sector, sectores)
    else sumarSector(filas[1], sector, sectores)
  }

  // 4-7. Corralón / infracciones por motivo.
  const infra = await query<{ grua: boolean; es_delito: boolean; sector_id: number | null }>(`
    SELECT (i.grua_id IS NOT NULL) AS grua, (i.motivo_retencion = 'DELITO') AS es_delito, o.sector_id
    FROM via.v2_infracciones i
    LEFT JOIN ofi_oficiales o ON o.id = i.oficial_id
    LEFT JOIN via.v2_departamentos d ON d.id = o.departamento_id
    WHERE ${rangoTz('i.created_at')} AND d.clave = '${DEP_TRANSITO}'
  `, [inicio, fin])
  for (const row of infra.rows) {
    const sector = row.sector_id
    if (row.grua && row.es_delito) sumarSector(filas[3], sector, sectores)        // corralón por hecho
    else if (row.grua) sumarSector(filas[4], sector, sectores)                     // corralón por infracción
    else if (row.es_delito) sumarSector(filas[5], sector, sectores)                // infracción por hecho
    else sumarSector(filas[6], sector, sectores)                                    // infracción por reglamento
  }

  for (const f of filas) f.total = f.oriente + f.poniente + f.centro + f.sin_asignar
  return filas
}

function sumarSector(fila: FilaContadorSector, sectorId: number | null, sectores: { id: number; clave: string }[]) {
  const s = sectores.find(x => x.id === sectorId)
  if (s?.clave === 'ORIENTE') fila.oriente++
  else if (s?.clave === 'PONIENTE') fila.poniente++
  else if (s?.clave === 'CENTRO') fila.centro++
  else fila.sin_asignar++
}

/** T8 — Hechos de tránsito, detalle. Preliminar (folio, hora, lugar) desde incidentes; vehículo y conductor se completan a mano. */
async function hechosDeTransitoPreliminar(inicio: string, fin: string): Promise<{ datos: Record<string, unknown> }[]> {
  const r = await query<Record<string, unknown>>(`
    SELECT
      i.folio AS hecho,
      to_char(i.fecha_hora_inicio AT TIME ZONE 'America/Mexico_City', 'HH24:MI') AS hora,
      concat_ws(' ', i.calle, i.colonia) AS lugar
    FROM incidentes i
    LEFT JOIN cat_tipos_incidente t ON t.id = i.tipo_incidente_id
    WHERE ${rangoTz('i.fecha_hora_inicio')}
      AND (t.clasificacion_cad = 'TRANSITO' OR i.tipo_emergencia_id = 4)
    ORDER BY i.fecha_hora_inicio ASC
  `, [inicio, fin])
  return r.rows.map(row => ({ datos: {
    hecho: row.hecho != null ? String(row.hecho) : '',
    hora: row.hora != null ? String(row.hora) : '',
    lugar: row.lugar != null ? String(row.lugar) : '',
    vehiculo: '',
    conductor: '',
  } }))
}

/** T9 — Vehículos a corralón: N° | FOLIO/MOTIVO | HORA | FECHA | LUGAR | VEHÍCULO | GRÚA. */
async function vehiculosCorralon(inicio: string, fin: string): Promise<{ datos: Record<string, unknown> }[]> {
  const r = await query<Record<string, unknown>>(`
    SELECT
      i.folio AS folio,
      i.motivo_retencion AS motivo,
      to_char(i.created_at AT TIME ZONE 'America/Mexico_City', 'HH24:MI') AS hora,
      to_char(i.created_at AT TIME ZONE 'America/Mexico_City', 'YYYY-MM-DD') AS fecha,
      concat_ws(' ', i.calle, i.colonia) AS lugar,
      concat_ws(' ', i.marca, i.modelo, i.color, i.placa) AS vehiculo,
      g.nombre AS grua
    FROM via.v2_infracciones i
    JOIN via.v2_gruas g ON g.id = i.grua_id
    WHERE i.grua_id IS NOT NULL AND ${rangoTz('i.created_at')}
    ORDER BY i.created_at ASC
  `, [inicio, fin])
  return r.rows.map(row => ({ datos: {
    folio_motivo: `${row.folio ?? ''} ${row.motivo ?? ''}`.trim(),
    hora: row.hora != null ? String(row.hora) : '',
    fecha: row.fecha != null ? String(row.fecha) : '',
    lugar: row.lugar != null ? String(row.lugar) : '',
    vehiculo: row.vehiculo != null ? String(row.vehiculo) : '',
    grua: row.grua != null ? String(row.grua) : '',
  } }))
}

// ==================== Paso 8 — Hechos delictivos (T25 a T28) ====================

export async function calcularDelictivos(fecha: string): Promise<ResultadoDelictivos> {
  const v = ventanaNovedades(fecha)
  const [delitos, denuncias] = await Promise.all([
    delitosPorFamilia(v.inicio, v.fin),
    denunciasDigitales(v.inicio, v.fin),
  ])
  return {
    datos: { delitos, denuncias_digitales: denuncias },
    filas: {},
  }
}

/** T25 — Delitos por familia. Los que no tienen catálogo caen en OTROS. */
async function delitosPorFamilia(inicio: string, fin: string): Promise<DelictivosNovedades['delitos']> {
  const r = await query<Record<string, unknown>>(`
    SELECT
      COALESCE(c.familia, 'OTROS') AS familia,
      ord.delito AS delito,
      c.id AS delito_id,
      COUNT(*) AS delitos,
      0 AS detenidos
    FROM ofi_reporte_denuncia ord
    LEFT JOIN cat_clasificacion_delitos c ON c.delito = ord.delito
    WHERE ${rangoNaive('(ord.fecha_reporte + ord.hora_reporte)')}
    GROUP BY c.familia, ord.delito, c.id
    ORDER BY c.familia ASC, ord.delito ASC
  `, [inicio, fin])
  return r.rows.map(row => ({
    familia: String(row.familia ?? 'OTROS'),
    delito: String(row.delito ?? ''),
    delito_id: row.delito_id != null ? Number(row.delito_id) : null,
    delitos: Number(row.delitos ?? 0),
    detenidos: Number(row.detenidos ?? 0),
  }))
}

/** T26 — Denuncias digitales (D1). N° | TIPO | UBICACIÓN | DENUNCIANTE | C.R.P. | CUESTIONARIO ÚNICO. */
async function denunciasDigitales(inicio: string, fin: string): Promise<DelictivosNovedades['denuncias_digitales']> {
  const r = await query<Record<string, unknown>>(`
    SELECT
      ord.delito AS tipo_delito,
      concat_ws(' ', ord.lugar_hecho, ord.colonia_hecho) AS ubicacion,
      ord.policia_firma_d1 AS nombre_denunciante,
      ord.crp AS crp,
      ord.folio_cu AS cuestionario_unico
    FROM ofi_reporte_denuncia ord
    WHERE ord.se_genero_d1 = true
      AND ${rangoNaive('(ord.fecha_reporte + ord.hora_reporte)')}
    ORDER BY ord.hora_reporte ASC
  `, [inicio, fin])
  return r.rows.map(row => ({
    tipo_delito: row.tipo_delito != null ? String(row.tipo_delito) : '',
    ubicacion: row.ubicacion != null ? String(row.ubicacion) : '',
    nombre_denunciante: row.nombre_denunciante != null ? String(row.nombre_denunciante) : '',
    crp: row.crp != null ? String(row.crp) : '',
    cuestionario_unico: row.cuestionario_unico != null ? String(row.cuestionario_unico) : '',
  }))
}

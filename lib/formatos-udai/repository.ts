import { query } from '@/lib/db'
import type { FaltaAdministrativaRow, ReporteIncidenciaCompleto } from './types'

function rowToFaltaAdministrativa(r: Record<string, unknown>): FaltaAdministrativaRow {
  return {
    id: r.id as string,
    fecha: r.fecha as string | null,
    hora: r.hora as string | null,
    responsableTurno: r.responsableTurno as string | null,
    horaSalida: null,
    iph: r.iph as string | null,
    folioTablet: null,
    apellidoPaterno: r.apellidoPaterno as string | null,
    apellidoMaterno: r.apellidoMaterno as string | null,
    nombre: r.nombre as string | null,
    fechaNacimiento: r.fechaNacimiento as string | null,
    edad: r.edad as number | null,
    genero: r.genero as string | null,
    alias: r.alias as string | null,
    ciudadOrigen: r.ciudadOrigen as string | null,
    calleDet: r.calleDet as string | null,
    numero: r.numero as string | null,
    coloniaDet: r.coloniaDet as string | null,
    articulo: r.articulo as string | null,
    tipoFalta: r.tipoFalta as string | null,
    rnd: r.rnd as string | null,
    lugarArresto: r.lugarArresto as string | null,
    colonia: r.colonia as string | null,
    oficialQueRemite: r.oficialQueRemite as string | null,
    oficialQueRemite2: null,
    sector: r.sector as string | null,
    agrupamiento: r.agrupamiento as string | null,
    latitud: r.latitud as number | null,
    longitud: r.longitud as number | null,
    presencia: Boolean(r.presencia),
    verbalizacion: Boolean(r.verbalizacion),
    controlContacto: Boolean(r.controlContacto),
    controlFisico: Boolean(r.controlFisico),
    tecnicasNoLetales: Boolean(r.tecnicasNoLetales),
    fuerzaLetal: Boolean(r.fuerzaLetal),
  }
}

const SELECT_BASE = `
  SELECT
    iph.id AS id,
    COALESCE(iph.fecha_reporte, rd.fecha_reporte)::text AS fecha,
    COALESCE(iph.hora_reporte, rd.hora_reporte)::text AS hora,
    iph.rt_responsable AS "responsableTurno",
    COALESCE(rd.iph, iph.folio_iph) AS iph,
    da.ap_paterno_detenido AS "apellidoPaterno",
    da.ap_materno_detenido AS "apellidoMaterno",
    da.nombre_detenido AS nombre,
    iph.fecha_nacimiento::text AS "fechaNacimiento",
    iph.edad AS edad,
    iph.genero AS genero,
    iph.alias AS alias,
    iph.ciudad_origen AS "ciudadOrigen",
    iph.calle_detenido AS "calleDet",
    iph.numero_detenido AS numero,
    iph.colonia_detenido AS "coloniaDet",
    iph.articulo AS articulo,
    iph.tipo_falta AS "tipoFalta",
    iph.rnd AS rnd,
    iph.calle_arresto AS "lugarArresto",
    iph.colonia_arresto AS colonia,
    iph.agente_aprehensor AS "oficialQueRemite",
    COALESCE(iph.sector_arresto, rd.sector) AS sector,
    iph.agrupamiento_arresto AS agrupamiento,
    iph.latitud_arresto AS latitud,
    iph.longitud_arresto AS longitud,
    iph.presencia AS presencia,
    iph.verbalizacion AS verbalizacion,
    iph.control_contacto AS "controlContacto",
    iph.control_fisico AS "controlFisico",
    iph.tecnicas_no_letales AS "tecnicasNoLetales",
    iph.fuerza_letal AS "fuerzaLetal"
  FROM iph_detenidos iph
  LEFT JOIN ofi_reporte_denuncia rd ON rd.id = iph.reporte_denuncia_id
  LEFT JOIN ofi_reportes_campo rc ON rc.id = rd.reporte_campo_id
  LEFT JOIN ofi_detalles_asegurados da ON da.reporte_campo_id = rc.id
`

export async function listarFaltasAdministrativas(): Promise<FaltaAdministrativaRow[]> {
  const result = await query<Record<string, unknown>>(
    `${SELECT_BASE} ORDER BY fecha DESC NULLS LAST, hora DESC NULLS LAST`,
  )
  return result.rows.map(rowToFaltaAdministrativa)
}

export async function listarFaltasAdministrativasParaExportar(): Promise<FaltaAdministrativaRow[]> {
  const result = await query<Record<string, unknown>>(
    `${SELECT_BASE} ORDER BY fecha ASC NULLS LAST, hora ASC NULLS LAST`,
  )
  return result.rows.map(rowToFaltaAdministrativa)
}

const DIAS_SEMANA = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO']

function calcularDiaEvento(fechaEvento: string | null): string | null {
  if (!fechaEvento) return null
  const m = fechaEvento.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!m) return null
  const fecha = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])))
  return DIAS_SEMANA[fecha.getUTCDay()]
}

function calcularHoraPromedio(inicio: string | null, final: string | null): string | null {
  if (!inicio || !final) return null
  const [hi, mi] = inicio.split(':').map(Number)
  const [hf, mf] = final.split(':').map(Number)
  const promedio = Math.round(((hi * 60 + mi) + (hf * 60 + mf)) / 2)
  const h = Math.floor(promedio / 60) % 24
  const min = promedio % 60
  return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}:00`
}

function calcularFuero(grupoAdscripcion: string | null, override: string | null): string | null {
  if (override) return override
  if (!grupoAdscripcion) return null
  return grupoAdscripcion.toUpperCase().includes('FEDERAL') ? 'FEDERAL' : 'COMÚN'
}

// El reporte de campo captura vehículo/detenido como JSON sin esquema fijo —
// llaves observadas varían entre "placa"/"placas", "marca" a veces ausente,
// "submarca"/"niv"/"motor"/"estado" casi nunca presentes. Leer con variantes.
interface VehiculoJson {
  marca?: string; submarca?: string; tipo?: string; color?: string
  placa?: string; placas?: string; niv?: string; motor?: string; modelo?: string; estado?: string
}
interface DetenidoJson {
  nombre?: string; apellidoPaterno?: string; apellidoMaterno?: string
}

function primerVehiculo(raw: unknown): VehiculoJson | null {
  if (!Array.isArray(raw) || raw.length === 0) return null
  return raw[0] as VehiculoJson
}
function primerDetenidoJson(raw: unknown): DetenidoJson | null {
  if (!Array.isArray(raw) || raw.length === 0) return null
  return raw[0] as DetenidoJson
}

function rowToReporteIncidencia(r: Record<string, unknown>): ReporteIncidenciaCompleto {
  const horaInicioEvento = r.horaInicioEvento as string | null
  const horaFinalEvento = r.horaFinalEvento as string | null
  const fechaEvento = r.fechaEvento as string | null
  const lat = (r.latitud as string | null)
  const lon = (r.longitud as string | null)

  const vehiculoJson = primerVehiculo(r.ofiVehiculos)
  const detenidoJson = primerDetenidoJson(r.ofiDetenidos)

  const nombreAnalisis = [r.daNombre, r.daApPaterno, r.daApMaterno].filter(Boolean).join(' ').trim()
  const nombreCampo = detenidoJson
    ? [detenidoJson.nombre, detenidoJson.apellidoPaterno, detenidoJson.apellidoMaterno].filter(Boolean).join(' ').trim()
    : ''

  return {
    id: r.id as string,
    estadoCompletitud: r.completadoEn ? 'completa' : 'pendiente',
    completadoEn: r.completadoEn as string | null,
    iph: r.iph as string | null,
    folio911: r.folio911 as string | null,
    fechaEvento,
    diaEvento: calcularDiaEvento(fechaEvento),
    fechaReporte2: r.fechaReporte2 as string | null,
    horaReporte: r.horaReporte as string | null,
    horaInicioEvento,
    horaFinalEvento,
    horaPromedio: calcularHoraPromedio(horaInicioEvento, horaFinalEvento),
    delito: r.delito as string | null,
    articulosObjetos: r.articulosObjetos as string | null,
    modus: r.modus as string | null,
    calle: r.calle as string | null,
    numeroReferencia: r.numeroReferencia as string | null,
    colonia: r.colonia as string | null,
    sector: r.sector as string | null,
    rt: r.rt as string | null,
    turno: r.turno as string | null,
    crp: r.crp as string | null,
    afectado: r.afectado as string | null,
    calleAfec: r.calleAfec as string | null,
    numeroAfec: r.numeroAfec as string | null,
    coloniaAfec: r.coloniaAfec as string | null,
    telefonoAfec: r.telefonoAfec as string | null,
    marca: (r.compMarca as string | null) ?? vehiculoJson?.marca ?? null,
    submarca: (r.compSubmarca as string | null) ?? vehiculoJson?.submarca ?? null,
    tipo: (r.compTipoVehiculo as string | null) ?? vehiculoJson?.tipo ?? null,
    color: (r.compColor as string | null) ?? vehiculoJson?.color ?? null,
    placas: (r.compPlacas as string | null) ?? vehiculoJson?.placas ?? vehiculoJson?.placa ?? null,
    estadoVehiculo: (r.compEstadoVehiculo as string | null) ?? vehiculoJson?.estado ?? null,
    niv: (r.compNiv as string | null) ?? vehiculoJson?.niv ?? null,
    motor: (r.compMotor as string | null) ?? vehiculoJson?.motor ?? null,
    modelo: (r.compModelo as string | null) ?? vehiculoJson?.modelo ?? null,
    apNuc: r.apNuc as string | null,
    fuero: calcularFuero(r.grupoAdscripcion as string | null, r.fueroOverride as string | null),
    latitud: lat,
    longitud: lon,
    agenteAprehensor: r.agenteAprehensor as string | null,
    agrupamiento: r.agrupamiento as string | null,
    detenido: nombreAnalisis || nombreCampo || null,
    alias: r.alias as string | null,
    fechaNacimiento: (r.daFechaNacimiento as string | null) ?? (r.compFechaNacimiento as string | null),
    edad: r.edad as number | null,
    sexo: (r.daGenero as string | null) ?? (r.compSexo as string | null),
    calleDet: (r.daCalle as string | null) ?? (r.compCalleDet as string | null),
    numeroDet: (r.daNumero as string | null) ?? (r.compNumeroDet as string | null),
    coloniaDet: (r.daColonia as string | null) ?? (r.compColoniaDet as string | null),
    municipio: r.municipio as string | null,
    originario: (r.daOriginario as string | null) ?? (r.compOriginario as string | null),
    nucCu: (r.compNucCu as string | null) ?? (r.daCurp as string | null),
    folioRnd: r.folioRnd as string | null,
    latitud2: lat,
    longitud3: lon,
    fechaIngreso: r.fechaIngreso as string | null,
    fechaSalida: r.fechaSalida as string | null,
    otroDelito: r.otroDelito as string | null,
    masc: r.masc as string | null,
    umecas: r.umecas as string | null,
  }
}

const SELECT_REPORTE_INCIDENCIA = `
  SELECT
    inc.id AS id,
    rd.iph AS iph,
    inc.folio AS "folio911",
    inc.fecha_hora_inicio::date::text AS "fechaEvento",
    rd.fecha_reporte::text AS "fechaReporte2",
    rd.hora_reporte::text AS "horaReporte",
    inc.fecha_hora_inicio::time::text AS "horaInicioEvento",
    inc.fecha_hora_fin::time::text AS "horaFinalEvento",
    COALESCE(rd.delito, rc.delito) AS delito,
    comp.articulos_objetos AS "articulosObjetos",
    rc.modus_operandi AS modus,
    rc.ofi_calle AS calle,
    rc.ofi_referencia AS "numeroReferencia",
    rc.ofi_colonia AS colonia,
    rd.sector AS sector,
    comp.rt AS rt,
    comp.turno AS turno,
    rd.crp AS crp,
    afe.nombre AS afectado,
    comp.calle_afec AS "calleAfec",
    comp.numero_afec AS "numeroAfec",
    comp.colonia_afec AS "coloniaAfec",
    inc.telefono_reportante AS "telefonoAfec",
    rc.ofi_vehiculos AS "ofiVehiculos",
    rc.ofi_detenidos AS "ofiDetenidos",
    comp.marca AS "compMarca",
    comp.submarca AS "compSubmarca",
    comp.tipo_vehiculo AS "compTipoVehiculo",
    comp.color AS "compColor",
    comp.placas AS "compPlacas",
    comp.estado_vehiculo AS "compEstadoVehiculo",
    comp.niv AS "compNiv",
    comp.motor AS "compMotor",
    comp.modelo AS "compModelo",
    comp.ap_nuc AS "apNuc",
    rd.grupo_adscripcion AS "grupoAdscripcion",
    comp.fuero_override AS "fueroOverride",
    COALESCE(rc.ofi_latitud, rd.latitud, inc.latitud)::text AS latitud,
    COALESCE(rc.ofi_longitud, rd.longitud, inc.longitud)::text AS longitud,
    CONCAT_WS(' ', u.name, u.apellido) AS "agenteAprehensor",
    comp.agrupamiento AS agrupamiento,
    da.nombre_detenido AS "daNombre",
    da.ap_paterno_detenido AS "daApPaterno",
    da.ap_materno_detenido AS "daApMaterno",
    da.apodo AS alias,
    da.fecha_nacimiento::text AS "daFechaNacimiento",
    comp.fecha_nacimiento::text AS "compFechaNacimiento",
    comp.edad AS edad,
    da.genero AS "daGenero",
    comp.sexo AS "compSexo",
    da.calle AS "daCalle",
    comp.calle_det AS "compCalleDet",
    da.numero AS "daNumero",
    comp.numero_det AS "compNumeroDet",
    da.colonia AS "daColonia",
    comp.colonia_det AS "compColoniaDet",
    inc.municipio AS municipio,
    da.originario AS "daOriginario",
    comp.originario AS "compOriginario",
    comp.nuc_cu AS "compNucCu",
    da.curp AS "daCurp",
    comp.folio_rnd AS "folioRnd",
    COALESCE(
      comp.fecha_ingreso,
      CASE WHEN pd.hora_llegada_sede IS NOT NULL THEN (inc.fecha_hora_inicio::date + pd.hora_llegada_sede)::timestamptz END
    )::text AS "fechaIngreso",
    COALESCE(
      comp.fecha_salida,
      CASE WHEN pd.hora_inicio_traslado IS NOT NULL THEN (inc.fecha_hora_inicio::date + pd.hora_inicio_traslado)::timestamptz END
    )::text AS "fechaSalida",
    comp.otro_delito AS "otroDelito",
    comp.masc AS masc,
    comp.umecas AS umecas,
    comp.completado_en::text AS "completadoEn"
  FROM incidentes inc
  LEFT JOIN ofi_reportes_campo rc ON rc.incidente_id = inc.id
  LEFT JOIN ofi_reporte_denuncia rd ON rd.incidente_id = inc.id
  LEFT JOIN ofi_detalles_asegurados da ON da.reporte_campo_id = rc.id
  LEFT JOIN ofi_puesta_disposicion pd ON pd.reporte_campo_id = rc.id
  LEFT JOIN ofi_oficiales ofic ON ofic.id = rc.ofi_oficial_id
  LEFT JOIN users u ON u.id = ofic.user_id
  LEFT JOIN incidente_personas_afectadas afe ON afe.incidente_id = inc.id
  LEFT JOIN formato_incidencia_complemento comp ON comp.incidente_id = inc.id
  WHERE inc.estatus IN ('atendido', 'cerrado_detencion')
`

export async function listarReportesIncidencia(): Promise<ReporteIncidenciaCompleto[]> {
  const result = await query<Record<string, unknown>>(
    `${SELECT_REPORTE_INCIDENCIA} ORDER BY inc.fecha_hora_inicio DESC`,
  )
  return result.rows.map(rowToReporteIncidencia)
}

export async function listarReportesIncidenciaParaExportar(): Promise<ReporteIncidenciaCompleto[]> {
  const result = await query<Record<string, unknown>>(
    `${SELECT_REPORTE_INCIDENCIA} AND comp.completado_en IS NOT NULL ORDER BY inc.fecha_hora_inicio ASC`,
  )
  return result.rows.map(rowToReporteIncidencia)
}

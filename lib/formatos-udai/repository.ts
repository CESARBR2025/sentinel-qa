import { query } from '@/lib/db'
import type { FaltaAdministrativaRow } from './types'

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

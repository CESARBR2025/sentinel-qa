import {
  listarIncidentesConFiltros,
  obtenerIncidenteCompleto,
  obtenerDespachoDeIncidente,
  obtenerUnidadesDeDespacho,
  obtenerElementosDeDespacho,
  obtenerReporteCampoDeIncidente,
  listarIncidentesGeo,
  obtenerKpiIncidencias,
} from './repository'
// Composición cross-dominio (permitida solo en service): cierre vive en lib/oficial
import { obtenerCierrePorIncidente } from '@/lib/oficial/repository'
import type { IncidenteFiltros, IncidenteListItem, IncidenteGeoFiltros, KpiGeoResponse, HistorialIncidente } from './types'

export async function listarConFiltros(filtros: IncidenteFiltros): Promise<IncidenteListItem[]> {
  return listarIncidentesConFiltros(filtros)
}

const RANGO_DEFAULT_MS = 24 * 60 * 60 * 1000
const RANGO_MAX_MS = 366 * 24 * 60 * 60 * 1000

// Normaliza el rango: default últimas 24 h, invierte los extremos si vienen al
// revés y recorta rangos absurdos para no barrer la tabla completa.
export function normalizarRangoGeo(filtros: Partial<IncidenteGeoFiltros>): IncidenteGeoFiltros {
  const ahora = Date.now()
  const hastaMs = filtros.hasta ? Date.parse(filtros.hasta) : NaN
  const desdeMs = filtros.desde ? Date.parse(filtros.desde) : NaN

  let hasta = Number.isNaN(hastaMs) ? ahora : hastaMs
  let desde = Number.isNaN(desdeMs) ? hasta - RANGO_DEFAULT_MS : desdeMs
  if (desde > hasta) [desde, hasta] = [hasta, desde]
  if (hasta - desde > RANGO_MAX_MS) desde = hasta - RANGO_MAX_MS

  return {
    desde: new Date(desde).toISOString(),
    hasta: new Date(hasta).toISOString(),
    estatus: filtros.estatus ?? null,
    canal: filtros.canal ?? null,
    prioridadId: filtros.prioridadId ?? null,
    tipoIncidenteId: filtros.tipoIncidenteId ?? null,
  }
}

export async function getKpiGeo(filtros: Partial<IncidenteGeoFiltros>): Promise<KpiGeoResponse> {
  const rango = normalizarRangoGeo(filtros)
  const [incidentes, kpi] = await Promise.all([
    listarIncidentesGeo(rango),
    obtenerKpiIncidencias(rango),
  ])
  return { incidentes, kpi }
}

export async function obtenerHistorialCompleto(incidenteId: string): Promise<HistorialIncidente | null> {
  const incidente = await obtenerIncidenteCompleto(incidenteId)
  if (!incidente) return null

  const despachoBase = await obtenerDespachoDeIncidente(incidenteId)
  const [unidades, elementos] = despachoBase
    ? await Promise.all([
        obtenerUnidadesDeDespacho(despachoBase.id),
        obtenerElementosDeDespacho(despachoBase.id),
      ])
    : [[], []]

  // Cierre vigente (ofi_reportes_campo); fallback a legacy incidente_reporte_campo
  const cierreOfi = await obtenerCierrePorIncidente(incidenteId)
  const cierreLegacy = cierreOfi ? null : await obtenerReporteCampoDeIncidente(incidenteId)

  return {
    generacion: {
      folio: incidente.folio,
      canal: incidente.canal,
      origenRondin: Boolean(incidente.origenRondin),
      nombreReportante: incidente.nombreReportante,
      descripcion: incidente.descripcion,
      tipoIncidente: incidente.tipoIncidente,
      prioridad: incidente.prioridad,
      calle: incidente.calle,
      colonia: incidente.colonia,
      fechaHoraInicio: incidente.fechaHoraInicio,
      capturadoPorNombre: incidente.capturadoPorNombre,
    },
    despacho: despachoBase
      ? {
          fechaHoraDespacho: despachoBase.fechaHoraDespacho,
          despachadorNombre: despachoBase.despachadorNombre,
          unidades,
          elementos,
        }
      : null,
    cierre: cierreOfi
      ? {
          reporteCampoId: cierreOfi.reporteCampoId,
          folioReporteCampo: cierreOfi.folioReporteCampo,
          acciones: cierreOfi.acciones,
          hayDetencion: cierreOfi.hayDetencion,
          autoridadRecibe: cierreOfi.autoridadRecibe,
          oficialNombre: cierreOfi.oficialNombre,
          fechaCierre: cierreOfi.fechaCierre,
          legacy: false,
        }
      : cierreLegacy
        ? {
            reporteCampoId: cierreLegacy.id,
            folioReporteCampo: null,
            acciones: cierreLegacy.accionesRealizadas,
            hayDetencion: Boolean(cierreLegacy.hayDetencion),
            autoridadRecibe: cierreLegacy.autoridadRecibe,
            oficialNombre: cierreLegacy.capturadoPorNombre,
            fechaCierre: cierreLegacy.creadoEn,
            legacy: true,
          }
        : null,
    d1: cierreOfi?.d1Folio
      ? {
          folioDenuncia: cierreOfi.d1Folio,
          estadoTramite: cierreOfi.d1EstadoTramite,
          fechaCreacion: cierreOfi.d1FechaCreacion,
        }
      : null,
  }
}
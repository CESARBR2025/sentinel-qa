import {
  listarIncidentesConFiltros,
  obtenerIncidenteCompleto,
  obtenerDespachoDeIncidente,
  obtenerUnidadesDeDespacho,
  obtenerElementosDeDespacho,
  obtenerReporteCampoDeIncidente,
} from './repository'
// Composición cross-dominio (permitida solo en service): cierre vive en lib/oficial
import { obtenerCierrePorIncidente } from '@/lib/oficial/repository'
import type { IncidenteFiltros, IncidenteListItem, HistorialIncidente } from './types'

export async function listarConFiltros(filtros: IncidenteFiltros): Promise<IncidenteListItem[]> {
  return listarIncidentesConFiltros(filtros)
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
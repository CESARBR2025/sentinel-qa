import {
  insertarReporteCampo,
  verificarReporteCampo,
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

export async function crearReporteCampo(params: {
    incidenteId: string
    contenidoReporte: string | null
    lugarCalle: string | null
    lugarColonia: string | null
    lugarEntreCalles: string | null
    lugarReferencia: string | null
    datosPositivosNegativos: string | null
    accionesRealizadas: string | null
    hayDetencion: boolean
    nombreDetenidos: string | null
    autoridadRecibe: string | null
    expedienteCi: string | null
    delitoFalta: string | null
    hayRobo: boolean
    montoRobo: number | null
    objetosRecuperados: string | null
    hayVehiculo: boolean
    vehiculos: object[]
    hayCateo: boolean
    domicilioCateado: string | null
    cateoCalle: string | null
    cateoColonia: string | null
    cateoLatitud: string | null
    cateoLongitud: string | null
    resultadoCateo: string | null
    policiaACargo: string | null
    personalIngresoCi: string | null
    capturadoPor: string
    hayOrdenAprehension: boolean
    ordenesAprehension: object[]
    hayHidrocarburo: boolean
    hidrocarburos: object[]
    hayArmaFuego: boolean
    armasFuego: object[]
    hayDroga: boolean
    drogas: object[]
    observaciones: string | null
    apoyoFiestasPatronales: boolean
    operativosMetropolitano: boolean
    eco8: boolean
    alcoholimetria: boolean
    motocicletas: boolean
    apoyoActuarios: boolean
    apoyoCateosFgr: boolean
    apoyoCateosFge: boolean
}) {
    const { inc, existe } = await verificarReporteCampo(params.incidenteId)

    if (!inc) throw new Error('Incidente no encontrado')
    if (inc.estatus === 'atendido') throw new Error('El incidente ya está atendido')
    if (inc.estatus === 'sin_despachar') throw new Error('El incidente debe estar en_despacho antes de reportar')
    if (existe) throw new Error('El incidente ya tiene un reporte de campo')

    if (params.montoRobo !== null && (params.montoRobo < 0 || !Number.isInteger(params.montoRobo)))
        throw new Error('montoRobo debe ser un entero positivo')

    await insertarReporteCampo(params)

    return { estatusAnterior: inc.estatus }
}
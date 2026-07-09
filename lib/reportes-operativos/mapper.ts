import type {
  VehiculoRow, CateoRow, DetencionOfiRow, DetencionIncRow,
  OrdenAprehensionRow, HidrocarburoRow, ArmaRow, DrogaRow,
  ExtorsionRow, ReporteCampoGeneralRow, ReporteCampoIncidenteGeneralRow,
} from './types'

function toStr(val: unknown): string | null {
  if (val === null || val === undefined) return null
  if (val instanceof Date) return val.toISOString()
  return String(val)
}

function toNum(val: unknown): number | null {
  if (val === null || val === undefined) return null
  const n = Number(val)
  return isNaN(n) ? null : n
}

export { toStr, toNum }

export function rowToVehiculo(row: Record<string, unknown>): VehiculoRow {
  return {
    fecha: row.fecha ?? null,
    folio: toStr(row.folio),
    seguimiento: toStr(row.seguimiento),
    vehiculo: row.vehiculo ?? null,
  }
}

export function rowToCateo(row: Record<string, unknown>): CateoRow {
  return {
    fecha: row.fecha ?? null,
    folio: toStr(row.folio),
    ubicacion: toStr(row.ubicacion),
    dependencia: toStr(row.dependencia),
    seguimiento: toStr(row.seguimiento),
  }
}

export function rowToDetencionOfi(row: Record<string, unknown>): DetencionOfiRow {
  return {
    fecha: row.fecha ?? null,
    folio: toStr(row.folio),
    detenidos: row.detenidos ?? null,
    fiscalia: toStr(row.fiscalia),
    seguimiento: toStr(row.seguimiento),
  }
}

export function rowToDetencionInc(row: Record<string, unknown>): DetencionIncRow {
  return {
    fecha: row.fecha ?? null,
    folio: toStr(row.folio),
    nombre: toStr(row.nombre),
    fiscalia: toStr(row.fiscalia),
    seguimiento: toStr(row.seguimiento),
  }
}

export function rowToOrdenAprehension(row: Record<string, unknown>): OrdenAprehensionRow {
  return {
    fecha: row.fecha ?? null,
    folio: toStr(row.folio),
    ordenes: row.ordenes ?? null,
    seguimientoReporte: toStr(row.seguimiento_reporte),
  }
}

export function rowToHidrocarburo(row: Record<string, unknown>): HidrocarburoRow {
  return {
    fecha: row.fecha ?? null,
    folio: toStr(row.folio),
    hidrocarburos: row.hidrocarburos ?? null,
    seguimientoReporte: toStr(row.seguimiento_reporte),
  }
}

export function rowToArma(row: Record<string, unknown>): ArmaRow {
  return {
    fecha: row.fecha ?? null,
    folio: toStr(row.folio),
    armas: row.armas ?? null,
    seguimientoReporte: toStr(row.seguimiento_reporte),
  }
}

export function rowToDroga(row: Record<string, unknown>): DrogaRow {
  return {
    fecha: row.fecha ?? null,
    folio: toStr(row.folio),
    drogas: row.drogas ?? null,
    seguimientoReporte: toStr(row.seguimiento_reporte),
  }
}

export function rowToExtorsion(row: Record<string, unknown>): ExtorsionRow {
  return {
    folio: toStr(row.folio),
    telefono: toStr(row.telefono),
    fecha: row.fecha ?? null,
    incidencia: toStr(row.incidencia),
  }
}

export function rowToReporteCampoGeneral(row: Record<string, unknown>): ReporteCampoGeneralRow {
  return {
    fecha: row.fecha ?? null,
    folio: toStr(row.folio),
    oficial: toStr(row.oficial),
    hayCateo: row.hay_cateo ?? null,
    cateoData: row.cateo_data ?? null,
    hayDetencion: row.hay_detencion ?? null,
    detenidosData: row.detenidos_data ?? null,
    hayVehiculo: row.hay_vehiculo ?? null,
    vehiculosData: row.vehiculos_data ?? null,
    hayArma: row.hay_arma ?? null,
    armasData: row.armas_data ?? null,
    hayDroga: row.hay_droga ?? null,
    drogasData: row.drogas_data ?? null,
    hayHidro: row.hay_hidro ?? null,
    hidroData: row.hidro_data ?? null,
    hayOrden: row.hay_orden ?? null,
    ordenesData: row.ordenes_data ?? null,
    hayRobo: row.hay_robo ?? null,
    montoRobo: row.monto_robo ?? null,
    objetos: toStr(row.objetos),
  }
}

export function rowToReporteCampoIncidenteGeneral(row: Record<string, unknown>): ReporteCampoIncidenteGeneralRow {
  return {
    fecha: row.fecha ?? null,
    folio: toStr(row.folio),
    oficial: toStr(row.oficial),
    hayCateo: row.hay_cateo ?? null,
    cateoCalle: toStr(row.cateo_calle),
    cateoColonia: toStr(row.cateo_colonia),
    hayDetencion: row.hay_detencion ?? null,
    detenidosData: row.detenidos_data ?? null,
    hayVehiculo: row.hay_vehiculo ?? null,
    vehiculosData: row.vehiculos_data ?? null,
    hayArma: row.hay_arma ?? null,
    armasData: row.armas_data ?? null,
    hayDroga: row.hay_droga ?? null,
    drogasData: row.drogas_data ?? null,
    hayHidro: row.hay_hidro ?? null,
    hidroData: row.hidro_data ?? null,
    hayOrden: row.hay_orden ?? null,
    ordenesData: row.ordenes_data ?? null,
    hayRobo: row.hay_robo ?? null,
    montoRobo: row.monto_robo ?? null,
    objetos: toStr(row.objetos),
  }
}

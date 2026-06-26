import type { OfiReporteCampo, OfiOficial, OfiDetenido, OfiVehiculo, OfiCateo } from './types'

function parseJsonField<T>(val: unknown): T {
  if (!val) return (typeof val === 'string' ? JSON.parse(val) : val) ?? ([] as unknown as T)
  if (typeof val === 'string') return JSON.parse(val) as T
  return val as T
}

export function rowToReporteCampo(row: Record<string, unknown>): OfiReporteCampo {
  return {
    id:                  String(row.id ?? ''),
    ofiFolioCad:         String(row.ofi_folio_cad ?? ''),
    ofiNombreReportante: (row.ofi_nombre_reportante as string) ?? null,
    ofiAnonimo:          Boolean(row.ofi_anonimo),
    ofiTipoIncidente:    (row.ofi_tipo_incidente as string) ?? null,
    ofiTipoEmergencia:   (row.ofi_tipo_emergencia as string) ?? null,
    ofiPrioridad:        (row.ofi_prioridad as string) ?? null,
    ofiDescripcion:      (row.ofi_descripcion as string) ?? null,
    ofiContenidoReporte: (row.ofi_contenido_reporte as string) ?? null,
    ofiCalle:            (row.ofi_calle as string) ?? null,
    ofiColonia:          (row.ofi_colonia as string) ?? null,
    ofiLatitud:          row.ofi_latitud ? Number(row.ofi_latitud) : null,
    ofiLongitud:         row.ofi_longitud ? Number(row.ofi_longitud) : null,
    ofiDatosPn:          (row.ofi_datos_pn as string) ?? null,
    ofiAcciones:         (row.ofi_acciones as string) ?? null,
    ofiHayDetencion:     Boolean(row.ofi_hay_detencion),
    ofiDetenidos:        parseJsonField<OfiDetenido[]>(row.ofi_detenidos),
    ofiAutoridadRecibe:  (row.ofi_autoridad_recibe as string) ?? null,
    ofiMontoRobo:        row.ofi_monto_robo ? Number(row.ofi_monto_robo) : null,
    ofiObjetosRecuperados: (row.ofi_objetos_recuperados as string) ?? null,
    ofiHayVehiculo:      Boolean(row.ofi_hay_vehiculo),
    ofiVehiculos:        parseJsonField<OfiVehiculo[]>(row.ofi_vehiculos),
    ofiHayCateo:         Boolean(row.ofi_hay_cateo),
    ofiCateo:            parseJsonField<OfiCateo | null>(row.ofi_cateo),
    ofiResultadoCateo:   (row.ofi_resultado_cateo as string) ?? null,
    ofiOficialId:        String(row.ofi_oficial_id ?? ''),
    ofiOficialNombre:    String(row.ofi_oficial_nombre ?? ''),
    ofiEstatus:          String(row.ofi_estatus ?? 'registrado'),
    createdAt:           String(row.created_at ?? ''),
    updatedAt:           String(row.updated_at ?? ''),
  }
}

export function rowToOficial(row: Record<string, unknown>): OfiOficial {
  return {
    id:                     String(row.id ?? ''),
    ofiNombre:              String(row.ofi_nombre ?? ''),
    ofiApPaterno:           String(row.ofi_ap_paterno ?? ''),
    ofiApMaterno:           (row.ofi_ap_materno as string) ?? null,
    ofiPlacaUnidadAsignada: (row.ofi_placa_unidad_asignada as string) ?? null,
    userId:                 (row.user_id as string) ?? null,
    ofiEstatus:             String(row.ofi_estatus ?? 'activo'),
    createdAt:              String(row.created_at ?? ''),
    updatedAt:              String(row.updated_at ?? ''),
  }
}

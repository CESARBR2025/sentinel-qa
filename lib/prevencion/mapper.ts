import type { AutoridadAdicional, BusquedaItem, Contestacion, FichaBusquedaDetalle, MedidaDetalle, MedidaItem, SeguimientoBusqueda, SolicitudC4, SolicitudInformacion, VisitaDomiciliaria } from './types'

function toStr(val: unknown): string | null {
  if (val === null || val === undefined) return null
  if (val instanceof Date) return val.toISOString()
  return String(val)
}

function toBool(val: unknown): boolean {
  if (typeof val === 'boolean') return val
  if (typeof val === 'string') return val === 'true'
  return Boolean(val)
}

export function rowToMedida(row: Record<string, unknown>): MedidaItem {
  return {
    id: String(row.id ?? ''),
    folio: String(row.folio ?? ''),
    nombre: String(row.nombre ?? ''),
    ubicacion: toStr(row.ubicacion),
    fechaInicio: toStr(row.fecha_inicio),
    fechaFin: toStr(row.fecha_fin),
    estatus: toStr(row.estatus),
    createdAt: toStr(row.created_at) ?? '',
  }
}

export function rowToBusqueda(row: Record<string, unknown>): BusquedaItem {
  return {
    id: String(row.id ?? ''),
    folio: String(row.folio ?? ''),
    personas: toStr(row.personas),
    ubicacion: toStr(row.ubicacion),
    fecha: toStr(row.fecha),
    estatus: toStr(row.estatus),
    createdAt: toStr(row.created_at) ?? '',
  }
}

export function rowToSolicitud(row: Record<string, unknown>): SolicitudInformacion {
  return {
    id: String(row.id ?? ''),
    oficio: String(row.oficio ?? ''),
    autoridad: String(row.autoridad ?? ''),
    delito: row.delito ? String(row.delito) : null,
    carpeta_investigacion: row.carpeta_investigacion ? String(row.carpeta_investigacion) : null,
    fecha_activacion: toStr(row.fecha_activacion) ?? '',
    status: String(row.status ?? ''),
    enlace: toStr(row.enlace),
    fiscal_solicita: toStr(row.fiscal_solicita),
    solicitud_texto: toStr(row.solicitud_texto),
    fecha_aceptacion: toStr(row.fecha_aceptacion),
  }
}

export function rowToMedidaDetalle(row: Record<string, unknown>): MedidaDetalle {
  return {
    id: String(row.id ?? ''),
    expediente: String(row.expediente ?? ''),
    victima: String(row.victima ?? ''),
    autoridad: String(row.autoridad ?? ''),
    n_oficio: String(row.n_oficio ?? ''),
    fecha_oficio: toStr(row.fecha_oficio),
    fecha_recepcion: toStr(row.fecha_recepcion),
    persona_recepciona: toStr(row.persona_recepciona),
    nombre_autoridad: toStr(row.nombre_autoridad),
    delitos: toStr(row.delitos),
    demandado: toStr(row.demandado),
    tipo_medida: toStr(row.tipo_medida),
    domicilio_proteccion: String(row.domicilio_proteccion ?? ''),
    colonia: toStr(row.colonia),
    telefono: toStr(row.telefono),
    tiempo_medida: toStr(row.tiempo_medida),
    fecha_vencimiento: toStr(row.fecha_vencimiento),
    tipo_apercibimiento: toStr(row.tipo_apercibimiento),
    prorrogada: toBool(row.prorrogada),
    archivo_prorroga_url: toStr(row.archivo_prorroga_url),
    fecha_oficio_prorroga: toStr(row.fecha_oficio_prorroga),
    observaciones: toStr(row.observaciones),
    createdAt: toStr(row.created_at) ?? '',
  }
}

export function rowToFichaBusquedaDetalle(row: Record<string, unknown>): FichaBusquedaDetalle {
  return {
    id: String(row.id ?? ''),
    tipo: String(row.tipo ?? ''),
    folio: toStr(row.folio),
    nombre_desaparecida: String(row.nombre_desaparecida ?? ''),
    edad: row.edad != null ? Number(row.edad) : null,
    fecha_activacion: toStr(row.fecha_activacion) ?? '',
    fecha_aceptacion: toStr(row.fecha_aceptacion),
    carpeta_investigacion: toStr(row.carpeta_investigacion),
    enlace: toStr(row.enlace),
    rt_atiende: toStr(row.rt_atiende),
    elemento_novedades: toStr(row.elemento_novedades),
    fecha_cancelacion: toStr(row.fecha_cancelacion),
    fiscal_cancela: toStr(row.fiscal_cancela),
    motivo_cancelacion: toStr(row.motivo_cancelacion),
    status: String(row.status ?? ''),
  }
}

export function rowToSeguimiento(row: Record<string, unknown>): SeguimientoBusqueda {
  return {
    id: String(row.id ?? ''),
    tipo: String(row.tipo ?? ''),
    fecha_hora_envio: toStr(row.fecha_hora_envio) ?? '',
    archivo_url: toStr(row.archivo_url),
    registrado_por: toStr(row.registrado_por),
    nombre_usuario: toStr(row.nombre_usuario),
    apellido_usuario: toStr(row.apellido_usuario),
  }
}

export function rowToSolicitudC4(row: Record<string, unknown>): SolicitudC4 {
  return {
    id: String(row.id ?? ''),
    solicitud_id: String(row.solicitud_id ?? ''),
    descripcion_evidencias: String(row.descripcion_evidencias ?? ''),
    status: String(row.status ?? ''),
    creado_por: toStr(row.creado_por),
    creado_en: toStr(row.creado_en) ?? '',
  }
}

export function rowToContestacion(row: Record<string, unknown>): Contestacion {
  return {
    id: String(row.id ?? ''),
    solicitud_id: String(row.solicitud_id ?? ''),
    fecha_contestacion: toStr(row.fecha_contestacion) ?? '',
    archivo_pdf_url: toStr(row.archivo_pdf_url),
    fecha_entrega: toStr(row.fecha_entrega),
    hora_entrega: toStr(row.hora_entrega),
    nombre_quien_recibio: toStr(row.nombre_quien_recibio),
    creado_por: toStr(row.creado_por),
    creado_en: toStr(row.creado_en) ?? '',
  }
}

export function rowToVisita(row: Record<string, unknown>): VisitaDomiciliaria {
  return {
    id: String(row.id ?? ''),
    medida_id: String(row.medida_id ?? ''),
    fecha_visita: toStr(row.fecha_visita) ?? '',
    hora_visita: toStr(row.hora_visita),
    resultado: toStr(row.resultado),
    apercibimiento_aplicado: toBool(row.apercibimiento_aplicado),
    registrado_por: toStr(row.registrado_por),
    creado_en: toStr(row.creado_en) ?? '',
  }
}

export function rowToAutoridadAdicional(row: Record<string, unknown>): AutoridadAdicional {
  return {
    id: String(row.id ?? ''),
    medida_id: String(row.medida_id ?? ''),
    autoridad: String(row.autoridad ?? ''),
    n_oficio: toStr(row.n_oficio),
    fecha_oficio: toStr(row.fecha_oficio),
    creado_por: toStr(row.creado_por),
    creado_en: toStr(row.creado_en) ?? '',
  }
}

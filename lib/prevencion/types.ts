export interface MedidaItem {
  id: string
  folio: string
  nombre: string
  ubicacion: string | null
  fechaInicio: string | null
  fechaFin: string | null
  estatus: string | null
  createdAt: string
}

export interface BusquedaItem {
  id: string
  folio: string
  personas: string | null
  ubicacion: string | null
  fecha: string | null
  estatus: string | null
  createdAt: string
}

export interface SolicitudInformacion {
  id: string
  oficio: string
  autoridad: string
  delito: string | null
  carpeta_investigacion: string | null
  fecha_activacion: string
  status: string
  enlace: string | null
  fiscal_solicita: string | null
  solicitud_texto: string | null
  fecha_aceptacion: string | null
}

export interface MedidaDetalle {
  id: string
  expediente: string
  victima: string
  autoridad: string
  n_oficio: string
  fecha_oficio: string | null
  fecha_recepcion: string | null
  persona_recepciona: string | null
  nombre_autoridad: string | null
  delitos: string | null
  demandado: string | null
  tipo_medida: string | null
  domicilio_proteccion: string
  colonia: string | null
  telefono: string | null
  tiempo_medida: string | null
  fecha_vencimiento: string | null
  tipo_apercibimiento: string | null
  prorrogada: boolean
  archivo_prorroga_url: string | null
  fecha_oficio_prorroga: string | null
  observaciones: string | null
  createdAt: string
}

export interface FichaBusquedaDetalle {
  id: string
  tipo: string
  folio: string | null
  nombre_desaparecida: string
  edad: number | null
  fecha_activacion: string
  fecha_aceptacion: string | null
  carpeta_investigacion: string | null
  enlace: string | null
  rt_atiende: string | null
  elemento_novedades: string | null
  fecha_cancelacion: string | null
  fiscal_cancela: string | null
  motivo_cancelacion: string | null
  status: string
}

export interface SeguimientoBusqueda {
  id: string
  tipo: string
  fecha_hora_envio: string
  archivo_url: string | null
  registrado_por: string | null
  nombre_usuario: string | null
  apellido_usuario: string | null
}

export interface SolicitudC4 {
  id: string
  solicitud_id: string
  descripcion_evidencias: string
  status: string
  creado_por: string | null
  creado_en: string
}

export interface Contestacion {
  id: string
  solicitud_id: string
  fecha_contestacion: string
  archivo_pdf_url: string | null
  fecha_entrega: string | null
  hora_entrega: string | null
  nombre_quien_recibio: string | null
  creado_por: string | null
  creado_en: string
}

export interface VisitaDomiciliaria {
  id: string
  medida_id: string
  fecha_visita: string
  hora_visita: string | null
  resultado: string | null
  apercibimiento_aplicado: boolean
  registrado_por: string | null
  creado_en: string
}

export interface AutoridadAdicional {
  id: string
  medida_id: string
  autoridad: string
  n_oficio: string | null
  fecha_oficio: string | null
  creado_por: string | null
  creado_en: string
}

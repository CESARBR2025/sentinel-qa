export interface UserInfo {
  name: string
  apellido?: string
  email: string
}

export interface SolicitudRow {
  id: string
  folio: string
  placa: string
  estatusDependencia: string
  motivoRetencion: string | null
  createdAt: string
  nombreInfractor: string | null
  correoInfractor: string | null
  urlOrdenSalida: string | null
  urlOficioPagoCorralon: string | null
  nombreTitular: string | null
  apellidoPaternoTitular: string | null
  apellidoMaternoTitular: string | null
  correoTitular: string | null
}

export interface TabSolicitudes {
  pendientes: SolicitudRow[]
  finalizadas: SolicitudRow[]
}

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
}

export interface SolicitudesResponse {
  data: SolicitudRow[]
  total: number
}

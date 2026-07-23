export interface UserInfo {
  name: string;
  apellido?: string;
  email: string;
}

export interface RolRow {
  rol: string;
}

export interface LiberacionRow {
  id: string;
  folio: string;
  estatusInfraccion: string;
  placa: string;
  created_at: string;
  correo_infractor: string;
  nombre_infractor: string;
  estatusDependencia: string;
  tipoGarantia: string;
  no_carpeta_investigacion: string;
  url_orden_salida_liberaciones?: string;
}

export interface LiberacionesResponse {
  data: LiberacionRow[];
  total: number;
}

import type { ViaInfraccionDetalle } from '@/lib/shared/infracciones'

export type { ViaInfraccionDetalle }

export interface CapturaInfractorInput {
  id: string
  es_titular: boolean
  nombre_infractor: string
  appaterno_infractor: string
  apmaterno_infractor: string
  curp_infractor: string
  correo_infractor: string
  nombre_titular: string
  appaterno_titular: string
  apmaterno_titular: string
  curp_titular: string
  correo_titular: string
}

export interface CapturaInfractorResult {
  success: boolean
  error?: string
  data?: {
    id: string
    folio: string
    orden_pago_id?: string | null
    url_pago?: string | null
  }
}

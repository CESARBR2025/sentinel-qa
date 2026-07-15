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
  no_carpeta_investigacion: string;
  url_orden_salida_liberaciones?: string;
}

export interface LiberacionesResponse {
  data: LiberacionRow[];
  total: number;
}

import type { ViaInfraccionDetalle } from '@/lib/shared/infracciones'

export type { ViaInfraccionDetalle }

export interface UserInfo {
  name: string;
  apellido?: string;
  email: string;
}

export interface RolRow {
  rol: string;
}

export type EstatusDependenciaLiberacion =
  | 'VEHICULO_EN_CORRALON'
  | 'MESA_DE_CONTROL_PENDIENTE_DOCS'
  | 'MESA_DE_CONTROL_REVISION'
  | 'MESA_DE_CONTROL_RECHAZADA'
  | 'PENDIENTE_PAGO_LIBERACION'
  | 'LIBERACION_EN_PROCESO'
  | 'LIBERACION_PENDIENTE_DOCUMENTOS'
  | 'LIBERADA_POR_INFRACCION'
  | 'LIBERADA_POR_DELITO'
  | 'LIBERADA_POR_ACCIDENTE'
  | 'FINALIZADA_ACCIDENTE'
  | 'FINALIZADA_INFRACCION'
  | 'FINALIZADA_DELITO'

export type EstatusInfraccionLiberacion =
  | 'REGISTRADA'
  | 'PENDIENTE_PAGO'
  | 'CERRADA'
  | 'FINALIZADA'

export interface LiberacionRow {
  id: string;
  folio: string;
  estatusInfraccion: EstatusInfraccionLiberacion;
  placa: string;
  created_at: string;
  correo_infractor: string;
  nombre_infractor: string;
  estatusDependencia: EstatusDependenciaLiberacion;
  no_carpeta_investigacion: string;
  url_orden_salida_liberaciones?: string;
}

export interface LiberacionesResponse {
  data: LiberacionRow[];
  total: number;
}

import type { ViaInfraccionDetalle } from '@/lib/shared/infracciones'

export type { ViaInfraccionDetalle }

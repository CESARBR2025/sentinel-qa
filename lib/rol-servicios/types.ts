export type Turno = 'PRIMERO' | 'SEGUNDO' | 'TERCERO'

export interface ServiceRow {
  id: string
  unidad: string
  nomina: string
  nombre: string
  zona: string
  gpsRadio: string
  bodyCam: string
}

export interface RolServicio {
  id: string
  folio: string
  folioConsecutivo: number
  turno: string
  horarioInicio: string | null
  horarioFin: string | null
  responsableTurno: string | null
  sectorId: number | null
  fecha: string
  fundamentoLegal: string | null
  status: string
  creadoPor: string
  firmaResponsableUrl: string | null
  firmaJefeSectorialUrl: string | null
  firmadoPor: string | null
  firmadoEn: string | null
  actualizadoEn: string | null
  creadoEn: string
}

export interface RolAsignacion {
  id: string
  rolId: string
  seccion: string
  unidadExtId: string | null
  unidadPlaca: string | null
  elementoExtId: string | null
  elementoNomina: string | null
  elementoNombre: string | null
  zona: string | null
  servicio: string | null
  radioId: number | null
  bodyCamId: number | null
  orden: number
}

export interface RolEstadoFuerza {
  id: string
  rolId: string
  conceptoId: number
  cantidad: number
}

export interface RolObservacion {
  id: string
  rolId: string
  tipoId: number
  descripcion: string | null
}

export interface Sector {
  id: number
  nombre: string
  clave: string
  activo: boolean
}

export interface Radio {
  id: number
  codigo: string
  tipo: string | null
  estado: string
  activo: boolean
}

export interface BodyCam {
  id: number
  codigo: string
  estado: string
  activo: boolean
}

export interface EstadoFuerzaConcepto {
  id: number
  nombre: string
  codigo: string
  grupo: string | null
  orden: number
  activo: boolean
}

export interface TipoObservacion {
  id: number
  nombre: string
  codigo: string
  activo: boolean
}

export interface TipoEmergencia {
  id: number
  clave: string
  nombre: string
  activo: boolean
}

export interface MedioCanalizacion {
  id: number
  clave: string
  nombre: string
  activo: boolean
}

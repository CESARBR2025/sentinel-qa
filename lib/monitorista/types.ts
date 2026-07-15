export interface MonitoristaStats {
  solicitudesPendientes: number
  solicitudesCompletadas: number
  historialCount: number
  detenidosPendientes: number
  detenidosCompletados: number
  incidentesCamaraStats: { personas: number; vehiculos: number } | null
}

export interface SolicitudEvidencia {
  id: string
  incidenteId: string
  folioIncidente: string | null
  solicitadoNombre: string
  descripcion: string
  status: string
  creadoEn: string | null
  completadoEn: string | null
  totalEvidencias: number
}

export interface Evidencia {
  id: string
  tipo: string
  nombreOriginal: string | null
  urlExpediente: string | null
  subidoPorNombre: string | null
  creadoEn: string | null
}

export interface HistorialEntry {
  id: string
  accion: string
  incidenteId: string | null
  solicitudId: string | null
  creadoEn: string | null
  monitoristaNombre: string | null
  folioIncidente: string | null
  folioDetenido: string | null
  icFecha: string | null
  icTurno: string | null
}

export interface SolicitudEvidenciaJson {
  solicitudId: number
  fechaPeticion: string
  colonia: string
  calle: string
  numero: string
  horaInicio: string
  horaFin: string
  atendida: boolean
}

export interface DenunciaDetalle {
  id: string
  folioDenuncia: string
  iph: string | null
  delito: string | null
  tipoEvento: string | null
  lugarHecho: string | null
  coloniaHecho: string | null
  fechaReporte: string | null
  horaReporte: string | null
  policiaACargo: string | null
  capturadoPor: string | null
  estadoTramite: string
  estadoEvidencia: string
  createdAt: string
  monitoristaFechasRequeridas: SolicitudEvidenciaJson[]
}

export interface EvidenciaArchivo {
  id: number
  solicitudId: number
  urlArchivo: string
  nombreArchivo: string | null
}

export interface Dependencia {
  id: number
  clave: string
  nombre: string
}

export interface SolicitudFoto {
  id: string
  tipoFoto: string
  enviadoA: string | null
  estado: string
}

export interface ReporteDetenido {
  id: string
  folioDetenido: string
  nombreDetenido: string
  tipoIncidente: string | null
  delitoDenuncia: string | null
  marcoLegal: string | null
  faltaAdministrativa: string | null
  modusOperandi: string | null
  autoridadRecibe: string | null
  oficialNombre: string | null
  hayDetencion: boolean
  hayVehiculo: boolean
  hayCateo: boolean
  createdAt: string
  fotos: SolicitudFoto[]
}

export type Turno = 'MATUTINO' | 'VESPERTINO' | 'NOCTURNO'

export interface IncidenteCamara {
  id: string
  fecha: string
  turno: Turno
  registradoPor: string
  personasSinNovedad: number
  personasConAntecedentes: number
  totalPersonasRevisadas: number
  vehiculosRevisar: number
  vehiculosRepuve: number
  motosRevisadas: number
  persecuciones: number
  aseguradosCamara: number
  vehiculosRecuperados: number
  incendios: number
  hechosTransito: number
}

export interface IphDetenido {
  id: string
  folioIPH: string | null
  alias: string | null
  delito: string | null
  fechaEvento: string | null
  genero: string | null
}

export interface EvidenciaDetenido {
  id: string
  tipoFoto: string
  urlArchivo: string | null
  nombreArchivo: string | null
  subidoPor: string | null
  rolSubio: string | null
}

export interface PrellenadoCompleto {
  nombreDetenido: string | null
  folio: string | null
  fechaNacimiento: string | null
  origen: string | null
  genero: string | null
  domicilio: string | null
  eventosDelictivos: string | null
  fechaHora: string | null
  rnd: string | null
  expediente: string | null
  lugarEvento: string | null
  lugarDetencion: string | null
  iph: string | null
  nexosDelictivos: string | null
  zonaOperacion: string | null
  puestaDisposicion: string | null
  modusOperandi: string | null
  infoAdicional: string | null
  antecedentes: string | null
  faltasAdmin: string | null
}

export interface FichaInteligenciaData {
  nombreDetenido: string | null
  folio: string | null
  fotoFrontalUrl: string | null
  fotoObjetosUrl: string | null
  fechaNacimiento: string | null
  origen: string | null
  genero: string | null
  escolaridad: string | null
  estadoCivil: string | null
  ocupacion: string | null
  domicilio: string | null
  rasgosParticulares: string | null
  eventosDelictivos: string | null
  fechaHora: string | null
  rnd: string | null
  iph: string | null
  expediente: string | null
  lugarEvento: string | null
  lugarDetencion: string | null
  nexosDelictivos: string | null
  zonaOperacion: string | null
  puestaDisposicion: string | null
  modusOperandi: string | null
  infoAdicional: string | null
  antecedentes: string | null
  faltasAdmin: string | null
  capturadoPor: string | null
}

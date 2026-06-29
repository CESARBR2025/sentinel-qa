export interface UserInfo {
  name: string
  apellido?: string
  email: string
}

export interface RolRow {
  rol: string
}

export interface EvidenciaMonitorista {
  id: number
  urlArchivo: string
  nombreArchivo: string | null
}

export interface DatosAseguradoInput {
  folioSija: string
  calle: string
  numero: string
  colonia: string
  municipio: string
  folioRemision: string
  marcoLegal: string
  registroTableta: string
}

export interface DetalleAsegurado {
  folioDenuncia: string | null
  folioReporteCampo: string | null
  iph: string | null
  fechaReporte: string | null
  horaReporte: string | null
  nombreDetenido: string | null
  placaUnidad: string | null
  nombrePolicia: string | null
  nominaPolicia: string | null
  lugarDetencion: string | null
  capturadoPorNombre: string | null
  folioSija: string | null
  folioRemision: string | null
  marcoLegal: string | null
  registroTableta: string | null
  domicilioCalle: string | null
  domicilioNumero: string | null
  domicilioColonia: string | null
  domicilioMunicipio: string | null
}

export interface SolicitudEvidencia {
  id: string
  folioDenuncia: string | null
  folioSija: string | null
  iph: string | null
  folioCu: string | null
  corporacion: string | null
  sector: string | null
  grupoAdscripcion: string | null
  fechaReporte: string | null
  horaReporte: string | null
  fechaAvistamiento: string | null
  horaAvistamiento: string | null
  fechaDespacho: string | null
  horaDespacho: string | null
  fechaConfirmacion: string | null
  horaConfirmacion: string | null
  fechaLlegada: string | null
  horaLlegada: string | null
  horaInicioDenuncia: string | null
  horaFinDenuncia: string | null
  horaTerminoAtencion: string | null
  horaCuestionario: string | null
  lugarHecho: string | null
  lugarApoyo: string | null
  coloniaHecho: string | null
  coloniaApoyo: string | null
  municipio: string | null
  latitud: string | null
  longitud: string | null
  nominaMando: string | null
  policiaACargo: string | null
  policiaDenuncia: string | null
  policiaFirmaD1: string | null
  policiaIngresaCu: string | null
  tipoEvento: string | null
  delito: string | null
  violencia: string | null
  crp: string | null
  requirioTablet: boolean | null
  funcionabaTablet: boolean | null
  ofendidoHombre: number | null
  ofendidoMujer: number | null
  numCuestionarios: number | null
  intervinoGs: boolean | null
  seGeneroD1: boolean | null
  seVaAGenerarD1: boolean | null
  observaciones: string | null
  capturadoPor: string | null
  createdAt: string | null
  updatedAt: string | null
  reporteCampoId: string | null
  estadoTramite: string | null
  estadoEvidencia: string | null
  monitoristaFechasRequeridas: string | null
  numCarpetaInvestigacion: string | null
  fechaCierre: string | null
}

export interface UserInfo {
  name: string;
  apellido?: string;
  email: string;
}

export interface RolRow {
  rol: string;
}

export interface EvidenciaMonitorista {
  id: number;
  urlArchivo: string;
  nombreArchivo: string | null;
}

export interface DatosAseguradoInput {
  folioSija: string;
  calle: string;
  numero: string;
  colonia: string;
  municipio: string;
  folioRemision: string;
  marcoLegal: string;
  registroTableta: string;
}

export interface AseguradoRow {
  id: string
  folioReporteCampo: string
  folioDenuncia: string | null
  createdAt: string
  cantidadDetenidos: number
  folioReporteAsegurados: string | null
  oficialNombre: string | null
  oficialPlaca: string | null
}

export interface DetenidoBase {
  nombre?: string
}

export interface DetenidoDireccionInput {
  nombreDetenido: string
  apPaterno: string
  apMaterno: string
  calle: string
  colonia: string
  numero: string
  codPostal: string
  latitud: number | null
  longitud: number | null
}

export interface DetalleAseguradoCompleto {
  reporteCampoId: string
  folioReporteAsegurados: string
  folioReporteCampo: string | null
  folioDenuncia: string | null
  iph: string | null
  folioSija: string | null
  folioRemision: string | null
  marcoLegal: string | null
  registroTableta: string | null
  fechaHoy: string
  horaAhora: string
  lugarDetencionCalle: string | null
  lugarDetencionColonia: string | null
  lugarLatitud: number | null
  lugarLongitud: number | null
  oficialNombre: string | null
  oficialApPaterno: string | null
  oficialApMaterno: string | null
  oficialPlaca: string | null
  oficialNomina: string | null
  capturadoPorNombre: string | null
  detenidos: DetenidoBase[]
  detenidosDirecciones: DetalleDetenidoGuardado[]
}

export interface DetalleDetenidoGuardado {
  id: string
  nombreDetenido: string
  apPaterno: string | null
  apMaterno: string | null
  calle: string | null
  colonia: string | null
  numero: string | null
  codPostal: string | null
  latitud: number | null
  longitud: number | null
}

export interface PuestaDisposicionRow {
  id: string
  reporteCampoId: string
  gestionInterna: boolean
  dependenciaExterna: string | null
  actas: Record<string, boolean>
  otrosActos: string | null
  horaInicioTraslado: string
  horaLlegadaSede: string
  tiempoTrasladoTotal: number
  horaPuestaDisposicion: string
  creadoPor: string
  creadoEn: string
  completadoEn: string | null
}

export interface PuestaDisposicionInput {
  gestionInterna: boolean
  dependenciaExterna: string | null
  actas: Record<string, boolean>
  otrosActos: string | null
  horaInicioTraslado: string
  horaLlegadaSede: string
  tiempoTrasladoTotal: number
  horaPuestaDisposicion: string
}

export type AseguradoConDisposicion = AseguradoRow & {
  puestaDisposicionId: string | null
}

export interface DetalleAsegurado {
  folioDenuncia: string | null;
  folioReporteCampo: string | null;
  iph: string | null;
  fechaReporte: string | null;
  horaReporte: string | null;
  nombreDetenido: string | null;
  placaUnidad: string | null;
  nombrePolicia: string | null;
  nominaPolicia: string | null;
  lugarDetencion: string | null;
  capturadoPorNombre: string | null;
  folioSija: string | null;
  folioRemision: string | null;
  marcoLegal: string | null;
  registroTableta: string | null;
  domicilioCalle: string | null;
  domicilioNumero: string | null;
  domicilioColonia: string | null;
  domicilioMunicipio: string | null;
}

export interface SolicitudEvidencia {
  id: string;
  folioDenuncia: string | null;
  folioSija: string | null;
  iph: string | null;
  folioCu: string | null;
  corporacion: string | null;
  sector: string | null;
  grupoAdscripcion: string | null;
  fechaReporte: string | null;
  horaReporte: string | null;
  fechaAvistamiento: string | null;
  horaAvistamiento: string | null;
  fechaDespacho: string | null;
  horaDespacho: string | null;
  fechaConfirmacion: string | null;
  horaConfirmacion: string | null;
  fechaLlegada: string | null;
  horaLlegada: string | null;
  horaInicioDenuncia: string | null;
  horaFinDenuncia: string | null;
  horaTerminoAtencion: string | null;
  horaCuestionario: string | null;
  lugarHecho: string | null;
  lugarApoyo: string | null;
  coloniaHecho: string | null;
  coloniaApoyo: string | null;
  municipio: string | null;
  latitud: string | null;
  longitud: string | null;
  nominaMando: string | null;
  policiaACargo: string | null;
  policiaDenuncia: string | null;
  policiaFirmaD1: string | null;
  policiaIngresaCu: string | null;
  tipoEvento: string | null;
  delito: string | null;
  violencia: string | null;
  crp: string | null;
  requirioTablet: boolean | null;
  funcionabaTablet: boolean | null;
  ofendidoHombre: number | null;
  ofendidoMujer: number | null;
  numCuestionarios: number | null;
  intervinoGs: boolean | null;
  seGeneroD1: boolean | null;
  seVaAGenerarD1: boolean | null;
  observaciones: string | null;
  capturadoPor: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  reporteCampoId: string | null;
  estadoTramite: string | null;
  estadoEvidencia: string | null;
  monitoristaFechasRequeridas: string | null;
  numCarpetaInvestigacion: string | null;
  fechaCierre: string | null;
}

export interface LiberacionRow {
  id: string
  folio: string
  estatus: string
  placa: string
  created_at: string
  correo_infractor: string
  nombre_infractor: string
  estatus_dependencia: string
  no_carpeta_investigacion: string
}

export interface ViaInfraccionHeader {
  id_infraccion: string
  folio_de_infraccion: string
  fecha_de_registro_de_infraccion: string
  estatus_de_infraccion: string
  url_ine: string
  url_tarjeta_circulacion: string
  url_inapam: string
  url_evidencias: string[]
  no_oficio_fiscalia?: string
  url_oficio_fiscalia?: string
  no_carpeta_investigacion?: string
  url_orden_salida_liberaciones?: string
}

export interface ViaInfraccionLegal {
  articulo_numero: string
  articulo_descripcion: string
  fraccion_numero: string
  fraccion_descripcion: string
  total_umas: string
  total_pesos: string
}

export interface ViaInfraccionInfractor {
  nombre_infractor: string
  appaterno_infractor?: string
  apmaterno_infractor?: string
  correo_infractor: string
  curp_infractor: string
}

export interface ViaInfraccionOficial {
  numero_empleado: string
  nombre_completo: string
  patrulla_nombre: string
  activo: string | boolean
}

export interface ViaInfraccionVehiculo {
  placa: string
  tipo: string
  marca: string
  modelo: string
  anio: string
  color: string
}

export interface ViaInfraccionGarantia {
  garantia_retenida: string
}

export interface ViaInfraccionUbicacion {
  latitud: string
  longitud: string
  calle: string
  cod_postal: string
  numero: string
  municipio: string
  estado: string
}

export interface ViaInfraccionDetalle {
  Header: ViaInfraccionHeader
  Infraccion: ViaInfraccionLegal
  datos_infractor: ViaInfraccionInfractor
  vehiculo: ViaInfraccionVehiculo
  garantia: ViaInfraccionGarantia
  ubicacion: ViaInfraccionUbicacion
  oficial: ViaInfraccionOficial
}

//============== VIA
export type DetalleHeader = {
  id_infraccion: string;
  folio_de_infraccion: string;
  fecha_de_registro_de_infraccion: string;
  estatus_de_infraccion: string;
  url_ine: string;
  url_tarjeta_circulacion: string;
  url_inapam: string;
  url_evidencias: string[];
  no_oficio_fiscalia?: string;
  url_oficio_fiscalia?: string;
  estatus_dependencia: string;
  no_carpeta_investigacion: string;
  appaterno_infractor: string;
  url_oficio_pago_corralon?: string;
  url_orden_salida_liberaciones?: string;
  estatus_orden_pago?: string;
  estatus: string;
};

export type DetalleInfraccion = {
  articulo_descripcion: string;
  fraccion_descripcion: string;
  total_umas: string | number;
  total_pesos: string | number;
};

export type DetalleInfractor = {
  nombre_infractor: string;
  correo_infractor: string;
  curp_infractor: string;
  es_titular: boolean;
  apmaterno_infractor: string;
  appaterno_infractor: string;
  nombre_titular_liberacion: string;
};

export type DetalleVehiculo = {
  placa: string;
  tipo: string;
  marca: string;
  modelo: string;
  anio: string;
  color: string;
};

export type DetalleGarantia = {
  garantia_retenida: string;
};

export type DetalleUbicacion = {
  latitud: string;
  longitud: string;
  calle: string;
  cod_postal: string;
  numero: string;
  municipio: string;
  estado: string;
};

export type DetalleCompleto = {
  Header: DetalleHeader;
  Infraccion: DetalleInfraccion;
  datos_infractor: DetalleInfractor;
  vehiculo: DetalleVehiculo;
  garantia: DetalleGarantia;
  ubicacion: DetalleUbicacion;
};

export const ACTAS_CHECKLIST = [
  { key: 'inspeccion_persona', label: 'Inspección de Persona' },
  { key: 'lectura_derechos', label: 'Lectura de Derechos' },
  { key: 'inspeccion_lugar', label: 'Inspección de lugar' },
  { key: 'inspeccion_vehiculo', label: 'Inspección de Vehículo' },
  { key: 'embalaje_etiquetado', label: 'Embalaje y etiquetado' },
  { key: 'cadena_custodia', label: 'Cadena de Custodia' },
  { key: 'preservacion_lugar', label: 'Preservación del lugar' },
  { key: 'entrevistas', label: 'Entrevistas' },
] as const

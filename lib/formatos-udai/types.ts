export type EstadoCompletitudIncidencia = 'pendiente' | 'completa'

export interface ReporteIncidenciaCompleto {
  id: string // incidentes.id
  estadoCompletitud: EstadoCompletitudIncidencia
  completadoEn: string | null

  iph: string | null
  folio911: string | null
  fechaEvento: string | null
  diaEvento: string | null            // calculado
  fechaReporte2: string | null
  horaReporte: string | null
  horaInicioEvento: string | null
  horaFinalEvento: string | null
  horaPromedio: string | null         // calculado
  delito: string | null
  articulosObjetos: string | null
  modus: string | null
  calle: string | null
  numeroReferencia: string | null
  colonia: string | null
  sector: string | null
  rt: string | null
  turno: string | null
  crp: string | null
  afectado: string | null
  calleAfec: string | null
  numeroAfec: string | null
  coloniaAfec: string | null
  telefonoAfec: string | null
  marca: string | null
  submarca: string | null
  tipo: string | null
  color: string | null
  placas: string | null
  estadoVehiculo: string | null
  niv: string | null
  motor: string | null
  modelo: string | null
  apNuc: string | null
  fuero: string | null
  latitud: string | null
  longitud: string | null
  agenteAprehensor: string | null
  agrupamiento: string | null
  detenido: string | null
  alias: string | null
  fechaNacimiento: string | null
  edad: number | null
  sexo: string | null
  calleDet: string | null
  numeroDet: string | null
  coloniaDet: string | null
  municipio: string | null
  originario: string | null
  nucCu: string | null
  folioRnd: string | null
  latitud2: string | null
  longitud3: string | null
  fechaIngreso: string | null
  fechaSalida: string | null
  otroDelito: string | null
  masc: string | null
  umecas: string | null
}

export interface FaltaAdministrativaRow {
  id: string
  fecha: string | null
  hora: string | null
  responsableTurno: string | null
  horaSalida: string | null // GAP, siempre null por ahora — ver 00-contexto.md
  iph: string | null
  folioTablet: string | null // GAP, siempre null por ahora
  apellidoPaterno: string | null
  apellidoMaterno: string | null
  nombre: string | null
  fechaNacimiento: string | null
  edad: number | null
  genero: string | null
  alias: string | null
  ciudadOrigen: string | null
  calleDet: string | null
  numero: string | null
  coloniaDet: string | null
  articulo: string | null
  tipoFalta: string | null
  rnd: string | null
  lugarArresto: string | null
  colonia: string | null
  oficialQueRemite: string | null
  oficialQueRemite2: string | null // GAP, siempre null por ahora
  sector: string | null
  agrupamiento: string | null
  latitud: number | null
  longitud: number | null
  presencia: boolean
  verbalizacion: boolean
  controlContacto: boolean
  controlFisico: boolean
  tecnicasNoLetales: boolean
  fuerzaLetal: boolean
}

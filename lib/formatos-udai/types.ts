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

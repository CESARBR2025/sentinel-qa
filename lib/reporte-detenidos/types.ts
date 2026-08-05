export interface DetenidoCompleto {
  id: string
  folio: string
  folioDenuncia: string
  iph: string | null
  nombre: string
  evento: string
  delito: string
  faltaAdministrativa: string
  modusOperandi: string
  createdAt: string
}

export interface AntecedenteFicha {
  fecha: string | null
  descripcion: string
  lugar: string | null
  fuente: 'LOCAL' | 'EXTERNO'
}

export interface FichaDetenidoCompleta {
  // Encabezado
  nombreCompleto: string
  apodo: string | null
  folioFicha: string
  rubro: string
  // Datos generales
  fechaNacimiento: string | null
  edad: number | null
  genero: string | null
  originario: string | null
  estadoCivil: string | null
  escolaridad: string | null
  ocupacion: string | null
  domicilio: string
  rasgosParticulares: string | null
  // Evento delictivo
  fechaHoraEvento: string
  rnd: string | null
  expediente: string | null
  lugarEvento: string | null
  lugarDetencion: string | null
  iph: string | null
  nexosDelictivos: null
  zonaOperacion: string | null
  puestaDisposicion: string | null
  modusOperandi: string
  informacionAdicional: string | null
  // Antecedentes
  antecedentesDelitos: AntecedenteFicha[]
  antecedentesFaltas: AntecedenteFicha[]
}

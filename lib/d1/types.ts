export interface GrupoAdscripcion {
  id: number
  clave: string
  nombre: string
  autoridad: string
}

export interface ReporteD1 {
  id: string
  folioDenuncia: string | null
  iph: string | null
  folioCu: string | null
  folioSija: string | null
  delito: string | null
  tipoEvento: string | null
  violencia: boolean
  fechaReporte: string | null
  horaReporte: string | null
  lugarHecho: string | null
  coloniaHecho: string | null
  municipio: string | null
  policiaACargo: string | null
  crp: string | null
  nominaMando: string | null
  seGeneroD1: boolean
  estadoTramite: string | null
  estadoEvidencia: string | null
  ofendidoHombre: number
  ofendidoMujer: number
  tipoIncidente: string | null
  oficialNombre: string | null
  folioCad: string | null
}

export interface ReporteDiarioRow {
  fecha: unknown
  carcel: number | null
  fiscalia: number | null
  fgr: number | null
}

export interface ReporteSemanalRow {
  fecha: unknown
  carcel: number | null
  fiscalia: number | null
  cateoFge: number | null
  cateoFgr: number | null
  operativos: number | null
  fiestas: number | null
  vehiculos: number | null
  armasFuego: number | null
  armasBlancas: number | null
  drogas: number | null
  fgr: number | null
}

export type ReporteIncidenteRow = ReporteDiarioRow | ReporteSemanalRow

export interface ReporteIncidenteCombinado {
  fecha: string
  carcel: number
  fiscalia: number
  fgr: number
  cateoFge: number
  cateoFgr: number
  operativos: number
  fiestas: number
  vehiculos: number
  armasFuego: number
  armasBlancas: number
  drogas: number
}

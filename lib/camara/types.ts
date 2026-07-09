export interface IncidenteCamara {
  id: string
  fecha: string | null
  turno: string | null
  personasSinNovedad: number
  conAntecedentes: number
  vehiculosRevisar: number
  vehiculosRepuve: number
  persecuciones: number
  asegurados: number
  recuperados: number
  incendios: number
  hechosTransito: number
  motosRevisadas: number
  totalPersonasRevisadas: number
  registradoPor: string | null
  createdAt: string | null
}

export interface TotalesCamara {
  totalSinNovedad: number | null
  totalConAntecedentes: number | null
  totalVehiculos: number | null
  totalPersecuciones: number | null
  totalAsegurados: number | null
  totalRecuperados: number | null
  totalPersonas: number | null
}

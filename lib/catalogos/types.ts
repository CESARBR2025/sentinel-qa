export interface PatrullaCatalogo {
  id: string
  placa: string | null
  numSerie: string
  departamento: string | null
  caracteristicas: string | null
  marca: string | null
  modelo: string | null
  gps: string | null
  radio: string | null
  camaras: string | null
  activo: boolean
  sincronizadoEn: string | null
}

export interface PatrullaCatalogoInput {
  placa: string | null
  numSerie: string
  departamento: string | null
  caracteristicas: string | null
  marca: string | null
  modelo: string | null
  gps: string | null
  radio: string | null
  camaras: string | null
}

export interface ImportarResultado {
  importadas: number
  omitidas: number
  motivos: Record<string, number>
  sinPlaca: number
}

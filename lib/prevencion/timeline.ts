import { addHours, addMonths } from 'date-fns'

export const TIPOS_SEGUIMIENTO = [
  'CONTESTACION_INICIAL', '24H', '48H', '72H',
  ...Array.from({ length: 20 }, (_, i) => `MENSUAL_${i + 1}`),
] as const

export type TipoSeguimiento = (typeof TIPOS_SEGUIMIENTO)[number]

export function getLabelSeguimiento(tipo: string): string {
  if (tipo === 'CONTESTACION_INICIAL') return 'Contestación inicial'
  if (tipo === '24H') return '24 horas'
  if (tipo === '48H') return '48 horas'
  if (tipo === '72H') return '72 horas'
  return `Mes ${tipo.replace('MENSUAL_', '')}`
}

export function calcularFechaEsperada(fechaActivacion: Date, tipo: string): Date {
  if (tipo === '24H') return addHours(fechaActivacion, 24)
  if (tipo === '48H') return addHours(fechaActivacion, 48)
  if (tipo === '72H') return addHours(fechaActivacion, 72)
  if (tipo.startsWith('MENSUAL_')) {
    return addMonths(fechaActivacion, parseInt(tipo.replace('MENSUAL_', '')))
  }
  return fechaActivacion // CONTESTACION_INICIAL
}

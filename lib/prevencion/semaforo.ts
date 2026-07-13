import { differenceInCalendarDays, parseISO } from 'date-fns'

export type SemaforoColor = 'verde' | 'amarillo' | 'rojo' | 'gris'

export function calcularSemaforoVigencia(fechaVencimiento: string | Date | null | undefined): SemaforoColor {
  if (!fechaVencimiento) return 'gris'
  const date = typeof fechaVencimiento === 'string' ? parseISO(fechaVencimiento) : fechaVencimiento
  const dias = differenceInCalendarDays(date, new Date())
  if (isNaN(dias)) return 'gris'
  if (dias < 0)  return 'rojo'
  if (dias <= 7) return 'amarillo'
  return 'verde'
}

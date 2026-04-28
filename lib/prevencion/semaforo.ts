import { differenceInCalendarDays, parseISO } from 'date-fns'

export type SemaforoColor = 'verde' | 'amarillo' | 'rojo' | 'gris'

export function calcularSemaforoVigencia(fechaVencimiento: string | null | undefined): SemaforoColor {
  if (!fechaVencimiento) return 'gris'
  const dias = differenceInCalendarDays(parseISO(fechaVencimiento), new Date())
  if (dias < 0)  return 'rojo'
  if (dias <= 7) return 'amarillo'
  return 'verde'
}

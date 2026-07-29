export interface PrioridadColor { principal: string; oscuro: string; fondo: string }

export const PRIORIDAD_COLORES: Record<string, PrioridadColor> = {
  CRITICA: { principal: '#dc2626', oscuro: '#7f1d1d', fondo: '#fef2f2' },
  ALTA:    { principal: '#f97316', oscuro: '#9a3412', fondo: '#fff7ed' },
  MEDIA:   { principal: '#eab308', oscuro: '#a16207', fondo: '#fefce8' },
  BAJA:    { principal: '#2563eb', oscuro: '#1d4ed8', fondo: '#eff6ff' },
}
export const PRIORIDAD_COLOR_DEFAULT: PrioridadColor = { principal: '#94a3b8', oscuro: '#475569', fondo: '#f8fafc' }

export function colorPorPrioridad(prioridad: string | null | undefined): PrioridadColor {
  if (!prioridad) return PRIORIDAD_COLOR_DEFAULT
  return PRIORIDAD_COLORES[prioridad.toUpperCase()] ?? PRIORIDAD_COLOR_DEFAULT
}

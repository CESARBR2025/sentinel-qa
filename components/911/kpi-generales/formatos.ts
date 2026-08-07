// Helpers de formato y paleta compartidos por las secciones del Panel911.
// Paleta de series por tokens shadcn `var(--chart-N)` (definidos en globals.css)
// — misma mecánica que el ejemplo "donut chart with text" de shadcn/ui.
// Mismo mapeo de labels que KpiTiposIncidencias.
import { ETIQUETA_ESTATUS, COLOR_ESTATUS } from '@/components/911/kpi/formato'
import { colorPrioridad } from '@/components/911/kpi/useMapaIncidencias'

export const ACCENT = '#1f355a'

export const TIPOS: { key: string; label: string; color: string }[] = [
  { key: 'normal', label: 'Normales', color: 'var(--chart-1)' },
  { key: 'alarma_escolar', label: 'Alarmas escolares', color: 'var(--chart-2)' },
  { key: 'extorsion', label: 'Extorsiones', color: 'var(--chart-3)' },
]

export function etiquetaTipo(tipo: string): string {
  return TIPOS.find(t => t.key === tipo)?.label ?? tipo
}

export function formatearMinutos(min: number | null): string {
  if (min == null || !Number.isFinite(min)) return '—'
  if (min >= 60) return `${(min / 60).toFixed(1)}h`
  return `${Math.round(min)}m`
}

export { ETIQUETA_ESTATUS, COLOR_ESTATUS, colorPrioridad }

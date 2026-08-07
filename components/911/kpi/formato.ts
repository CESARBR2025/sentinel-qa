import type { IncidenteGeo } from '@/lib/incidentes/types'

export const ETIQUETA_ESTATUS: Record<string, string> = {
  sin_despachar: 'Sin despachar',
  en_despacho: 'En despacho',
  en_sitio: 'En sitio',
  atendido: 'Atendido',
  cerrado_detencion: 'Cerrado c/detención',
}

export const COLOR_ESTATUS: Record<string, string> = {
  sin_despachar: '#dc2626',
  en_despacho: '#ea580c',
  en_sitio: '#ca8a04',
  atendido: '#16a34a',
  cerrado_detencion: '#0f766e',
}

// Fondo de badge por estatus (pareja con COLOR_ESTATUS, §2 DESIGN.md):
// el badge usa fondo + color fuerte para legibilidad sobre superficie clara.
export const BG_ESTATUS: Record<string, string> = {
  sin_despachar: '#fee2e2',
  en_despacho: '#ffedd5',
  en_sitio: '#fef3c7',
  atendido: '#dcfce7',
  cerrado_detencion: '#ccfbf1',
}

export function formatearFechaHora(iso: string): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleString('es-MX', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })
}

export function ubicacionTexto(inc: Pick<IncidenteGeo, 'calle' | 'colonia'>): string {
  const partes = [inc.calle, inc.colonia].filter(Boolean)
  return partes.length ? partes.join(', ') : 'Sin ubicación registrada'
}

// Convierte un ISO a el formato que espera <input type="datetime-local"> en hora local.
export function isoAInputLocal(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function inputLocalAIso(valor: string): string {
  const d = new Date(valor)
  return Number.isNaN(d.getTime()) ? '' : d.toISOString()
}

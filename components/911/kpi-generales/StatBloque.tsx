// Tile de stat KPI — presentacional, sin hooks (usable desde server o client).
// Estilos responsivos viven en las clases CSS `.kpi-stat*` / `.kpi-hero-stat*`
// declaradas en Panel911.tsx (una sola hoja por página, patrón agente_despacho).
// Tono semántico según DESIGN.md §2: success #16a34a, warning #b45309, danger #dc2626.

export type StatTono = 'success' | 'warning' | 'danger'

export interface StatBloqueProps {
  etiqueta: string
  valor: React.ReactNode
  variante?: 'tile' | 'hero'
  tono?: StatTono
  className?: string
}

export function StatBloque({ etiqueta, valor, variante = 'tile', tono, className }: StatBloqueProps) {
  const esHero = variante === 'hero'
  const valorClase = `${esHero ? 'kpi-hero-stat-value' : 'kpi-stat-value'}${tono ? ` kpi-stat-value--${tono}` : ''}`
  const etiquetaClase = esHero ? 'kpi-hero-stat-label' : 'kpi-stat-label'

  return (
    <div className={`${esHero ? 'kpi-hero-stat' : 'kpi-stat'} ${className ?? ''}`}>
      <div className={etiquetaClase}>{etiqueta}</div>
      <div className={valorClase}>{valor}</div>
    </div>
  )
}

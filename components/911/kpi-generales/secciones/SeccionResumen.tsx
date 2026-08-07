import type { Resumen911 } from '@/lib/911/types'
import { StatBloque } from '../StatBloque'
import { DonutKpi, type ItemDonut } from '../graficos/DonutKpi'
import { etiquetaTipo, TIPOS } from '../formatos'
import { SeccionCard, Subtitulo } from './SeccionCard'

export function SeccionResumen({ resumen }: { resumen: Resumen911 }) {
  const porTipoGrafica: ItemDonut[] = resumen.porTipo.map(t => ({
    label: etiquetaTipo(t.tipoReporte),
    valor: t.total,
    color: TIPOS.find(x => x.key === t.tipoReporte)?.color ?? '#94a3b8',
  }))

  return (
    <SeccionCard titulo="Resumen del periodo">
      <StatBloque etiqueta="Total de reportes" valor={resumen.total} />

      {porTipoGrafica.length > 0 && (
        <div className="kpi-seccion-grafica">
          <Subtitulo>Por tipo de reporte</Subtitulo>
          <DonutKpi datos={porTipoGrafica} etiquetaCentro="Reportes" />
        </div>
      )}
    </SeccionCard>
  )
}

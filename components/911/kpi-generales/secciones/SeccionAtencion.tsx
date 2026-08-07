import type { KpiIncidencias } from '@/lib/incidentes/types'
import type { Resumen911 } from '@/lib/911/types'
import { StatBloque } from '../StatBloque'
import { DonutKpi, type ItemDonut } from '../graficos/DonutKpi'
import { ETIQUETA_ESTATUS, COLOR_ESTATUS } from '../formatos'
import { SeccionCard, Subtitulo } from './SeccionCard'

export function SeccionAtencion({ resumen, atencion }: { resumen: Resumen911; atencion: KpiIncidencias }) {
  const porEstatusGrafica: ItemDonut[] = atencion.porEstatus.map(e => ({
    label: ETIQUETA_ESTATUS[e.estatus] ?? e.estatus,
    valor: e.total,
    color: COLOR_ESTATUS[e.estatus] ?? '#94a3b8',
  }))

  return (
    <SeccionCard titulo="Atención y despacho">
      <div className="kpi-stats">
        <StatBloque etiqueta="Canalizados a despacho" valor={resumen.canalizadosADespacho} />
        <StatBloque etiqueta="Sin canalización" valor={resumen.sinCanalizacion} />
        <StatBloque
          etiqueta="Sin despachar ahora"
          valor={resumen.sinDespacharAhora}
          tono={resumen.sinDespacharAhora > 0 ? 'danger' : undefined}
        />
      </div>

      {porEstatusGrafica.length > 0 && (
        <div className="kpi-seccion-grafica">
          <Subtitulo>Por estatus</Subtitulo>
          <DonutKpi datos={porEstatusGrafica} etiquetaCentro="Incidentes" />
        </div>
      )}
    </SeccionCard>
  )
}

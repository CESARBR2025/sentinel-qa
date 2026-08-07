import type { KpiAlarmaEscolar } from '@/lib/911/types'
import { StatBloque } from '../StatBloque'
import { formatearMinutos } from '../formatos'
import { SeccionCard } from './SeccionCard'

export function SeccionAlarmasEscolares({ alarmaEscolar }: { alarmaEscolar: KpiAlarmaEscolar }) {
  return (
    <SeccionCard titulo="Alarmas escolares">
      {alarmaEscolar.total === 0 ? (
        <div className="kpi-vacio">Sin alarmas escolares en el periodo</div>
      ) : (
        <div className="kpi-stats kpi-stats--wrap">
          <StatBloque etiqueta="Total" valor={alarmaEscolar.total} />
          <StatBloque etiqueta="Falsas" valor={alarmaEscolar.falsas} />
          <StatBloque
            etiqueta="% falsas"
            valor={`${alarmaEscolar.porcentajeFalsas}%`}
            tono={alarmaEscolar.porcentajeFalsas > 20 ? 'danger' : undefined}
          />
          <StatBloque etiqueta="Activaciones" valor={alarmaEscolar.activacionesTotales} />
          <StatBloque etiqueta="Tiempo de arribo prom." valor={formatearMinutos(alarmaEscolar.tiempoArriboPromedioMin)} />
        </div>
      )}
    </SeccionCard>
  )
}

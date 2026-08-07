import type { TiemposRespuesta911 } from '@/lib/911/types'
import { formatearMinutos } from '../formatos'
import { SeccionCard } from './SeccionCard'

// 3 etapas secuenciales del mismo flujo → mini cards con rampa ordinal de un
// solo hue (tokens shadcn chart-1..3): Captura → Despacho → Llegada.
export function SeccionTiempos({ tiempos }: { tiempos: TiemposRespuesta911 }) {
  const etapas = [
    { label: 'Captura → Despacho', valor: formatearMinutos(tiempos.capturaDespachoMin), color: 'var(--chart-1)' },
    { label: 'Despacho → Llegada', valor: formatearMinutos(tiempos.despachoLlegadaMin), color: 'var(--chart-2)' },
    { label: 'Captura → Llegada', valor: formatearMinutos(tiempos.capturaLlegadaMin), color: 'var(--chart-3)' },
  ]

  return (
    <SeccionCard titulo="Tiempos de respuesta">
      {tiempos.muestras === 0 ? (
        <div className="kpi-vacio">Sin despachos con llegada registrada en el periodo</div>
      ) : (
        <>
          <div className="kpi-tiempos">
            {etapas.map(e => (
              <div key={e.label} className="kpi-tiempos-card">
                <div className="kpi-tiempos-valor" style={{ color: e.color }}>{e.valor}</div>
                <div className="kpi-tiempos-label">{e.label}</div>
              </div>
            ))}
          </div>
          <p className="kpi-meta">{tiempos.muestras} despachos con llegada registrada</p>
        </>
      )}
    </SeccionCard>
  )
}

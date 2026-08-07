import type { KpiExtorsion } from '@/lib/911/types'
import { StatBloque } from '../StatBloque'
import { BarraRankeada, type ItemBarraRankeada } from '../graficos/BarraRankeada'
import { TendenciaDiaria } from '../graficos/TendenciaDiaria'
import { SeccionCard, Subtitulo } from './SeccionCard'

export function SeccionExtorsion({ extorsion }: { extorsion: KpiExtorsion }) {
  const gruposGrafica: ItemBarraRankeada[] = extorsion.topGruposDelictivos.map(g => ({
    label: g.grupoDelictivo,
    valor: g.total,
  }))

  return (
    <SeccionCard titulo="Extorsión">
      {extorsion.total === 0 ? (
        <div className="kpi-vacio">Sin extorsiones en el periodo</div>
      ) : (
        <>
          <div className="kpi-stats">
            <StatBloque etiqueta="Total" valor={extorsion.total} />
            <StatBloque etiqueta="% canalizadas a despacho" valor={`${extorsion.porcentajeCanalizados}%`} />
          </div>

          {extorsion.tendenciaDiaria.length > 0 && (
            <div className="kpi-seccion-grafica">
              <Subtitulo>Tendencia diaria</Subtitulo>
              <TendenciaDiaria datos={extorsion.tendenciaDiaria} />
            </div>
          )}

          {gruposGrafica.length > 0 && (
            <div className="kpi-seccion-grafica">
              <Subtitulo>Grupos delictivos más recurrentes</Subtitulo>
              <BarraRankeada datos={gruposGrafica} />
            </div>
          )}
        </>
      )}
    </SeccionCard>
  )
}

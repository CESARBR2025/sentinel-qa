import { redirect } from 'next/navigation'
import { FormularioAsegurado } from '@/components/fiscalia/FormularioAsegurado'
import { obtenerDashboardFiscalia, obtenerDetalleAseguradoCompletoAction, obtenerPuestaDisposicionAction } from '@/lib/fiscalia/actions'
import { ACTAS_CHECKLIST } from '@/lib/fiscalia/types'
import { Clock, Building2, CheckCircle } from 'lucide-react'
import { DashboardHeader } from '@/components/partials/Header'
import { DashboardFooter } from '@/components/partials/Footer'
import { PageHeader, PageHeaderLink } from '@/components/partials/PageHeader'

interface Props {
  params: Promise<{ id: string }>
}

const labelSx: React.CSSProperties = {
  fontFamily: 'JetBrains Mono,monospace',
  fontSize: 9,
  color: '#64748b',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  marginBottom: 4,
}

const disabledSx: React.CSSProperties = {
  width: '100%',
  padding: '8px 10px',
  border: '1px solid #f1f5f9',
  borderLeft: '3px solid #059669',
  fontFamily: 'Inter,sans-serif',
  fontSize: 12,
  color: '#64748b',
}

export default async function AseguradoDetallePage({ params }: Props) {
  const user = await obtenerDashboardFiscalia()
  const { id: reporteCampoId } = await params

  const { data, error } = await obtenerDetalleAseguradoCompletoAction(reporteCampoId)

  if (!data || error) {
    redirect('/fiscalia/asegurados')
  }

  const { data: pad } = await obtenerPuestaDisposicionAction(reporteCampoId)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');
      `}</style>

      <DashboardHeader user={user} roleLabel="Detalle de Asegurados" />

      <main className="pad-pagina" style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <PageHeader
          title="Detalle de"
          accent="Asegurados"
          accentColor="#7c3aed"
          subtitle={`Direcciones de detenidos del reporte #${reporteCampoId}`}
          actions={<PageHeaderLink href="/fiscalia/asegurados" variant="secondary">← Asegurados</PageHeaderLink>}
        />

        {/* Formulario */}
        <FormularioAsegurado reporteCampoId={reporteCampoId} data={data} ocultarEncabezado />

        {/* Puesta a Disposición */}
        {pad && (
          <div style={{
            padding: '16px 20px',
            border: '1px solid #e2e8f0',
            borderLeft: '3px solid #d97706',
            background: '#fafafa',
          }}>
            <div style={{
              fontFamily: 'Barlow Condensed,sans-serif',
              fontSize: 15, fontWeight: 700,
              textTransform: 'uppercase', color: '#1e293b',
              marginBottom: 16,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <Clock size={16} color="#d97706" />
              Puesta a Disposición
              <span style={{
                fontFamily: 'JetBrains Mono,monospace', fontSize: 8,
                color: '#94a3b8', letterSpacing: '0.1em', fontWeight: 400,
                marginLeft: 8,
              }}>
                (FINALIZADO)
              </span>
            </div>

            {/* Gestión */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ ...labelSx, color: '#d97706' }}>Gestión</label>
              <div style={disabledSx}>
                <Building2 size={12} style={{ marginRight: 6 }} />
                {pad.gestionInterna ? 'Interna (Fiscalía)' : `Externa — ${pad.dependenciaExterna === 'fiscalia' ? 'Fiscalía' : 'Juzgado'}`}
              </div>
            </div>

            {/* Actas */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ ...labelSx, color: '#d97706' }}>Actos de Investigación</label>
              <div className="grid-2">
                {ACTAS_CHECKLIST.map(a => (
                  <div key={a.key} style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    fontFamily: 'Inter,sans-serif', fontSize: 12,
                    padding: '4px 8px',
                    background: pad.actas[a.key] ? '#fefce8' : '#f8fafc',
                    color: pad.actas[a.key] ? '#92400e' : '#94a3b8',
                  }}>
                    <CheckCircle size={12} color={pad.actas[a.key] ? '#d97706' : '#d1d5db'} />
                    {a.label}
                  </div>
                ))}
              </div>
              {pad.otrosActos && (
                <div style={{ marginTop: 8 }}>
                  <label style={labelSx}>Otros actos</label>
                  <div style={disabledSx}>{pad.otrosActos}</div>
                </div>
              )}
            </div>

            {/* Tiempos */}
            <div>
              <label style={{ ...labelSx, color: '#d97706' }}>Tiempos de Traslado</label>
              <div className="grid-2">
                <div>
                  <label style={labelSx}>Inicio de traslado</label>
                  <div style={disabledSx}>{pad.horaInicioTraslado}</div>
                </div>
                <div>
                  <label style={labelSx}>Llegada a sede</label>
                  <div style={disabledSx}>{pad.horaLlegadaSede}</div>
                </div>
                <div>
                  <label style={labelSx}>Puesta a disposición</label>
                  <div style={disabledSx}>{pad.horaPuestaDisposicion}</div>
                </div>
                <div>
                  <label style={labelSx}>Tiempo total</label>
                  <div style={{ ...disabledSx, fontFamily: 'JetBrains Mono,monospace', fontWeight: 600, color: '#d97706' }}>
                    {pad.tiempoTrasladoTotal} min
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <DashboardFooter />
      </main>
    </div>
  )
}

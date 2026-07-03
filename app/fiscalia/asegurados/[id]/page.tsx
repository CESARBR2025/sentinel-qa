import { redirect } from 'next/navigation'
import { ProfileDropdown } from '@/components/fiscalia/ProfileDropdown'
import { FormularioAsegurado } from '@/components/fiscalia/FormularioAsegurado'
import { obtenerDashboardFiscalia, obtenerDetalleAseguradoCompletoAction, obtenerPuestaDisposicionAction } from '@/lib/fiscalia/actions'
import { ACTAS_CHECKLIST } from '@/lib/fiscalia/types'
import { Clock, Building2, CheckCircle } from 'lucide-react'

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
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter,sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');
      `}</style>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 48px', display: 'flex', flexDirection: 'column', gap: 24, minHeight: '100vh' }}>

        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          paddingBottom: 20, borderBottom: '1px solid #e2e8f0',
          position: 'relative',
        }}>
          <div style={{ position: 'absolute', bottom: -1, left: 0, width: 64, height: 3, background: '#7c3aed' }}></div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <img src="/logo_sentinel.png" alt="S" style={{ height: 48, objectFit: 'contain' }} />
            <div>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, letterSpacing: '0.3em', color: '#7c3aed', textTransform: 'uppercase', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, background: '#7c3aed', display: 'inline-block' }}></span>
                Detalle de Asegurados
              </div>
              <h1 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 36, letterSpacing: '0.06em', textTransform: 'uppercase', margin: 0, color: '#0f172a', lineHeight: 1 }}>
                FISCALÍA · ASEGURADOS
              </h1>
            </div>
          </div>

          <ProfileDropdown name={user.name} apellido={user.apellido} email={user.email} />
        </div>

        {/* Formulario */}
        <FormularioAsegurado reporteCampoId={reporteCampoId} data={data} />

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
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
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
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
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

        {/* Footer */}
        <div style={{
          marginTop: 'auto', paddingTop: 20,
          borderTop: '1px solid #e2e8f0',
          fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#94a3b8',
          letterSpacing: '0.18em', textTransform: 'uppercase',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>SSPM · SAN JUAN DEL RÍO · QRO</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span>SENTINEL v0.1 · FISCALÍA · ASEGURADOS</span>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#7c3aed' }}></span>
          </div>
        </div>

      </div>
    </div>
  )
}

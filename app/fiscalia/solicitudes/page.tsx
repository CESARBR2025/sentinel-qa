import { ProfileDropdown } from '@/components/fiscalia/ProfileDropdown'
import { TabSolicitudes } from '@/components/fiscalia/TabSolicitudes'
import { obtenerDashboardFiscalia, obtenerSolicitudes } from '@/lib/fiscalia/actions'

export default async function SolicitudesPage() {
  const user = await obtenerDashboardFiscalia()
  const { pendientes, sinEvidencias, conEvidencias, finalizadas } = await obtenerSolicitudes()

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter,sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');
        .st-h { border-bottom: 1px solid #e2e8f0; }
        .st-h th { font-family: 'JetBrains Mono',monospace; font-size: 10px; color: #64748b; letter-spacing: 0.1em; text-transform: uppercase; padding: 12px 16px; text-align: left; font-weight: 600; }
        .st-r td { font-family: 'Inter',sans-serif; font-size: 12px; color: #334155; padding: 14px 16px; border-bottom: 1px solid #f1f5f9; }
        .st-r:hover td { background: #f8fafc; }
        .badge-estado { font-family: 'JetBrains Mono',monospace; font-size: 9px; letter-spacing: 0.06em; padding: 3px 10px; display: inline-block; text-transform: uppercase; }
      `}</style>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 48px', display: 'flex', flexDirection: 'column', gap: 32, minHeight: '100vh' }}>

        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          paddingBottom: 20, borderBottom: '1px solid #e2e8f0',
          position: 'relative'
        }}>
          <div style={{ position: 'absolute', bottom: -1, left: 0, width: 64, height: 3, background: '#7c3aed' }}></div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <img src="/chaleco.png" alt="S" style={{ height: 48, objectFit: 'contain' }} />
            <div>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, letterSpacing: '0.3em', color: '#7c3aed', textTransform: 'uppercase', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, background: '#7c3aed', display: 'inline-block' }}></span>
                Solicitudes de Evidencias
              </div>
              <h1 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 36, letterSpacing: '0.06em', textTransform: 'uppercase', margin: 0, color: '#0f172a', lineHeight: 1 }}>
                FISCALÍA · SOLICITUDES
              </h1>
            </div>
          </div>

          <ProfileDropdown name={user.name} apellido={user.apellido} email={user.email} />
        </div>

        {/* Tabs + Tables */}
        <TabSolicitudes pendientes={pendientes} sinEvidencias={sinEvidencias} conEvidencias={conEvidencias} finalizadas={finalizadas} />

        {/* Footer */}
        <div style={{
          marginTop: 'auto', paddingTop: 20,
          borderTop: '1px solid #e2e8f0',
          fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#94a3b8',
          letterSpacing: '0.18em', textTransform: 'uppercase',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div>SSPM · SAN JUAN DEL RÍO · QRO</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span>SENTINEL v0.1 · FISCALÍA · SOLICITUDES</span>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#7c3aed' }}></span>
          </div>
        </div>

      </div>
    </div>
  )
}

import { auth }    from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { verificarRolOficial, listarReportesOficial } from '@/lib/oficial/service'
import { AlertTriangle, CheckCircle2, FileText } from 'lucide-react'
import { ToastExito } from '@/components/oficial/ToastExito'
import Link from 'next/link'
import { DashboardHeader } from '@/components/partials/Header'

export default async function MisReportesPage({ searchParams }: { searchParams: Promise<{ exito?: string; folio?: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const esOficial = await verificarRolOficial(session.user.id)
  if (!esOficial) redirect('/dashboard')

  const reportes = await listarReportesOficial(session.user.id)
  const params = await searchParams

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter,sans-serif' }}>
      <ToastExito show={params.exito === '1'} folio={params.folio} />
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>

      <DashboardHeader
        user={session.user as { name: string; apellido?: string; email: string }}
        backHref="/oficial"
        backLabel="Panel"
      />

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 48px' }}>

        <div style={{ marginBottom: 32, borderBottom: '1px solid #e2e8f0', paddingBottom: 20 }}>
          <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#1f355a', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>HISTORIAL</span>
          <h1 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 36, margin: '4px 0 0', color: '#0f172a', textTransform: 'uppercase' }}>
            Mis <span style={{ color: '#1f355a' }}>Reportes</span>
          </h1>
        </div>

        {reportes.length === 0 ? (
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '64px 32px', textAlign: 'center', borderRadius: 2 }}>
            <div style={{ fontFamily: 'Barlow Condensed,sans-serif', fontSize: 22, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Sin reportes registrados</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {reportes.map(r => {
              const tieneDenuncia = !!r.d1Id
              const pendienteDenu = (r.quiereDenuncia || r.d1Pendiente) && !r.d1Id
              return (
                <Link key={r.id} href={`/oficial/reportes/${r.id}`} style={{
                  background: '#ffffff',
                  border: `1px solid ${pendienteDenu ? '#fde68a' : '#e2e8f0'}`,
                  borderLeft: `4px solid ${pendienteDenu ? '#d97706' : tieneDenuncia ? '#16a34a' : '#1f355a'}`,
                  borderRadius: 2, padding: '16px 20px',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  textDecoration: 'none', color: 'inherit',
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 12, fontWeight: 700, color: '#1f355a' }}>
                        {r.folioReporteCampo || r.ofiFolioCad || 'S/C'}
                      </span>
                      <span style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, color: '#64748b' }}>
                        {r.ofiTipoIncidente || 'Sin clasificar'}
                      </span>
                      {r.ofiCalle && (
                        <span style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, color: '#94a3b8' }}>
                          {r.ofiCalle}{r.ofiColonia ? `, ${r.ofiColonia}` : ''}
                        </span>
                      )}
                    </div>
                    <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#94a3b8' }}>
                      {new Date(r.createdAt).toLocaleString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {tieneDenuncia && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'JetBrains Mono,monospace', fontSize: 10, fontWeight: 700, padding: '3px 10px', background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0', borderRadius: 2 }}>
                        <CheckCircle2 size={11} /> D1: {r.d1Folio}
                      </span>
                    )}
                    {pendienteDenu && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'JetBrains Mono,monospace', fontSize: 10, fontWeight: 700, padding: '3px 10px', background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', borderRadius: 2 }}>
                        <AlertTriangle size={11} /> DENUNCIA PENDIENTE
                      </span>
                    )}
                    {!tieneDenuncia && !pendienteDenu && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'JetBrains Mono,monospace', fontSize: 10, padding: '3px 10px', background: '#eff1f3', color: '#1f355a', border: '1px solid #c3c8d2', borderRadius: 2 }}>
                        <FileText size={11} /> SIN DENUNCIA
                      </span>
                    )}
                    <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: '#94a3b8' }}>→</span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { DashboardHeader } from '@/components/partials/Header'
import { DashboardFooter } from '@/components/partials/Footer'
import { PageHeader, PageHeaderLink } from '@/components/partials/PageHeader'
import { tienePermiso } from '@/lib/reporte-detenidos/permisos'
import { listarDetenidosCompletos } from '@/lib/reporte-detenidos/repository'
import { BotonGenerarPpt } from '@/components/reporte-detenidos/BotonGenerarPpt'

export default async function ReporteDetenidosPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  if (!(await tienePermiso(session.user.id, 'reporte_detenidos', 'ver'))) redirect('/agente_reportes')

  const user = session.user as { name: string; apellido?: string; email: string }
  const detenidos = await listarDetenidosCompletos()

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter, sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>
      <DashboardHeader user={user} roleLabel="Agente Reportes" />

      <main className="pad-pagina" style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <PageHeader
          title="Reporte de"
          accent="Detenidos"
          accentColor="#059669"
          subtitle="Detenidos con fotografía frontal, derecho e izquierdo ya completadas por Fiscalía/Juzgado"
          actions={<>
            <PageHeaderLink href="/agente_reportes" variant="secondary">← Panel de Reportes</PageHeaderLink>
            <BotonGenerarPpt />
          </>}
        />

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 2, overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Inter', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
                {['Nombre', 'Folio', 'Evento', 'Delitos', 'Falta Administrativa', 'Modus Operandi', 'Fecha'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', fontFamily: 'JetBrains Mono', fontSize: 10, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {detenidos.length === 0 && (
                <tr><td colSpan={7} style={{ padding: 32, textAlign: 'center', fontFamily: 'JetBrains Mono', fontSize: 12, color: '#94a3b8' }}>No hay detenidos con las 3 fotos completadas</td></tr>
              )}
              {detenidos.map(d => (
                <tr key={d.id} style={{ borderTop: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '10px 16px' }}>{d.nombre}</td>
                  <td style={{ padding: '10px 16px', fontFamily: 'JetBrains Mono', fontSize: 11 }}>{d.folio || '—'}</td>
                  <td style={{ padding: '10px 16px' }}>{d.evento}</td>
                  <td style={{ padding: '10px 16px' }}>{d.delito}</td>
                  <td style={{ padding: '10px 16px' }}>{d.faltaAdministrativa}</td>
                  <td style={{ padding: '10px 16px' }}>{d.modusOperandi}</td>
                  <td style={{ padding: '10px 16px', fontFamily: 'JetBrains Mono', fontSize: 11, color: '#64748b' }}>{new Date(d.createdAt).toLocaleDateString('es-MX')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <DashboardFooter />
      </main>
    </div>
  )
}

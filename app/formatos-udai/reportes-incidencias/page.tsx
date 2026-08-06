import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Clock3, CheckCircle2 } from 'lucide-react'
import { DashboardHeader } from '@/components/partials/Header'
import { DashboardFooter } from '@/components/partials/Footer'
import { PageHeader, PageHeaderLink } from '@/components/partials/PageHeader'
import { SegmentPage } from '@/components/partials/SegmentPage'
import { tienePermiso } from '@/lib/formatos-udai/permisos'
import { listarReportesIncidencia } from '@/lib/formatos-udai/repository'
import { BotonExportarExcel } from '@/components/formatos-udai/BotonExportarExcel'
import { CompletarDatosModal } from '@/components/formatos-udai/CompletarDatosModal'
import { DetalleReporteIncidenciaModal } from '@/components/formatos-udai/DetalleReporteIncidenciaModal'

function celda(valor: unknown): string {
  if (valor === null || valor === undefined || valor === '') return '—'
  return String(valor)
}

export default async function ReportesIncidenciasPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  if (!(await tienePermiso(session.user.id, 'formatos_udai', 'ver'))) redirect('/formatos-udai')

  const user = session.user as { name: string; apellido?: string; email: string }
  const { tab } = await searchParams
  const tabActivo = tab === 'completas' ? 'completas' : 'pendientes'

  const registros = await listarReportesIncidencia()
  const pendientes = registros.filter(r => r.estadoCompletitud === 'pendiente')
  const completas = registros.filter(r => r.estadoCompletitud === 'completa')
  const visibles = tabActivo === 'pendientes' ? pendientes : completas

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter, sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>
      <DashboardHeader user={user} roleLabel="Formatos UDAI" />

      <main className="pad-pagina" style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <PageHeader
          title="Formato Reportes de"
          accent="Incidencias"
          subtitle="Bitácora de incidentes y puestas a disposición — formato oficial UDAI"
          actions={<>
            <PageHeaderLink href="/formatos-udai" variant="secondary">← Formatos UDAI</PageHeaderLink>
            <BotonExportarExcel href="/api/formatos-udai/reportes-incidencias/exportar" nombreArchivo={`formato_incidencia_${new Date().toISOString().split('T')[0]}.xlsx`} />
          </>}
        />

        <SegmentPage
          activeKey={tabActivo}
          tabs={[
            { key: 'pendientes', label: 'Pendientes', icon: <Clock3 size={13} />, count: pendientes.length, accent: '#b45309', href: '/formatos-udai/reportes-incidencias?tab=pendientes' },
            { key: 'completas', label: 'Completas', icon: <CheckCircle2 size={13} />, count: completas.length, accent: '#15803d', href: '/formatos-udai/reportes-incidencias?tab=completas' },
          ]}
        />

        {tabActivo === 'pendientes' && (
          <p style={{ fontFamily: 'Inter', fontSize: 12, color: '#64748b', margin: 0 }}>
            Estos registros no aparecen en el Excel exportado hasta que se completen y se guarden con &quot;Guardar y marcar como completa&quot;.
          </p>
        )}

        <div className="tabla-wrap">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Inter', fontSize: 12, whiteSpace: 'nowrap' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
                <th style={{ padding: '10px 14px', fontFamily: 'JetBrains Mono', fontSize: 9, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em' }}>Fecha Evento</th>
                <th style={{ padding: '10px 14px', fontFamily: 'JetBrains Mono', fontSize: 9, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em' }}>Folio 911</th>
                <th style={{ padding: '10px 14px', fontFamily: 'JetBrains Mono', fontSize: 9, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em' }}>Detenido</th>
                <th style={{ padding: '10px 14px', fontFamily: 'JetBrains Mono', fontSize: 9, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em' }}>Delito</th>
                <th style={{ padding: '10px 14px', fontFamily: 'JetBrains Mono', fontSize: 9, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em' }}>Sector</th>
                <th style={{ padding: '10px 14px', fontFamily: 'JetBrains Mono', fontSize: 9, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {visibles.length === 0 && (
                <tr><td colSpan={6} style={{ padding: 32, textAlign: 'center', fontFamily: 'JetBrains Mono', fontSize: 12, color: '#94a3b8' }}>
                  {tabActivo === 'pendientes' ? 'No hay registros pendientes de completar' : 'No hay registros completos todavía'}
                </td></tr>
              )}
              {visibles.map(r => (
                <tr key={r.id} style={{ borderTop: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '10px 14px' }}>{celda(r.fechaEvento)}</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'JetBrains Mono', fontSize: 11 }}>{celda(r.folio911)}</td>
                  <td style={{ padding: '10px 14px' }}>{celda(r.detenido)}</td>
                  <td style={{ padding: '10px 14px' }}>{celda(r.delito)}</td>
                  <td style={{ padding: '10px 14px' }}>{celda(r.sector)}</td>
                  <td style={{ padding: '10px 14px', display: 'flex', gap: 8 }}>
                    <DetalleReporteIncidenciaModal row={r} />
                    <CompletarDatosModal row={r} />
                  </td>
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

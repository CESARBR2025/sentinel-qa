import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { Clock, User, FileText } from 'lucide-react'
import React from 'react'
import { GaleriaEvidencias } from '@/components/monitorista/GaleriaEvidencias'
import { tienePermiso } from '@/lib/monitorista/permisos'
import { obtenerSolicitudEvidencia, listarEvidencias } from '@/lib/monitorista/repository'
import { resolverToken } from '@/lib/recursos/token-recurso'
import type { Evidencia } from '@/lib/monitorista/types'
import { DashboardHeader } from '@/components/partials/Header'
import { PageHeader, PageHeaderLink } from '@/components/partials/PageHeader'

export default async function DetalleSolicitudPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  if (!(await tienePermiso(session.user.id, 'solicitudes', 'ver'))) redirect('/monitorista')

  const idReal = await resolverToken('solicitud', id)
  if (!idReal) notFound()

  const sol = await obtenerSolicitudEvidencia(idReal)

  if (!sol) notFound()

  const evidencias: Evidencia[] = await listarEvidencias(idReal)

  const statusBadge = getStatusBadge(sol.status as string)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');
      `}</style>

      <DashboardHeader
        user={session.user as { name: string; apellido?: string; email: string }}
        roleLabel="Monitorista"
      />

      <main className="pad-pagina" style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', gap: 32 }}>
        <PageHeader
          title={String(sol.folioIncidente ?? '') || String(sol.incidenteId).substring(0, 12)}
          subtitle="Solicitud de evidencias"
          actions={<>
            <PageHeaderLink href="/monitorista/solicitudes" variant="secondary">← Bandeja</PageHeaderLink>
            <span style={statusBadge.style}>{statusBadge.label}</span>
          </>}
        />

        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div style={{ flex: '1 1 480px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 24 }}>
            <section style={cardStyle}>
              <h2 style={sectionTitle}><FileText size={18} /> DESCRIPCIÓN DE LA SOLICITUD</h2>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: '#475569', whiteSpace: 'pre-wrap', margin: 0 }}>{sol.descripcion}</p>
            </section>

            <GaleriaEvidencias
              evidencias={evidencias.map((e) => ({
                id: e.id,
                tipo: e.tipo,
                nombreOriginal: e.nombreOriginal,
                urlExpediente: e.urlExpediente ?? '',
                subidoPorNombre: e.subidoPorNombre,
                creadoEn: e.creadoEn ?? '',
              }))}
            />
          </div>

          <div style={{ flex: '1 1 300px', maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={cardStyle}>
              <h2 style={sectionTitle}><User size={18} /> SOLICITANTE</h2>
              <div style={{ fontFamily: 'Inter', fontSize: 14, color: '#1e293b' }}>{sol.solicitadoNombre}</div>
            </div>
            <div style={cardStyle}>
              <h2 style={sectionTitle}><Clock size={18} /> FECHAS</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#64748b', textTransform: 'uppercase' }}>Creada</div>
                  <div style={{ fontFamily: 'Inter', fontSize: 13, color: '#1e293b' }}>
                    {sol.creadoEn ? new Date(sol.creadoEn).toLocaleString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                  </div>
                </div>
                {sol.completadoEn && (
                  <div>
                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#64748b', textTransform: 'uppercase' }}>Completada</div>
                    <div style={{ fontFamily: 'Inter', fontSize: 13, color: '#1e293b' }}>
                      {new Date(sol.completadoEn).toLocaleString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

const cardStyle: React.CSSProperties = {
  background: '#ffffff',
  border: '1px solid #e2e8f0',
  padding: 32,
  borderRadius: 2,
}
const sectionTitle: React.CSSProperties = {
  fontFamily: 'Barlow Condensed', fontSize: 16, fontWeight: 700,
  textTransform: 'uppercase', color: '#0f172a', marginBottom: 20,
  display: 'flex', alignItems: 'center', gap: 10, letterSpacing: '0.05em',
}

function getStatusBadge(status: string): { label: string; style: React.CSSProperties } {
  const base: React.CSSProperties = { padding: '6px 14px', borderRadius: 2, fontSize: 11, fontWeight: 700, fontFamily: 'JetBrains Mono', textTransform: 'uppercase', border: '1px solid' }
  switch (status) {
    case 'pendiente': return { label: 'Pendiente', style: { ...base, background: '#fffbeb', color: '#b45309', borderColor: '#fef3c7' } }
    case 'completada': return { label: 'Completada', style: { ...base, background: '#f0fdf4', color: '#15803d', borderColor: '#dcfce7' } }
    case 'cancelada': return { label: 'Cancelada', style: { ...base, background: '#fef2f2', color: '#dc2626', borderColor: '#fecaca' } }
    default: return { label: status, style: { ...base } }
  }
}

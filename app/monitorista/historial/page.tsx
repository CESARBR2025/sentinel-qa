import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Camera, CheckCircle2, XCircle, FileText, Edit, Plus, PenBox } from 'lucide-react'
import React from 'react'
import { tienePermiso } from '@/lib/monitorista/permisos'
import { listarHistorial } from '@/lib/monitorista/repository'
import type { HistorialEntry } from '@/lib/monitorista/types'
import { DashboardHeader } from '@/components/partials/Header'
import { DashboardFooter } from '@/components/partials/Footer'
import { PageHeader } from '@/components/partials/PageHeader'

export default async function HistorialPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  if (!(await tienePermiso(session.user.id, 'historial', 'ver'))) redirect('/monitorista')

  const registros = await listarHistorial()

  const accionLabel: Record<string, { label: string; icon: React.ReactNode }> = {
    evidencia_subida: { label: 'Evidencia subida', icon: <Camera size={14} color="#1f355a" /> },
    solicitud_completada: { label: 'Solicitud completada', icon: <CheckCircle2 size={14} color="#059669" /> },
    solicitud_cancelada: { label: 'Solicitud cancelada', icon: <XCircle size={14} color="#dc2626" /> },
    incidente_creado: { label: 'Incidente por cámara creado', icon: <Plus size={14} color="#1f355a" /> },
    incidente_editado: { label: 'Incidente por cámara editado', icon: <Edit size={14} color="#b45309" /> },
    campo_editado: { label: 'Campo de detenido editado', icon: <PenBox size={14} color="#1f355a" /> },
    ppt_generado: { label: 'PPT de detenidos generado', icon: <FileText size={14} color="#059669" /> },
  }

  function formatearDetalle(r: HistorialEntry): string {
    if (r.folioIncidente) return String(r.folioIncidente)
    if (r.folioDetenido) return String(r.folioDetenido)
    if (r.icFecha) return `${String(r.icFecha)} ${String(r.icTurno ?? '')}`
    if (r.incidenteId) return String(r.incidenteId).substring(0, 8)
    return '—'
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-background)', color: '#1e293b', fontFamily: 'var(--apple-font-display)' }}>
      <style>{`
        .tabla-wrap { background: #ffffff; border: 1px solid #e2e8f0; border-radius: var(--radius-lg); box-shadow: var(--shadow-card); }
      `}</style>
      <DashboardHeader
        user={session.user as { name: string; apellido?: string; email: string }}
        roleLabel="Monitorista"
        backHref="/monitorista"
        backLabel="Panel"
      />

      <main className="pad-pagina" style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <PageHeader
          title="Historial"
          subtitle="Registro de actividad"
        />

        <div className="tabla-wrap">
          {registros.length === 0 && <div style={{ padding: 48, textAlign: 'center', fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#94a3b8' }}>Sin actividad registrada</div>}
          {registros.length > 0 && (
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
              <thead><tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={thStyle}>Acción</th><th style={thStyle}>Detalle</th><th style={thStyle}>Monitorista</th><th style={thStyle}>Fecha</th>
              </tr></thead>
              <tbody>
                {registros.map((r) => {
                  const info = accionLabel[String(r.accion)] ?? { label: String(r.accion), icon: null }
                  return (
                    <tr key={String(r.id)} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={tdStyle}><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{info.icon}<span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 13, fontWeight: 500 }}>{info.label}</span></div></td>
                      <td style={{ ...tdStyle, fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#64748b' }}>{formatearDetalle(r)}</td>
                      <td style={{ ...tdStyle, fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#1e293b' }}>{String(r.monitoristaNombre ?? '—')}</td>
                      <td style={{ ...tdStyle, fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#64748b' }}>{new Date(String(r.creadoEn)).toLocaleString('es-MX')}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        <DashboardFooter />
      </main>
    </div>
  )
}

const thStyle: React.CSSProperties = { padding: '14px 24px', textAlign: 'left', fontFamily: 'var(--apple-font-display)', fontSize: 12, color: '#64748b', fontWeight: 600, textTransform: 'none', letterSpacing: 'normal' }
const tdStyle: React.CSSProperties = { padding: '14px 24px', fontFamily: 'var(--apple-font-display)', fontSize: 13 }

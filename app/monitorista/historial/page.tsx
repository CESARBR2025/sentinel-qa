import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { query } from '@/lib/db'
import { Camera, CheckCircle2, XCircle, FileText, Edit, Plus, PenBox } from 'lucide-react'
import React from 'react'
import { tienePermiso } from '@/lib/monitorista/permisos'
import { SubHeader } from '@/components/partials/SubHeader'

export default async function HistorialPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  if (!(await tienePermiso(session.user.id, 'historial', 'ver'))) redirect('/monitorista')

  const registros = await query<Record<string, unknown>>(
    `SELECT mh.id, mh.accion, mh.incidente_id, mh.creado_en,
            u.name as monitorista_nombre,
            se.folio_incidente as folio_solicitud,
            rc.folio_reporte_campo as folio_detenido,
            ic.fecha as ic_fecha, ic.turno as ic_turno
     FROM monitorista_historial mh
     LEFT JOIN users u ON mh.monitorista_id = u.id
     LEFT JOIN solicitudes_evidencia se ON mh.solicitud_id = se.id
     LEFT JOIN ofi_reportes_campo rc ON mh.incidente_id = rc.id
     LEFT JOIN incidentes_camara ic ON mh.incidente_id = ic.id
     ORDER BY mh.creado_en DESC LIMIT 200`,
  )

  const user = session.user as { name: string; apellido?: string }

  const accionLabel: Record<string, { label: string; icon: React.ReactNode }> = {
    evidencia_subida: { label: 'Evidencia subida', icon: <Camera size={14} color="#2563eb" /> },
    solicitud_completada: { label: 'Solicitud completada', icon: <CheckCircle2 size={14} color="#059669" /> },
    solicitud_cancelada: { label: 'Solicitud cancelada', icon: <XCircle size={14} color="#dc2626" /> },
    incidente_creado: { label: 'Incidente por cámara creado', icon: <Plus size={14} color="#2563eb" /> },
    incidente_editado: { label: 'Incidente por cámara editado', icon: <Edit size={14} color="#b45309" /> },
    campo_editado: { label: 'Campo de detenido editado', icon: <PenBox size={14} color="#7c3aed" /> },
    ppt_generado: { label: 'PPT de detenidos generado', icon: <FileText size={14} color="#059669" /> },
  }

  function formatearDetalle(r: Record<string, unknown>): string {
    if (r.folio_solicitud) return String(r.folio_solicitud)
    if (r.folio_detenido) return String(r.folio_detenido)
    if (r.ic_fecha) return `${String(r.ic_fecha)} ${String(r.ic_turno ?? '')}`
    if (r.incidente_id) return String(r.incidente_id).substring(0, 8)
    return '—'
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter, sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>
      <SubHeader backHref="/monitorista" backLabel="Monitorista" title="Historial" user={user} />

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 48px' }}>
        <div style={{ marginBottom: 32 }}>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '0.3em', color: '#2563eb', textTransform: 'uppercase', fontWeight: 700 }}>Registro de Actividad</span>
          <h1 style={{ fontFamily: 'Barlow Condensed', fontSize: 36, fontWeight: 800, color: '#0f172a', margin: '4px 0 0 0', textTransform: 'uppercase' }}>Historial</h1>
          <div style={{ width: 64, height: 3, background: '#2563eb', marginTop: 12 }} />
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
          {registros.rows.length === 0 && <div style={{ padding: 48, textAlign: 'center', fontFamily: 'JetBrains Mono', fontSize: 12, color: '#94a3b8' }}>Sin actividad registrada</div>}
          {registros.rows.length > 0 && (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={thStyle}>ACCIÓN</th><th style={thStyle}>DETALLE</th><th style={thStyle}>MONITORISTA</th><th style={thStyle}>FECHA</th>
              </tr></thead>
              <tbody>
                {registros.rows.map((r) => {
                  const info = accionLabel[String(r.accion)] ?? { label: String(r.accion), icon: null }
                  return (
                    <tr key={String(r.id)} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={tdStyle}><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{info.icon}<span style={{ fontFamily: 'JetBrains Mono', fontSize: 11 }}>{info.label}</span></div></td>
                      <td style={{ ...tdStyle, fontFamily: 'JetBrains Mono', fontSize: 11, color: '#64748b' }}>{formatearDetalle(r)}</td>
                      <td style={{ ...tdStyle, fontFamily: 'Inter', fontSize: 12, color: '#1e293b' }}>{String(r.monitorista_nombre ?? '—')}</td>
                      <td style={{ ...tdStyle, fontFamily: 'JetBrains Mono', fontSize: 11, color: '#64748b' }}>{new Date(String(r.creado_en)).toLocaleString('es-MX')}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  )
}

const thStyle: React.CSSProperties = { padding: '14px 24px', textAlign: 'left', fontFamily: 'JetBrains Mono', fontSize: 10, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }
const tdStyle: React.CSSProperties = { padding: '14px 24px', fontFamily: 'Inter', fontSize: 13 }
